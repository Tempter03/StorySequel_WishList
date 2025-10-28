import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  await kv.hset(`chat:${sessionId}`, { createdAt: Date.now() });
  await kv.rpush(`chat:${sessionId}:messages`, []);

  res.status(200).json({ sessionId });
}


