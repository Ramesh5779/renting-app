// High-quality placeholder images for room listings
export const PlaceholderImages = {
  // Modern minimalist room images
  rooms: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=600&fit=crop&crop=center',
  ],
  
  // Default fallback for empty states
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjhGOUZBIi8+CjxwYXRoIGQ9Ik0xNTAgMTIwSDI1MFYxODBIMTUwVjEyMFoiIGZpbGw9IiNFNUU3RUIiLz4KPHBhdGggZD0iTTE3MCA5MEgyMzBWMTIwSDE3MFY5MFoiIGZpbGw9IiNFNUU3RUIiLz4KPHRleHQgeD0iMjAwIiB5PSIyMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2QjcyODAiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
};

// Function to get a random placeholder image
export function getRandomPlaceholderImage(): string {
  const randomIndex = Math.floor(Math.random() * PlaceholderImages.rooms.length);
  return PlaceholderImages.rooms[randomIndex];
}

// Function to get placeholder for specific room types
export function getPlaceholderByRoomType(roomType: 'private' | 'shared'): string {
  if (roomType === 'private') {
    // Return more luxury/private looking images
    const privateImages = PlaceholderImages.rooms.slice(0, 4);
    const randomIndex = Math.floor(Math.random() * privateImages.length);
    return privateImages[randomIndex];
  } else {
    // Return more shared/common area looking images
    const sharedImages = PlaceholderImages.rooms.slice(4);
    const randomIndex = Math.floor(Math.random() * sharedImages.length);
    return sharedImages[randomIndex];
  }
}