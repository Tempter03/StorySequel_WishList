import { kv as vercelKv } from '@vercel/kv';

const memory = (globalThis.__chatStore ||= new Map());

function hasKv() {
  return Boolean(process.env.KV_URL && vercelKv);
}

export const store = {
  async appendMessage(sessionId, msg) {
    if (hasKv()) {
      await vercelKv.rpush(`chat:${sessionId}:messages`, JSON.stringify(msg));
      return;
    }
    const list = memory.get(sessionId) || [];
    list.push(msg);
    memory.set(sessionId, list);
  },
  async listMessages(sessionId) {
    if (hasKv()) {
      const list = await vercelKv.lrange(`chat:${sessionId}:messages`, 0, -1);
      return (list || []).map((x) => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
    }
    return memory.get(sessionId) || [];
  },
  async initSession(sessionId) {
    if (hasKv()) {
      await vercelKv.hset(`chat:${sessionId}`, { createdAt: Date.now() });
    } else if (!memory.has(sessionId)) {
      memory.set(sessionId, []);
    }
  }
};


