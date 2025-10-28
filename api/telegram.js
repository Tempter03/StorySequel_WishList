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
    const msg = update.message || update.edited_message;
    if (!msg) return res.status(200).json({ ok: true });

    const text = msg.text || '';
    const from = msg.from?.first_name || 'Администратор';

    // Ожидаем, что оператор начнет сообщение с sessionId, например:
    // session_12345: Ответ
    const match = text.match(/^(session_[a-z0-9_\-]+)\s*:\s*([\s\S]+)/i);
    if (!match) return res.status(200).json({ ok: true });

    const sessionId = match[1];
    const answer = match[2];

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


