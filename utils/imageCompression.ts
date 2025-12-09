import { logger } from '@/utils/logger';
import * as ImageManipulator from 'expo-image-manipulator';
import { Platform } from 'react-native';

const MAX_IMAGE_DIMENSION = 1200;
const COMPRESSION_QUALITY = 0.7;

export const ImageCompressionService = {
    async compressImage(uri: string): Promise<string> {
        try {
            logger.log('[ImageCompression] Starting compression for:', uri);

            // On web, check if it's a data URI already
            if (Platform.OS === 'web' && uri.startsWith('data:')) {
                logger.log('[ImageCompression] Skipping compression for data URI');
                return uri;
            }

            // Get image info to calculate resize dimensions
            const result = await ImageManipulator.manipulateAsync(
                uri,
                [
                    // Resize to max dimension while maintaining aspect ratio
                    { resize: { width: MAX_IMAGE_DIMENSION } }
                ],
                {
                    compress: COMPRESSION_QUALITY,
                    format: ImageManipulator.SaveFormat.JPEG,
                }
            );

            logger.log('[ImageCompression] ✅ Compression successful');
            logger.log('[ImageCompression] New URI:', result.uri);
            logger.log('[ImageCompression] Dimensions:', `${result.width}x${result.height}`);

            return result.uri;
        } catch (error) {
            logger.error('[ImageCompression] ❌ Error compressing image:', error);
            logger.warn('[ImageCompression] Falling back to original URI');
            // If compression fails, return original URI
            return uri;
        }
    },

    async compressMultipleImages(uris: string[]): Promise<string[]> {
        logger.log(`[ImageCompression] Compressing ${uris.length} images...`);

        const compressed = await Promise.all(
            uris.map(async (uri, index) => {
                logger.log(`[ImageCompression] [${index + 1}/${uris.length}] Processing...`);
                return await this.compressImage(uri);
            })
        );

        logger.log('[ImageCompression] ✅ All images compressed');
        return compressed;
    }
};
