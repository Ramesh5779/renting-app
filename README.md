# 🏠 RentRoom App

A React Native room rental app similar to Airbnb, specifically designed for people looking to rent rooms. House owners can list their rooms with high-quality images and detailed addresses, while renters can easily browse and contact property owners.

## ✨ Features

### For Renters (Room Seekers)
- **Browse Rooms**: Search and filter available rooms by location, price, and room type
- **High-Quality Images**: View detailed photos of each room
- **Contact Owners**: Directly contact room owners with their phone numbers
- **Search Functionality**: Find rooms by city, title, or location

### For Room Owners (Hosts)
- **List Rooms**: Create detailed listings for your available rooms
- **Photo Upload**: Add up to 10 high-quality images per listing
- **Location Services**: Auto-fill address using current location
- **Manage Listings**: View, edit, and delete your room listings
- **Room Types**: List private or shared rooms

### Additional Features
- **Profile Management**: Update personal information and contact details
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Offline Storage**: All data stored locally using AsyncStorage
- **Cross-Platform**: Works on iOS, Android, and Web

## 🚀 Get Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the app**
   ```bash
   npx expo start
   ```

3. **Run on your preferred platform**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator  
   - Press `w` for Web Browser
   - Scan QR code with Expo Go app for physical device

## 📱 App Structure

### Main Tabs
- **Browse Rooms**: Search and view available room listings
- **List Room**: Create new room listings (for property owners)
- **My Listings**: Manage your posted room listings
- **Profile**: Update personal information and app settings

### Key Screens
- Room browsing with search and filters
- Detailed room listing creation form
- Image picker with camera and gallery options
- Location services for address auto-fill
- Contact management and owner communication

## 🛠 Technical Details

### Built With
- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **TypeScript** - Type-safe development
- **Expo Router** - File-based navigation
- **AsyncStorage** - Local data persistence
- **Expo Image Picker** - Camera and gallery access
- **Expo Location** - GPS location services

### Project Structure
```
├── app/                    # Main app screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Browse rooms screen
│   │   ├── list-room.tsx  # Create listing screen
│   │   ├── my-listings.tsx # Manage listings screen
│   │   └── profile.tsx    # User profile screen
│   └── _layout.tsx        # Root layout
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions and services
├── components/            # Reusable UI components
└── constants/             # App constants and themes
```

## 📋 Permissions Required

### iOS
- Camera access for room photos
- Photo library access for selecting images
- Location services for address auto-fill

### Android  
- Camera permission
- Storage read/write permissions
- Fine and coarse location permissions

## 🔧 Development

### Sample Data
The app includes sample room listings that are automatically loaded on first run to demonstrate functionality.

### Storage
All data is stored locally using AsyncStorage. In a production app, this would be replaced with a backend API and database.

### Customization
- Update colors and themes in `constants/theme.ts`
- Modify room listing fields in `types/room.ts`
- Customize storage logic in `utils/storage.ts`

## 🚀 Future Enhancements

- Backend API integration
- User authentication and profiles
- Real-time messaging between renters and owners
- Map integration for location-based search
- Push notifications for new listings
- Payment integration
- Reviews and ratings system
- Advanced filtering options

## 📄 License

This project is built with Expo and follows standard React Native development practices.
