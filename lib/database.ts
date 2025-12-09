import { RoomListing } from '@/types/room';
import { parseError } from '@/utils/errorHandler';
import { supabase } from './supabase';

// Database row type for type-safe updates
type ListingUpdateData = {
    title?: string;
    description?: string;
    price?: number;
    street?: string;
    latitude?: number;
    longitude?: number;
    images?: string[];
    amenities?: string[];
    house_rules?: string;
    room_type?: 'private' | 'shared';
    available_from?: string;
    owner_name?: string;
    owner_contact?: string;
};

// Database row type from Supabase
type DatabaseRow = {
    id: string;
    title: string;
    description: string;
    price: string | number;
    street: string;
    latitude?: string | number;
    longitude?: string | number;
    images: string[];
    amenities: string[];
    house_rules: string;
    room_type: 'private' | 'shared';
    available_from?: string;
    owner_id: string;
    owner_name: string;
    owner_contact: string;
    created_at: string;
    updated_at: string;
};

export const DatabaseService = {
    // Room Listings
    async createListing(listing: Omit<RoomListing, 'id' | 'createdAt' | 'updatedAt'>): Promise<RoomListing> {
        const { data, error } = await supabase
            .from('room_listings')
            .insert({
                title: listing.title,
                description: listing.description,
                price: listing.price,
                street: listing.address.street,
                latitude: listing.address.coordinates?.latitude,
                longitude: listing.address.coordinates?.longitude,
                images: listing.images,
                amenities: listing.amenities,
                house_rules: listing.houseRules,
                room_type: listing.roomType,
                available_from: listing.availableFrom,
                owner_id: listing.ownerId,
                owner_name: listing.ownerName,
                owner_contact: listing.ownerContact,
            })
            .select()
            .single();

        if (error) throw parseError(error);
        return this.mapToRoomListing(data);
    },

    async getListingById(id: string): Promise<RoomListing | null> {
        const { data, error } = await supabase
            .from('room_listings')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw parseError(error);
        }
        return this.mapToRoomListing(data);
    },

    async getAllListings(page: number = 0, limit: number = 10): Promise<RoomListing[]> {
        const from = page * limit;
        const to = from + limit - 1;

        const { data, error } = await supabase
            .from('room_listings')
            .select('*')
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw parseError(error);
        return data.map(this.mapToRoomListing);
    },

    async getUserListings(userId: string): Promise<RoomListing[]> {
        const { data, error } = await supabase
            .from('room_listings')
            .select('*')
            .eq('owner_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw parseError(error);
        return data.map(this.mapToRoomListing);
    },

    async updateListing(id: string, updates: Partial<RoomListing>): Promise<RoomListing> {
        const updateData: ListingUpdateData = {};

        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.description !== undefined) updateData.description = updates.description;
        if (updates.price !== undefined) updateData.price = updates.price;
        if (updates.address?.street !== undefined) updateData.street = updates.address.street;
        if (updates.address?.coordinates?.latitude !== undefined) updateData.latitude = updates.address.coordinates.latitude;
        if (updates.address?.coordinates?.longitude !== undefined) updateData.longitude = updates.address.coordinates.longitude;
        if (updates.images !== undefined) updateData.images = updates.images;
        if (updates.amenities !== undefined) updateData.amenities = updates.amenities;
        if (updates.houseRules !== undefined) updateData.house_rules = updates.houseRules;
        if (updates.roomType !== undefined) updateData.room_type = updates.roomType;
        if (updates.availableFrom !== undefined) updateData.available_from = updates.availableFrom;
        if (updates.ownerName !== undefined) updateData.owner_name = updates.ownerName;
        if (updates.ownerContact !== undefined) updateData.owner_contact = updates.ownerContact;

        const { data, error } = await supabase
            .from('room_listings')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw parseError(error);
        return this.mapToRoomListing(data);
    },

    async deleteListing(id: string): Promise<void> {
        const { error } = await supabase
            .from('room_listings')
            .delete()
            .eq('id', id);

        if (error) throw parseError(error);
    },

    // Saved Listings (Favorites)
    async saveListing(userId: string, listingId: string): Promise<void> {
        const { error } = await supabase
            .from('saved_listings')
            .insert({ user_id: userId, listing_id: listingId });

        if (error && error.code !== '23505') throw parseError(error); // Ignore duplicate key error
    },

    async unsaveListing(userId: string, listingId: string): Promise<void> {
        const { error } = await supabase
            .from('saved_listings')
            .delete()
            .eq('user_id', userId)
            .eq('listing_id', listingId);

        if (error) throw parseError(error);
    },

    async isListingSaved(userId: string, listingId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('saved_listings')
            .select('id')
            .eq('user_id', userId)
            .eq('listing_id', listingId)
            .single();

        if (error && error.code !== 'PGRST116') throw parseError(error); // Ignore not found error
        return !!data;
    },

    async getSavedListings(userId: string): Promise<RoomListing[]> {
        const { data, error } = await supabase
            .from('saved_listings')
            .select(`
        listing_id,
        room_listings (*)
      `)
            .eq('user_id', userId);

        if (error) throw parseError(error);
        // Supabase returns an array of objects with room_listings as nested object
        return data.map((item: { listing_id: string; room_listings: DatabaseRow | DatabaseRow[] }) => {
            // Handle both single object and array responses from Supabase
            const listing = Array.isArray(item.room_listings) ? item.room_listings[0] : item.room_listings;
            return this.mapToRoomListing(listing);
        });
    },

    // Helper function to map database row to RoomListing type
    mapToRoomListing(row: DatabaseRow): RoomListing {
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            price: typeof row.price === 'string' ? parseFloat(row.price) : row.price,
            address: {
                street: row.street,
                coordinates: row.latitude && row.longitude ? {
                    latitude: typeof row.latitude === 'string' ? parseFloat(row.latitude) : row.latitude,
                    longitude: typeof row.longitude === 'string' ? parseFloat(row.longitude) : row.longitude,
                } : undefined,
            },
            images: row.images || [],
            amenities: row.amenities || [],
            houseRules: row.house_rules,
            roomType: row.room_type,
            availableFrom: row.available_from,
            ownerId: row.owner_id,
            ownerName: row.owner_name,
            ownerContact: row.owner_contact,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    },

    // Reporting
    async reportListing(report: { listingId: string; reporterId: string; reason: string; details?: string }): Promise<void> {
        // Rate Limiting: Check reports in the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
            .from('reports')
            .select('*', { count: 'exact', head: true })
            .eq('reporter_id', report.reporterId)
            .gte('created_at', oneHourAgo);

        if (countError) throw parseError(countError);

        if (count !== null && count >= 5) {
            throw new Error('Rate limit exceeded. You can only submit 5 reports per hour.');
        }

        // Check for duplicate reports
        const { data: existing, error: checkError } = await supabase
            .from('reports')
            .select('id')
            .eq('listing_id', report.listingId)
            .eq('reporter_id', report.reporterId)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') {
            throw parseError(checkError);
        }

        if (existing) {
            throw new Error('You have already reported this listing');
        }

        const { error } = await supabase
            .from('reports')
            .insert({
                listing_id: report.listingId,
                reporter_id: report.reporterId,
                reason: report.reason,
                details: report.details,
            });

        if (error) throw parseError(error);
    },

    // Account Deletion
    async createAccountDeletionRequest(userId: string, userEmail: string): Promise<void> {
        const { error } = await supabase
            .from('account_deletion_requests')
            .insert({
                user_id: userId,
                email: userEmail, // Fixed: column is 'email', not 'user_email'
            });

        if (error) throw parseError(error);
    },
};
