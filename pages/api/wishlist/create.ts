import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { Wishlist, CreateWishlistRequest } from '@/types';
import { saveWishlist } from '@/lib/storage';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { creatorName, creatorEmail, items }: CreateWishlistRequest = req.body;

    if (!creatorName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wishlist: Wishlist = {
      id: uuidv4(),
      creatorName,
      creatorEmail,
      createdAt: new Date().toISOString(),
      items: items.map(item => ({
        ...item,
        id: uuidv4(),
        reserved: false,
      })),
    };

    saveWishlist(wishlist);

    res.status(201).json({ 
      success: true, 
      wishlistId: wishlist.id,
      wishlist 
    });
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
}

