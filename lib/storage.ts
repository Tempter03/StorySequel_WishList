import { Wishlist } from '@/types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const WISHLISTS_FILE = path.join(DATA_DIR, 'wishlists.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize wishlists file if it doesn't exist
if (!fs.existsSync(WISHLISTS_FILE)) {
  fs.writeFileSync(WISHLISTS_FILE, JSON.stringify({}));
}

export function saveWishlist(wishlist: Wishlist): void {
  const wishlists = getAllWishlists();
  wishlists[wishlist.id] = wishlist;
  fs.writeFileSync(WISHLISTS_FILE, JSON.stringify(wishlists, null, 2));
}

export function getWishlist(id: string): Wishlist | null {
  const wishlists = getAllWishlists();
  return wishlists[id] || null;
}

export function getAllWishlists(): Record<string, Wishlist> {
  try {
    const data = fs.readFileSync(WISHLISTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

export function updateWishlist(id: string, updates: Partial<Wishlist>): Wishlist | null {
  const wishlist = getWishlist(id);
  if (!wishlist) return null;
  
  const updatedWishlist = { ...wishlist, ...updates };
  saveWishlist(updatedWishlist);
  return updatedWishlist;
}

