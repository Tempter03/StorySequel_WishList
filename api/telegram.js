import { store } from './_store.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return {}; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const update = await readBody(req);
    // 1) Обработка нажатия inline-кнопки
    if (update.callback_query) {
      const cq = update.callback_query;
      const data = cq.data || '';
      if (data.startsWith('reply:')) {
        const sessionId = data.slice('reply:'.length);
        await store.setReplyTarget(cq.from.id, sessionId);
        // подтверждаем и подсказываем формат
        return res.status(200).json({ ok: true });
      }
    }

    const msg = update.message || update.edited_message;
    if (!msg) return res.status(200).json({ ok: true });

    const text = msg.text || '';
    const from = msg.from?.first_name || 'Администратор';

    // 1) Если ответом на сообщение с маркером #sid:<sessionId>
    let sessionId = null;
    if (msg.reply_to_message?.text) {
      const rt = msg.reply_to_message.text;
      const m = rt.match(/#sid:([a-z0-9_\-]+)/i);
      if (m) sessionId = m[1];
    }

    // 2) Если пользователь нажимал кнопку, используем сохранённую цель
    let answer = text;
    if (!sessionId) {
      const target = await store.getReplyTarget(msg.from?.id);
      if (target) {
        sessionId = target;
      }
    }
    // 3) Фолбэк: формат "session_xxx: ответ"
    if (!sessionId) {
      const m2 = text.match(/^(session_[a-z0-9_\-]+)\s*:\s*([\s\S]+)/i);
      if (m2) {
        sessionId = m2[1];
        answer = m2[2];
      } else {
        return res.status(200).json({ ok: true });
      }
    }

    const adminMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      text: answer,
      sender: 'admin',
      userName: from,
      timestamp: new Date().toISOString()
    };

    await store.appendMessage(sessionId, adminMessage);

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(200).json({ ok: true });
  }
}


