import { store } from '../_store.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    if (!process.env.KV_URL) {
      console.warn('KV is not configured. Set Vercel KV environment variables.');
    }

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await store.initSession(sessionId);
    // список сообщений создастся при первом rpush в send

    await store.addSession(sessionId);
    return res.status(200).json({ sessionId });
  } catch (e) {
    console.error('connect error', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


