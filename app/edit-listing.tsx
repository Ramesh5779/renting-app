import { ListingForm, ListingFormData } from '@/components/ListingForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/theme';
import { SupabaseStorageService } from '@/lib/storage-service';
import { RoomListing } from '@/types/room';
import { StorageService } from '@/utils/storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditListingScreen() {
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [listing, setListing] = useState<RoomListing | null>(null);

    const loadListing = useCallback(async () => {
        try {
            if (!params.id) return;
            const allListings = await StorageService.getAllRoomListings();
            const found = allListings.find(l => l.id === params.id);
            if (found) {
                setListing(found);
            } else {
                Alert.alert('Error', 'Listing not found');
                router.back();
            }
        } catch (error: any) {
            console.error('Error loading listing:', error);
            Alert.alert('Error', error.message || 'Failed to load listing');
        } finally {
            setInitialLoading(false);
        }
    }, [params.id]);

    useEffect(() => {
        loadListing();
    }, [loadListing]);

    const handleUpdateListing = async (data: ListingFormData) => {
        if (!listing) return;

        try {
            setLoading(true);

            // Handle images:
            // 1. Identify new images (temporary URIs) vs existing images (permanent paths)
            // 2. Save new images
            // 3. Keep existing images
            // Note: ListingForm returns all images in the desired order.

            const updatedImageUris = await Promise.all(
                data.images.map(async (uri) => {
                    // If it's already a Supabase URL (existing image), keep it
                    if (listing.images.includes(uri)) {
                        return uri;
                    }

                    // Otherwise, it's a new image, upload to Supabase
                    try {
                        return await SupabaseStorageService.uploadImage(uri, '00000000-0000-0000-0000-000000000000');
                    } catch (error) {
                        console.error('Failed to upload new image:', error);
                        throw error;
                    }
                })
            );

            const updatedListing: RoomListing = {
                ...listing,
                title: `${data.bhkType} - ${data.title}`,

                price: Number(data.price),
                address: {
                    street: data.street,
                },
                images: updatedImageUris,
                amenities: data.amenities,
                houseRules: data.houseRules,
                roomType: data.roomType,
                ownerName: data.ownerName,
                ownerContact: data.ownerContact,
                updatedAt: new Date().toISOString(),
            };

            await StorageService.updateRoomListing(updatedListing);

            if (Platform.OS === 'web') {
                alert('Listing updated successfully');
                router.back();
            } else {
                Alert.alert('Success', 'Listing updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        } catch (error: any) {
            console.error('Error updating listing:', error);
            if (Platform.OS === 'web') {
                alert(error.message || 'Failed to update listing');
            } else {
                Alert.alert('Error', error.message || 'Failed to update listing');
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        );
    }

    if (!listing) return null;

    // Parse title to extract BHK type and actual title
    // Format: "1BHK - Apartment Name"
    const titleParts = listing.title.split(' - ');
    const bhkType = titleParts.length > 1 ? titleParts[0] : '';
    const realTitle = titleParts.length > 1 ? titleParts.slice(1).join(' - ') : listing.title;

    const initialValues: Partial<ListingFormData> = {
        title: realTitle,
        bhkType: bhkType,
        price: listing.price.toString(),
        street: listing.address.street,
        ownerName: listing.ownerName,
        ownerContact: listing.ownerContact,
        roomType: listing.roomType,
        images: listing.images,
        amenities: listing.amenities,
        houseRules: listing.houseRules || '',
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText type="h3">Edit Listing</ThemedText>
                <View style={{ width: 24 }} />
            </View>

            <ListingForm
                initialValues={initialValues}
                onSubmit={handleUpdateListing}
                submitLabel="Update Listing"
                loading={loading}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingTop: 50, // Reduced from 60
        paddingBottom: Spacing.xs, // Reduced vertical padding
    },
    backButton: {
        padding: 4,
    },
});
