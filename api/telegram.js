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
        const chatId = cq.message?.chat?.id || cq.from.id;
        await store.setReplyTarget(chatId, sessionId, cq.from?.id);
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        try {
          // 1) ответим на нажатие (убирает крутилку)
          await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ callback_query_id: cq.id, text: 'Режим ответа включён', show_alert: false })
          });
          // 2) визуально обновим кнопку
          await fetch(`https://api.telegram.org/bot${botToken}/editMessageReplyMarkup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: cq.message?.message_id,
              reply_markup: { inline_keyboard: [[{ text: `Ответ активен (${sessionId})`, callback_data: `reply:${sessionId}` }]] }
            })
          });
          // 3) пришлём явную подсказку в чат
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: `Напишите ответ — он уйдёт пользователю (сессия: ${sessionId}).` })
          });
        } catch (err) {
          console.error('callback reply error', err);
        }
        return res.status(200).json({ ok: true });
      }
    }

    const msg = update.message || update.edited_message;
    if (!msg) return res.status(200).json({ ok: true });

    const text = msg.text || msg.caption || '';
    const from = msg.from?.first_name || 'Администратор';

    // 1) Если ответом на сообщение с маркером #sid:<sessionId>
    let sessionId = null;
    if (msg.reply_to_message?.text || msg.reply_to_message?.caption) {
      const rt = msg.reply_to_message.text || msg.reply_to_message.caption || '';
      const m = rt.match(/#sid:([a-z0-9_\-]+)/i);
      if (m) sessionId = m[1];
    }

    // 2) Поддержка формата "#sid:session_xxx: текст"
    let answer = text;
    if (!sessionId) {
      const m3 = text.match(/^#sid:([a-z0-9_\-]+)\s*:\s*([\s\S]+)/i);
      if (m3) {
        sessionId = m3[1];
        answer = m3[2];
      }
    }

    // 3) Если пользователь нажимал кнопку, используем сохранённую цель
    if (!sessionId) {
      const chatId = msg.chat?.id || msg.from?.id;
      const target = await store.getReplyTargetAny(chatId, msg.from?.id);
      if (target) {
        sessionId = target;
      }
    }
    // 4) Фолбэк: формат "session_xxx: ответ"
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


