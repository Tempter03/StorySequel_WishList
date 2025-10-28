import type { NextApiRequest, NextApiResponse } from 'next';
import { getWishlist } from '@/lib/storage';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid wishlist ID' });
  }

  try {
    const wishlist = getWishlist(id);

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
}

