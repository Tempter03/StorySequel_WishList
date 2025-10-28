import { store } from '../_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { sessionId, text } = req.body || {};
  if (!sessionId || !text) return res.status(400).json({ error: 'sessionId and text are required' });

  const adminMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    text,
    sender: 'admin',
    userName: 'Оператор',
    timestamp: new Date().toISOString()
  };

  await store.appendMessage(sessionId, adminMessage);
  return res.status(200).json({ ok: true, message: adminMessage });
}


