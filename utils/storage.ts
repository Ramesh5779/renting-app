import { AuthService } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { RoomListing, User } from '@/types/room';
import { parseError } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';

export const StorageService = {
  // Room listings
  async saveRoomListing(listing: RoomListing): Promise<void> {
    try {
      await DatabaseService.createListing(listing);
    } catch (error) {
      logger.error('Error saving room listing:', error);
      throw parseError(error);
    }
  },

  async getAllRoomListings(page: number = 0, limit: number = 10): Promise<RoomListing[]> {
    try {
      return await DatabaseService.getAllListings(page, limit);
    } catch (error) {
      logger.error('Error getting room listings:', error);
      throw parseError(error);
    }
  },

  async getRoomListing(id: string): Promise<RoomListing | null> {
    try {
      return await DatabaseService.getListingById(id);
    } catch (error) {
      logger.error('Error getting room listing:', error);
      return null;
    }
  },

  async getUserListings(userId: string): Promise<RoomListing[]> {
    try {
      return await DatabaseService.getUserListings(userId);
    } catch (error) {
      logger.error('Error getting user listings:', error);
      throw parseError(error);
    }
  },

  async updateRoomListing(updatedListing: RoomListing): Promise<void> {
    try {
      await DatabaseService.updateListing(updatedListing.id, updatedListing);
    } catch (error) {
      logger.error('Error updating room listing:', error);
      throw parseError(error);
    }
  },

  async deleteRoomListing(listingId: string): Promise<void> {
    try {
      logger.log(`Attempting to delete listing: ${listingId}`);
      await DatabaseService.deleteListing(listingId);
      logger.log(`Successfully deleted listing: ${listingId}`);
    } catch (error) {
      logger.error('Error deleting room listing:', error);
      throw parseError(error);
    }
  },

  // Saved listings (favorites)
  async saveFavoriteListing(listingId: string): Promise<void> {
    try {
      const user = await AuthService.getCurrentUserProfile();
      if (!user) throw new Error('Must be logged in to save listings');
      await DatabaseService.saveListing(user.id, listingId);
    } catch (error) {
      logger.error('Error saving favorite listing:', error);
      throw parseError(error);
    }
  },

  async removeFavoriteListing(listingId: string): Promise<void> {
    try {
      const user = await AuthService.getCurrentUserProfile();
      if (!user) throw new Error('Must be logged in');
      await DatabaseService.unsaveListing(user.id, listingId);
    } catch (error) {
      logger.error('Error removing favorite listing:', error);
      throw parseError(error);
    }
  },

  async isListingSaved(listingId: string): Promise<boolean> {
    try {
      const user = await AuthService.getCurrentUserProfile();
      if (!user) return false;
      return await DatabaseService.isListingSaved(user.id, listingId);
    } catch (error) {
      logger.error('Error checking if listing is saved:', error);
      return false;
    }
  },

  async getSavedListingIds(): Promise<string[]> {
    try {
      const listings = await this.getSavedListings();
      return listings.map(l => l.id);
    } catch (error) {
      logger.error('Error getting saved listing IDs:', error);
      return [];
    }
  },

  async getSavedListings(): Promise<RoomListing[]> {
    try {
      const user = await AuthService.getCurrentUserProfile();
      if (!user) return [];
      return await DatabaseService.getSavedListings(user.id);
    } catch (error) {
      logger.error('Error getting saved listings:', error);
      return [];
    }
  },

  async reportListing(listingId: string, reason: string, details?: string): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User must be logged in to report a listing');

      await DatabaseService.reportListing({
        listingId,
        reporterId: user.id,
        reason,
        details
      });
    } catch (error) {
      logger.error('Error reporting listing:', error);
      throw parseError(error);
    }
  },

  // User management
  async saveUser(user: User): Promise<void> {
    try {
      await AuthService.updateProfile(user);
    } catch (error) {
      logger.error('Error saving user:', error);
      throw parseError(error);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      return await AuthService.getCurrentUserProfile();
    } catch (error) {
      logger.error('Error getting current user:', error);
      return null;
    }
  },

  async requestAccountDeletion(): Promise<void> {
    try {
      const user = await AuthService.getCurrentUserProfile();
      if (!user) throw new Error('User must be logged in to request account deletion');

      await DatabaseService.createAccountDeletionRequest(user.id, user.email);
    } catch (error) {
      logger.error('Error requesting account deletion:', error);
      throw parseError(error);
    }
  },

  async clearAllData(): Promise<void> {
    logger.warn('clearAllData not implemented for Supabase - requires admin privileges');
  },
};