import { logger } from '@/utils/logger';
import * as FileSystem from 'expo-file-system/legacy';

export const ImageValidationService = {
    /**
     * Validates if an image file is within the specified size limit
     * @param uri The file URI of the image
     * @param limitMB The size limit in Megabytes (default 5MB)
     * @returns Object containing valid status and error message if invalid
     */
    async validateImageSize(uri: string, limitMB: number = 5): Promise<{ valid: boolean; error?: string }> {
        try {
            const fileInfo = await FileSystem.getInfoAsync(uri);

            if (!fileInfo.exists) {
                return { valid: false, error: 'File does not exist' };
            }

            const sizeInBytes = fileInfo.size;
            const limitInBytes = limitMB * 1024 * 1024;

            if (sizeInBytes > limitInBytes) {
                const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
                return {
                    valid: false,
                    error: `Image is too large (${sizeMB}MB). Maximum size is ${limitMB}MB.`
                };
            }

            return { valid: true };
        } catch (error) {
            logger.error('Error validating image size:', error);
            // Fail safe - allow if we can't check, but log error
            return { valid: true };
        }
    }
};
