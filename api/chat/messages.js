import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { sessionId, afterTs } = req.query;
  if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });

  const list = await kv.lrange(`chat:${sessionId}:messages`, 0, -1);
  const messages = (list || []).map((x) => {
    try { return JSON.parse(x); } catch { return null; }
  }).filter(Boolean);

  if (afterTs) {
    const ts = Number(afterTs);
    return res.status(200).json(messages.filter(m => new Date(m.timestamp).getTime() > ts));
  }

  return res.status(200).json(messages);
}


