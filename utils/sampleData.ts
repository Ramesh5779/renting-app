import { RoomListing } from '@/types/room';
import { logger } from '@/utils/logger';
import { StorageService } from './storage';

export const sampleRooms: RoomListing[] = [
  {
    id: '1',
    title: 'Luxury Private Room in SOMA',
    description: 'Stunning private room with panoramic city views in San Francisco\'s tech district. Modern furnishings, private bathroom, and premium amenities. Perfect for professionals.',
    price: 1850,
    address: {
      street: '123 Mission Street, San Francisco, CA 94105',
    },
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center',
    ],
    amenities: ['WiFi', 'AC', 'Furnished', 'CCTV', 'Garage'],
    roomType: 'private',
    availableFrom: 'February 1, 2024',
    ownerId: 'sample-user-1',
    ownerName: 'Sarah Chen',
    ownerContact: '(555) 123-4567',
    createdAt: '2023-12-15T10:00:00.000Z',
    updatedAt: '2023-12-15T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Modern Shared Room in Venice Beach',
    description: 'Stylish shared room just 2 blocks from the beach. Bright, airy space with coastal vibes. Perfect for creatives and beach lovers. Great community atmosphere.',
    price: 1250,
    address: {
      street: '456 Ocean Boulevard, Venice, CA 90291',
    },
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center',
    ],
    amenities: ['WiFi', 'Kitchen', 'Furnished'],
    roomType: 'shared',
    availableFrom: 'January 15, 2024',
    ownerId: 'sample-user-2',
    ownerName: 'Mike Rodriguez',
    ownerContact: '(555) 987-6543',
    createdAt: '2023-12-14T15:30:00.000Z',
    updatedAt: '2023-12-14T15:30:00.000Z',
  },
  {
    id: '3',
    title: 'Designer Studio in Capitol Hill',
    description: 'Architect-designed studio with premium finishes and smart home technology. Located in Seattle\'s vibrant Capitol Hill neighborhood with excellent walkability.',
    price: 2200,
    address: {
      street: '789 Pine Street, Seattle, WA 98122',
    },
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=center',
    ],
    amenities: ['WiFi', 'AC', 'Furnished', 'Kitchen', 'CCTV'],
    roomType: 'private',
    availableFrom: 'March 1, 2024',
    ownerId: 'sample-user-3',
    ownerName: 'Emily Johnson',
    ownerContact: '(555) 456-7890',
    createdAt: '2023-12-13T09:00:00.000Z',
    updatedAt: '2023-12-13T09:00:00.000Z',
  },
  {
    id: '4',
    title: 'Minimalist Loft in Brooklyn',
    description: 'Clean, industrial-chic loft space in trendy Williamsburg. High ceilings, exposed brick, and abundant natural light. Perfect for artists and creatives.',
    price: 1650,
    address: {
      street: '321 Bedford Avenue, Brooklyn, NY 11249',
    },
    images: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop&crop=center',
    ],
    amenities: ['WiFi', 'Furnished', 'Kitchen', 'Garage'],
    roomType: 'private',
    availableFrom: 'February 15, 2024',
    ownerId: 'sample-user-4',
    ownerName: 'Alex Kim',
    ownerContact: '(555) 321-0987',
    createdAt: '2023-12-12T14:20:00.000Z',
    updatedAt: '2023-12-12T14:20:00.000Z',
  }
];

export const addSampleData = async () => {
  try {
    // Check if data already exists
    const existingRooms = await StorageService.getAllRoomListings();

    if (existingRooms.length === 0) {
      // Add sample rooms one by one
      for (const room of sampleRooms) {
        await StorageService.saveRoomListing(room);
      }
      logger.log('Sample data added successfully');
      return true;
    } else {
      logger.log('Sample data already exists');
      return false;
    }
  } catch (error) {
    logger.error('Failed to add sample data:', error);
    return false;
  }
};

export const forceSampleData = async () => {
  try {
    // Force add sample rooms regardless of existing data
    for (const room of sampleRooms) {
      await StorageService.saveRoomListing(room);
    }
    logger.log('Sample data force added successfully');
    return true;
  } catch (error) {
    logger.error('Failed to force add sample data:', error);
    return false;
  }
};