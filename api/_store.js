import { kv as vercelKv } from '@vercel/kv';

const memory = (globalThis.__chatStore ||= new Map());
const replyMap = (globalThis.__replyTargets ||= new Map());
const sessions = (globalThis.__chatSessions ||= new Map());

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
    sessions.set(sessionId, { lastTs: Date.now() });
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
      await vercelKv.zadd('chat:sessions', { score: Date.now(), member: sessionId });
    } else if (!memory.has(sessionId)) {
      memory.set(sessionId, []);
      sessions.set(sessionId, { lastTs: Date.now() });
    }
  },
  async addSession(sessionId) {
    return this.initSession(sessionId);
  },
  async listSessions(limit = 100) {
    if (hasKv()) {
      const ids = await vercelKv.zrevrange('chat:sessions', 0, limit - 1);
      return ids.map((id) => ({ sessionId: id }));
    }
    return Array.from(sessions.keys()).slice(-limit).reverse().map((id) => ({ sessionId: id }));
  },
  async setReplyTarget(chatId, sessionId, userId) {
    // сохраняем соответствие ЧАТА (а не пользователя) и целевой сессии на 10 минут
    replyMap.set(String(chatId), { sessionId, ts: Date.now() });
    if (userId) replyMap.set(`u:${String(userId)}`, { sessionId, ts: Date.now() });
  },
  async getReplyTarget(chatId, userId) {
    const rec = replyMap.get(String(chatId));
    if (!rec) return null;
    // истечение через 10 минут
    if (Date.now() - rec.ts > 10 * 60 * 1000) {
      replyMap.delete(String(chatId));
      return null;
    }
    return rec.sessionId;
  },
  async getReplyTargetAny(chatId, userId) {
    const first = await this.getReplyTarget(chatId, userId);
    if (first) return first;
    const rec = replyMap.get(`u:${String(userId)}`);
    if (!rec) return null;
    if (Date.now() - rec.ts > 10 * 60 * 1000) {
      replyMap.delete(`u:${String(userId)}`);
      return null;
    }
    return rec.sessionId;
  }
};


