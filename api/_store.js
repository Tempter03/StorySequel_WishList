import { kv as vercelKv } from '@vercel/kv';

const memory = (globalThis.__chatStore ||= new Map());
const replyMap = (globalThis.__replyTargets ||= new Map());

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
  },
  async setReplyTarget(chatId, sessionId) {
    // сохраняем соответствие ЧАТА (а не пользователя) и целевой сессии на 10 минут
    replyMap.set(String(chatId), { sessionId, ts: Date.now() });
  },
  async getReplyTarget(chatId) {
    const rec = replyMap.get(String(chatId));
    if (!rec) return null;
    // истечение через 10 минут
    if (Date.now() - rec.ts > 10 * 60 * 1000) {
      replyMap.delete(String(chatId));
      return null;
    }
    return rec.sessionId;
  }
};


