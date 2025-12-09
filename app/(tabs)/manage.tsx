import { useAuth } from '@/components/auth/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { Spacing } from '@/constants/theme';
import { SupabaseStorageService } from '@/lib/storage-service';
import { RoomListing } from '@/types/room';
import { StorageService } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';

import { LoginRequiredView } from '@/components/ui/login-required-view';
import { logger } from '@/utils/logger';

export default function ManageListingsScreen() {
    const [listings, setListings] = useState<RoomListing[]>([]);
    const [loading, setLoading] = useState(false);
    const [listingToDelete, setListingToDelete] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    const { user } = useAuth();

    // Load listings when screen comes into focus
    const loadMyListings = useCallback(async () => {
        if (!user) return;

        // Ensure we start at the top when the screen gains focus
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        try {
            setLoading(true);
            const userListings = await StorageService.getUserListings(user.id);
            logger.log('Loaded listings:', JSON.stringify(userListings, null, 2));
            const sorted = userListings.sort((a: RoomListing, b: RoomListing) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setListings(sorted);
            // Scroll to top after data is set (in case layout changed)
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 0);
        } catch (error: any) {
            logger.error('Failed to load user listings:', error);
            Alert.alert('Error', error.message || 'Failed to load your listings');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadMyListings();
        }, [loadMyListings])
    );

    const handleEdit = (listingId: string) => {
        router.push(`/edit-listing?id=${listingId}`);
    };

    const handleDelete = async (listingId: string) => {
        try {
            const listing = listings.find(l => l.id === listingId);
            if (listing && listing.images) {
                await Promise.all(listing.images.map(img => SupabaseStorageService.deleteImage(img)));
            }
            await StorageService.deleteRoomListing(listingId);
            setListings(prev => prev.filter(listing => listing.id !== listingId));
            setListingToDelete(null);
        } catch (error: any) {
            logger.error('Delete failed', error);
            Alert.alert('Error', error.message || 'Failed to delete listing');
        }
    };

    const renderListingItem = ({ item }: { item: RoomListing }) => (
        <ThemedView style={[styles.listingCard, {
            backgroundColor: '#fff',
            shadowColor: '#000',
        }]}>
            <Pressable onPress={() => router.push(`/room-detail?id=${item.id}`)}>
                <ImageCarousel
                    images={item.images}
                    height={150}
                    style={styles.listingImage}
                    contentFit="cover"
                    onPress={() => router.push(`/room-detail?id=${item.id}`)}
                />

                <ThemedView style={styles.listingInfo}>
                    <ThemedView style={styles.listingHeader}>
                        <ThemedText type="h5" style={styles.listingTitle}>
                            {item.title}
                        </ThemedText>
                        <ThemedView style={styles.listingActions}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    handleEdit(item.id);
                                }}
                            >
                                <IconSymbol name="pencil" size={18} color="#000000" />
                            </TouchableOpacity>
                            {listingToDelete === item.id ? (
                                <ThemedView style={styles.confirmDeleteContainer}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.confirmButton]}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id);
                                        }}
                                    >
                                        <ThemedText style={styles.confirmButtonText}>Confirm</ThemedText>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.cancelButton]}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            setListingToDelete(null);
                                        }}
                                    >
                                        <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
                                    </TouchableOpacity>
                                </ThemedView>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setListingToDelete(item.id);
                                    }}
                                >
                                    <IconSymbol name="trash" size={18} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </ThemedView>
                    </ThemedView>

                    <ThemedText style={styles.listingAddress}>
                        {item.address.street}
                    </ThemedText>

                    {item.description && (
                        <ThemedText style={styles.listingDescription} numberOfLines={2}>
                            {item.description}
                        </ThemedText>
                    )}

                    <ThemedText style={styles.listingPrice}>
                        ₹{item.price}/month
                    </ThemedText>

                    <ThemedView style={styles.listingType}>
                        <IconSymbol
                            name={item.roomType === 'private' ? 'person.fill' : 'person.2.fill'}
                            size={14}
                            color="#666"
                        />
                        <ThemedText style={styles.listingTypeText}>
                            {item.roomType === 'private' ? 'Private Room' : 'Shared Room'}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.contactInfo}>
                        <IconSymbol
                            name="phone.fill"
                            size={14}
                            color="#666"
                        />
                        <ThemedText style={styles.contactText}>
                            {item.ownerContact}
                        </ThemedText>
                    </ThemedView>

                    <ThemedText style={styles.listingDate}>
                        Listed on {new Date(item.createdAt).toLocaleDateString()}
                    </ThemedText>
                </ThemedView>
            </Pressable>
        </ThemedView>
    );

    if (!user) {
        return <LoginRequiredView message="Please log in to manage your listings" />;
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <ThemedText type="h2">Manage Listings</ThemedText>
                <ThemedText style={styles.subtitle}>
                    Edit or remove your properties
                </ThemedText>
            </ThemedView>

            <FlatList
                ref={flatListRef}
                data={listings}
                renderItem={renderListingItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listingsList}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadMyListings} />
                }
                ListEmptyComponent={
                    <ThemedView style={styles.emptyState}>
                        <IconSymbol name="house" size={80} color="#ccc" />
                        <ThemedText style={styles.emptyText}>
                            No listings yet
                        </ThemedText>
                        <ThemedText style={styles.emptySubtext}>
                            Create your first listing by tapping &quot;List Room&quot;
                        </ThemedText>
                    </ThemedView>
                }
                showsVerticalScrollIndicator={false}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    subtitle: {
        opacity: 0.7,
        marginTop: 8,
    },
    listingsList: {
        padding: 20,
        paddingTop: 0,
    },
    listingCard: {
        borderRadius: 15,
        marginBottom: 20,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    listingImage: {
        width: '100%',
        height: 150,
        backgroundColor: '#E5E7EB',
    },

    listingInfo: {
        padding: 15,
    },
    listingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    listingTitle: {
        fontSize: 16,
        flex: 1,
        marginRight: 10,
    },
    listingActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    deleteButton: {
        backgroundColor: '#ff4444',
    },
    listingAddress: {
        fontSize: 14,
        opacity: 0.7,
        marginBottom: 8,
    },
    listingDescription: {
        fontSize: 13,
        opacity: 0.7,
        marginBottom: 8,
        lineHeight: 18,
    },
    listingPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007AFF',
        marginBottom: 8,
    },
    listingType: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
    },
    listingTypeText: {
        fontSize: 14,
        opacity: 0.8,
    },
    contactInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginBottom: 8,
    },
    contactText: {
        fontSize: 14,
        opacity: 0.8,
    },
    listingDate: {
        fontSize: 12,
        opacity: 0.6,
        fontStyle: 'italic',
    },
    // House rules styles
    houseRulesContainer: {
        marginTop: Spacing.sm,
        padding: Spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 8,
    },
    houseRulesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 4,
    },
    houseRulesTitle: {
        fontWeight: '600',
        fontSize: 12,
    },
    ruleText: {
        fontSize: 12,
        lineHeight: 16,
        opacity: 0.8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    emptySubtext: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.6,
    },
    confirmDeleteContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    confirmButton: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cancelButton: {
        backgroundColor: '#ddd',
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    cancelButtonText: {
        color: '#333',
        fontSize: 12,
        fontWeight: '600',
    },
});
