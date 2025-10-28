import type { NextApiRequest, NextApiResponse } from 'next';
import { getWishlist, saveWishlist } from '@/lib/storage';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wishlistId, itemId, reservedBy } = req.body;

    if (!wishlistId || !itemId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const wishlist = await getWishlist(wishlistId);

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    const itemIndex = wishlist.items.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    if (wishlist.items[itemIndex].reserved) {
      return res.status(400).json({ error: 'Item already reserved' });
    }

    wishlist.items[itemIndex].reserved = true;
    wishlist.items[itemIndex].reservedBy = reservedBy || 'Гость';

    await saveWishlist(wishlist);

    res.status(200).json({ 
      success: true, 
      message: 'Item reserved successfully',
      wishlist 
    });
  } catch (error) {
    console.error('Error reserving item:', error);
    res.status(500).json({ error: 'Failed to reserve item' });
  }
}

