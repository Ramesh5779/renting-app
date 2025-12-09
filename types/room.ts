export interface RoomListing {
  id: string;
  title: string;
  description?: string;
  price: number;
  address: {
    street: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  amenities: string[];
  houseRules?: string;
  roomType: 'private' | 'shared';
  availableFrom?: string;
  ownerId: string;
  ownerName: string;
  ownerContact: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  createdAt: string;
}