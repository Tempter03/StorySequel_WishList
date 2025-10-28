import { store } from '../_store';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { sessionId, message, userName = 'Гость' } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
    if (!message) return res.status(400).json({ error: 'message is required' });

    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      text: message,
      sender: 'user',
      userName,
      timestamp: new Date().toISOString()
    };

    await store.appendMessage(sessionId, msg);

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const text = `👤 ${userName} (${sessionId}):\n${message}`;
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text })
      });
    }

    return res.status(200).json({ ok: true, message: msg });
  } catch (e) {
    console.error('send error', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


