# 🔧 Настройка постоянного хранилища на Vercel

## ⚠️ Важно!

Текущая версия использует **временное хранилище в памяти**. Это означает:
- ✅ Работает для тестирования
- ❌ Данные сбрасываются при каждом новом деплое
- ❌ Данные теряются при перезапуске serverless функций

Для **production** нужно настроить постоянное хранилище.

## 🚀 Вариант 1: Vercel KV (Redis) - Рекомендуется

### Преимущества:
- ✅ Бесплатный тариф (30 тыс. команд/день)
- ✅ Встроенная интеграция с Vercel
- ✅ Очень быстрая работа
- ✅ Простая настройка

### Настройка:

1. **Создайте KV базу данных:**
   - Откройте ваш проект на vercel.com
   - Перейдите в **Storage** → **Create Database**
   - Выберите **KV** (Redis)
   - Нажмите **Continue** → **Create**

2. **Подключите к проекту:**
   - Vercel автоматически добавит переменные окружения
   - Переменные: `KV_REST_API_URL`, `KV_REST_API_TOKEN`

3. **Установите пакет:**
```bash
npm install @vercel/kv
```

4. **Обновите `lib/storage.ts`:**

```typescript
import { Wishlist } from '@/types';
import { kv } from '@vercel/kv';

const WISHLISTS_KEY = 'wishlists';

export async function saveWishlist(wishlist: Wishlist): Promise<void> {
  await kv.hset(WISHLISTS_KEY, { [wishlist.id]: JSON.stringify(wishlist) });
}

export async function getWishlist(id: string): Promise<Wishlist | null> {
  const data = await kv.hget(WISHLISTS_KEY, id);
  if (!data) return null;
  return JSON.parse(data as string);
}

export async function getAllWishlists(): Promise<Record<string, Wishlist>> {
  const data = await kv.hgetall(WISHLISTS_KEY);
  if (!data) return {};
  
  const wishlists: Record<string, Wishlist> = {};
  for (const [id, value] of Object.entries(data)) {
    wishlists[id] = JSON.parse(value as string);
  }
  return wishlists;
}

export async function updateWishlist(id: string, updates: Partial<Wishlist>): Promise<Wishlist | null> {
  const wishlist = await getWishlist(id);
  if (!wishlist) return null;
  
  const updatedWishlist = { ...wishlist, ...updates };
  await saveWishlist(updatedWishlist);
  return updatedWishlist;
}
```

5. **Обновите API routes** (сделайте их async):

`pages/api/wishlist/create.ts`:
```typescript
export default async function handler(req, res) {
  // ... ваш код ...
  await saveWishlist(wishlist);
  // ...
}
```

6. **Задеплойте:**
```bash
git add .
git commit -m "Add Vercel KV storage"
git push
```

## 💾 Вариант 2: Vercel Postgres

### Настройка:

1. **Создайте Postgres базу:**
   - Storage → Create Database → Postgres

2. **Установите пакеты:**
```bash
npm install @vercel/postgres
```

3. **Создайте таблицу:**
```sql
CREATE TABLE wishlists (
  id TEXT PRIMARY KEY,
  creator_name TEXT NOT NULL,
  creator_email TEXT,
  created_at TIMESTAMP NOT NULL,
  items JSONB NOT NULL
);
```

4. **Обновите storage.ts** для работы с SQL

## 🌿 Вариант 3: MongoDB Atlas (Бесплатный)

### Настройка:

1. **Создайте кластер на** [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Получите connection string**

3. **Установите пакет:**
```bash
npm install mongodb
```

4. **Добавьте в Vercel Environment Variables:**
   - `MONGODB_URI` = ваш connection string

5. **Обновите storage.ts:**
```typescript
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db('flower-wishlist');
const collection = db.collection('wishlists');

export async function saveWishlist(wishlist: Wishlist) {
  await collection.updateOne(
    { id: wishlist.id },
    { $set: wishlist },
    { upsert: true }
  );
}

export async function getWishlist(id: string) {
  return await collection.findOne({ id });
}
```

## 🎯 Рекомендация

**Для вашего проекта лучше всего подходит Vercel KV:**
- Простая настройка (5 минут)
- Бесплатный тариф достаточен
- Отлично работает с Next.js
- Не требует SQL знаний

## 📊 Сравнение решений

| Решение | Сложность | Бесплатный лимит | Скорость |
|---------|-----------|------------------|----------|
| Vercel KV | ⭐ Легко | 30K команд/день | ⚡⚡⚡ |
| Vercel Postgres | ⭐⭐ Средне | 60 часов | ⚡⚡ |
| MongoDB Atlas | ⭐⭐ Средне | 512 MB | ⚡⚡ |
| In-Memory (текущее) | ⭐ Очень легко | ∞ | ⚡⚡⚡ |

## 🔄 Миграция данных

Если у вас уже есть данные в старой версии, вы можете экспортировать их и импортировать в новое хранилище.

---

**Нужна помощь?** Напишите на storyflowerssss@gmail.com

