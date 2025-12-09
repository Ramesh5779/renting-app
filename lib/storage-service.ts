import { parseError } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

export const SupabaseStorageService = {
    /**
     * Upload an image to Supabase Storage
     * @param uri - Local file URI
     * @param userId - User ID for organizing files
     * @returns Public URL of uploaded image
     */
    async uploadImage(uri: string, userId: string): Promise<string> {
        try {
            // Generate unique filename with random string to prevent collisions
            const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
            const uniqueId = Math.random().toString(36).substring(7);
            const fileName = `${userId}/${Date.now()}-${uniqueId}.${fileExt}`;

            // Read file as base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: 'base64',
            });

            // Convert base64 to ArrayBuffer
            const arrayBuffer = decode(base64);

            // Determine content type
            const contentType = this.getContentType(fileExt);

            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('room-images')
                .upload(fileName, arrayBuffer, {
                    contentType,
                    upsert: true,
                });

            if (error) throw parseError(error);

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('room-images')
                .getPublicUrl(data.path);

            return publicUrl;
        } catch (error) {
            logger.error('Error uploading image:', error);
            throw parseError(error);
        }
    },

    /**
     * Upload multiple images
     */
    async uploadImages(uris: string[], userId: string): Promise<string[]> {
        const uploadPromises = uris.map(uri => this.uploadImage(uri, userId));
        return Promise.all(uploadPromises);
    },

    /**
     * Delete an image from Supabase Storage
     */
    async deleteImage(imageUrl: string): Promise<void> {
        try {
            // Extract path from URL
            const path = this.extractPathFromUrl(imageUrl);
            if (!path) {
                logger.warn('[SupabaseStorage] Skipping deletion for invalid URL:', imageUrl);
                return;
            }

            const { error } = await supabase.storage
                .from('room-images')
                .remove([path]);

            if (error) throw error;
        } catch (error) {
            logger.error('Error deleting image:', error);
            // Don't throw error to allow listing deletion to proceed
        }
    },

    /**
     * Delete multiple images
     */
    async deleteImages(imageUrls: string[]): Promise<void> {
        const deletePromises = imageUrls.map(url => this.deleteImage(url));
        await Promise.all(deletePromises);
    },

    // Helper functions
    getContentType(fileExt: string): string {
        const types: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            gif: 'image/gif',
            webp: 'image/webp',
        };
        return types[fileExt] || 'image/jpeg';
    },

    extractPathFromUrl(url: string): string | null {
        try {
            // Decode URL to handle %20 etc
            const decodedUrl = decodeURIComponent(url);
            const match = decodedUrl.match(/room-images\/(.+)$/);
            const path = match ? match[1] : null;

            if (path) {
                logger.log('[SupabaseStorage] Extracted path:', path);
            } else {
                logger.warn('[SupabaseStorage] Failed to extract path from:', url);
            }

            return path;
        } catch (error) {
            logger.error('[SupabaseStorage] Error extracting path:', error);
            return null;
        }
    },
};
