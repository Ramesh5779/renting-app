import { Platform } from 'react-native';
// Use legacy API for compatibility
import * as FileSystem from 'expo-file-system/legacy';
import { ImageCompressionService } from './imageCompression';

const getImagesDir = () => {
    if (Platform.OS === 'web') return null;

    // Use documentDirectory if available, otherwise use cacheDirectory
    const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;

    if (!baseDir) {
        console.error('[ImageStorage] No storage directory available');
        return null;
    }

    return baseDir + 'images/';
};

// Ensure the directory exists (native only)
const ensureDirExists = async () => {
    const IMAGES_DIR = getImagesDir();
    if (!IMAGES_DIR) return;

    const dirInfo = await FileSystem.getInfoAsync(IMAGES_DIR);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
    }
};

// Convert blob URI to base64 data URL (web only)
async function convertToBase64(uri: string): Promise<string> {
    try {
        console.log('[ImageStorage] Converting to base64...');

        // If already base64, return it
        if (uri.startsWith('data:')) {
            return uri;
        }

        const response = await fetch(uri);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('[ImageStorage] Error converting to base64:', error);
        throw error;
    }
}

export const ImageStorageService = {
    async saveImage(uri: string): Promise<string> {
        try {
            console.log('[ImageStorage] Platform:', Platform.OS);
            console.log('[ImageStorage] Saving image:', uri.substring(0, 100));

            // On web, convert to base64 data URL
            if (Platform.OS === 'web') {
                console.log('[ImageStorage] Web - converting to base64');
                const base64 = await convertToBase64(uri);
                console.log('[ImageStorage] ✅ Converted to base64, length:', base64.length);
                return base64;
            }

            // On native, compress and save to file system
            console.log('[ImageStorage] Native platform - checking file system...');
            console.log('[ImageStorage] documentDirectory:', FileSystem.documentDirectory);
            console.log('[ImageStorage] cacheDirectory:', FileSystem.cacheDirectory);

            const IMAGES_DIR = getImagesDir();
            console.log('[ImageStorage] Images directory:', IMAGES_DIR);

            if (!IMAGES_DIR) {
                throw new Error('Images directory not available');
            }

            await ensureDirExists();
            console.log('[ImageStorage] Directory ensured');

            // Compress the image
            console.log('[ImageStorage] Compressing image...');
            const compressedUri = await ImageCompressionService.compressImage(uri);
            console.log('[ImageStorage] Compressed URI:', compressedUri);

            // Generate unique filename
            const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            const destination = IMAGES_DIR + filename;
            console.log('[ImageStorage] Destination:', destination);

            // Copy file
            await FileSystem.copyAsync({
                from: compressedUri,
                to: destination,
            });

            console.log('[ImageStorage] ✅ Saved to:', destination);
            return destination;
        } catch (error) {
            console.error('[ImageStorage] ❌ Error saving image:', error);
            throw error;
        }
    },

    async deleteImage(uri: string): Promise<void> {
        try {
            if (Platform.OS === 'web') return; // Can't delete base64

            const IMAGES_DIR = getImagesDir();
            if (!IMAGES_DIR) return;

            if (uri.startsWith(IMAGES_DIR)) {
                await FileSystem.deleteAsync(uri, { idempotent: true });
                console.log('[ImageStorage] Deleted:', uri);
            }
        } catch (error) {
            console.error('[ImageStorage] Error deleting image:', error);
        }
    }
};
