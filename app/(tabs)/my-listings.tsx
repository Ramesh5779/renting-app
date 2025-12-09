import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { RoomListing } from '@/types/room';
import { StorageService } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { useAuth } from '@/components/auth/AuthContext';
import { LoginRequiredView } from '@/components/ui/login-required-view';

export default function SavedListingsScreen() {
  const [listings, setListings] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadSavedListings = async () => {
    try {
      setLoading(true);
      const savedListings = await StorageService.getSavedListings();
      setListings(savedListings);
    } catch (error: any) {
      console.error('Failed to load saved listings:', error);
      Alert.alert('Error', 'Failed to load saved listings');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedListings();
    }, [])
  );

  if (!user) {
    return <LoginRequiredView message="Please log in to view your saved listings" />;
  }

  const handleUnsave = async (listingId: string) => {
    try {
      await StorageService.removeFavoriteListing(listingId);
      setListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      console.error('Unsave failed', error);
      Alert.alert('Error', 'Failed to remove from saved listings');
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
          onPress={() => router.push(`/room-detail?id=${item.id}`)}
        />

        <ThemedView style={styles.listingInfo}>
          <ThemedView style={styles.listingHeader}>
            <ThemedText type="h5" style={styles.listingTitle}>
              {item.title}
            </ThemedText>
            <TouchableOpacity
              style={styles.unsaveButton}
              onPress={(e) => {
                e.stopPropagation();
                handleUnsave(item.id);
              }}
            >
              <IconSymbol name="heart.fill" size={20} color="#FF0000" />
            </TouchableOpacity>
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

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="h2">Saved Listings</ThemedText>
        <ThemedText style={styles.subtitle}>
          Your bookmarked properties
        </ThemedText>
      </ThemedView>

      <FlatList
        data={listings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listingsList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadSavedListings} />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="heart" size={80} color="#ccc" />
            <ThemedText style={styles.emptyText}>
              No saved listings
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Save listings you like by tapping the heart icon
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
  unsaveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
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