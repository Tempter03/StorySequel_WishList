export interface WishlistItem {
  id: string;
  bouquetName: string;
  bouquetImage?: string;
  date: string;
  notes?: string;
  reserved: boolean;
  reservedBy?: string;
}

export interface Wishlist {
  id: string;
  creatorName: string;
  creatorEmail?: string;
  deliveryAddress: string;
  createdAt: string;
  items: WishlistItem[];
}

export interface CreateWishlistRequest {
  creatorName: string;
  creatorEmail?: string;
  deliveryAddress: string;
  items: Omit<WishlistItem, 'id' | 'reserved'>[];
}

