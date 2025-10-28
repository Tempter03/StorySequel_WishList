import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await kv.hset(`chat:${sessionId}`, { createdAt: Date.now() });
  // Список сообщений создастся автоматически при первом rpush

  return res.status(200).json({ sessionId });
}


