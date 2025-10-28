import { Wishlist } from '@/types';
import Redis from 'ioredis';

// Create Redis client
const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL environment variable is not set');
  }
  return new Redis(process.env.REDIS_URL);
};

const WISHLIST_PREFIX = 'wishlist:';

export async function saveWishlist(wishlist: Wishlist): Promise<void> {
  const redis = getRedisClient();
  try {
    await redis.set(
      `${WISHLIST_PREFIX}${wishlist.id}`,
      JSON.stringify(wishlist)
    );
  } finally {
    await redis.quit();
  }
}

export async function getWishlist(id: string): Promise<Wishlist | null> {
  const redis = getRedisClient();
  try {
    const data = await redis.get(`${WISHLIST_PREFIX}${id}`);
    if (!data) return null;
    return JSON.parse(data);
  } finally {
    await redis.quit();
  }
}

export async function getAllWishlists(): Promise<Record<string, Wishlist>> {
  const redis = getRedisClient();
  try {
    const keys = await redis.keys(`${WISHLIST_PREFIX}*`);
    const wishlists: Record<string, Wishlist> = {};
    
    for (const key of keys) {
      const data = await redis.get(key);
      if (data) {
        const wishlist = JSON.parse(data);
        wishlists[wishlist.id] = wishlist;
      }
    }
    
    return wishlists;
  } finally {
    await redis.quit();
  }
}

export async function updateWishlist(id: string, updates: Partial<Wishlist>): Promise<Wishlist | null> {
  const wishlist = await getWishlist(id);
  if (!wishlist) return null;
  
  const updatedWishlist = { ...wishlist, ...updates };
  await saveWishlist(updatedWishlist);
  return updatedWishlist;
}

