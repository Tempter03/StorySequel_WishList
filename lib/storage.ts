import { Wishlist } from '@/types';

// In-memory storage for Vercel serverless environment
// Note: This will reset on each deployment. For production, use Vercel KV or a database.
const wishlists: Record<string, Wishlist> = {};

export function saveWishlist(wishlist: Wishlist): void {
  wishlists[wishlist.id] = wishlist;
}

export function getWishlist(id: string): Wishlist | null {
  return wishlists[id] || null;
}

export function getAllWishlists(): Record<string, Wishlist> {
  return wishlists;
}

export function updateWishlist(id: string, updates: Partial<Wishlist>): Wishlist | null {
  const wishlist = getWishlist(id);
  if (!wishlist) return null;
  
  const updatedWishlist = { ...wishlist, ...updates };
  saveWishlist(updatedWishlist);
  return updatedWishlist;
}

