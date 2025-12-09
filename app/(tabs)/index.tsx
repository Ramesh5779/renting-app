import { useAuth } from '@/components/auth/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { SearchBar } from '@/components/ui/search-bar';
import { BorderRadius, Gradients, Shadows, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { RoomListing } from '@/types/room';
import { sanitizePhoneNumber } from '@/utils/phoneUtils';
import { StorageService } from '@/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

// Dimensions available if needed for responsive design

export default function BrowseRoomsScreen() {
  const [rooms, setRooms] = useState<RoomListing[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 10;

  const primaryColor = useThemeColor({}, 'primary');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const iconColor = useThemeColor({}, 'icon');
  const { user } = useAuth();

  const refreshRooms = useCallback(async () => {
    try {
      setLoading(true);
      setPage(0);
      setHasMore(true);

      const listings = await StorageService.getAllRoomListings(0, ITEMS_PER_PAGE);
      setRooms(listings);
      setHasMore(listings.length === ITEMS_PER_PAGE);
      setPage(1);
    } catch (error: any) {
      console.error('Failed to load listings:', error);
      const message = error.message || 'Failed to load room listings';
      if (message.includes('timed out') || message.includes('connection') || message.includes('Network request failed')) {
        Alert.alert('Connection Issue', 'The server might be waking up. Please pull down to refresh in a moment.');
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSavedListings = useCallback(async () => {
    try {
      const savedIds = await StorageService.getSavedListingIds();
      setSavedListingIds(savedIds);
    } catch (error) {
      console.error('Error loading saved listings:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      refreshRooms();
      loadSavedListings();
      setSearchQuery(''); // Clear search when returning to home
    }, [refreshRooms, loadSavedListings])
  );

  const filterRooms = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredRooms(rooms);
      return;
    }

    const filtered = rooms.filter(room =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.address.street.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRooms(filtered);
  }, [rooms, searchQuery]);

  useEffect(() => {
    filterRooms();
  }, [filterRooms]);

  const loadMoreRooms = useCallback(async () => {
    if (loadingMore || !hasMore || loading || searchQuery) return;

    try {
      setLoadingMore(true);
      const listings = await StorageService.getAllRoomListings(page, ITEMS_PER_PAGE);

      setRooms(prev => [...prev, ...listings]);
      setHasMore(listings.length === ITEMS_PER_PAGE);
      setPage(prev => prev + 1);
    } catch (error: any) {
      console.error('Failed to load more listings:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, searchQuery, page]);

  const handleLoadMore = () => {
    loadMoreRooms();
  };

  const onRefresh = () => {
    refreshRooms();
  };

  const handleToggleSave = async (listingId: string) => {
    try {
      const isSaved = savedListingIds.includes(listingId);
      if (isSaved) {
        await StorageService.removeFavoriteListing(listingId);
        setSavedListingIds(prev => prev.filter(id => id !== listingId));
      } else {
        await StorageService.saveFavoriteListing(listingId);
        setSavedListingIds(prev => [...prev, listingId]);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      Alert.alert('Error', 'Failed to update saved listings');
    }
  };

  const handleCall = (listing: RoomListing) => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in to contact the owner',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }
    if (listing.ownerContact) {
      const sanitized = sanitizePhoneNumber(listing.ownerContact);
      Linking.openURL(`tel:${sanitized}`).catch(err => {
        console.error('Error making call:', err);
        Alert.alert('Error', 'Could not make phone call');
      });
    }
  };

  const handleWhatsApp = (listing: RoomListing) => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in to contact the owner',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }
    if (listing.ownerContact) {
      const sanitized = sanitizePhoneNumber(listing.ownerContact);
      const message = `Hi, I'm interested in your property: ${listing.title}`;
      const url = `whatsapp://send?phone=${sanitized}&text=${encodeURIComponent(message)}`;

      Linking.canOpenURL(url).then(supported => {
        if (!supported) {
          Alert.alert(
            'WhatsApp Not Found',
            'Please install WhatsApp to use this feature',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Install', onPress: () => Linking.openURL('https://wa.me/') }
            ]
          );
        } else {
          return Linking.openURL(url);
        }
      }).catch(err => {
        console.error('Error opening WhatsApp:', err);
        Alert.alert('Error', 'Could not open WhatsApp');
      });
    }
  };

  // Contact owner functionality is handled in room-detail screen

  const handleViewOnMap = (address: string) => {
    if (!user) {
      Alert.alert(
        'Login Required',
        'Please log in to view location on map',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => router.push('/(auth)/login') }
        ]
      );
      return;
    }
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps.apple.com/?q=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`
    });

    Linking.openURL(url).catch(err => {
      console.error('Error opening map:', err);
      Alert.alert('Error', 'Could not open map application');
    });
  };

  const renderRoomItem = ({ item }: { item: RoomListing }) => (
    <Card
      variant="elevated"
      padding="none"
      style={styles.roomCard}
    >
      <View style={styles.imageContainer}>
        <ImageCarousel
          images={item.images}
          height={240}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          onPress={() => router.push(`/room-detail?id=${item.id}`)}
        />

        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.imageOverlay}
          pointerEvents="none"
        />

        {/* Heart/Favorite Icon */}
        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => handleToggleSave(item.id)}
        >
          <IconSymbol
            name={savedListingIds.includes(item.id) ? 'heart.fill' : 'heart'}
            size={24}
            color={savedListingIds.includes(item.id) ? '#FF0000' : 'white'}
            style={styles.heartIcon}
          />
        </TouchableOpacity>

        <View style={styles.priceTag}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.priceGradient}
          >
            <ThemedText type="price" style={styles.priceText}>
              ₹{item.price}
            </ThemedText>
            <ThemedText type="caption" style={styles.pricePeriod}>
              /mo
            </ThemedText>
          </LinearGradient>
        </View>
      </View>

      <ThemedText style={styles.imageHelperText}>
        Tap the image to see full view
      </ThemedText>

      <Pressable onPress={() => router.push(`/room-detail?id=${item.id}`)}>
        <View style={styles.roomInfo}>
          <View style={styles.roomHeader}>
            <ThemedText type="h5" style={styles.roomTitle} numberOfLines={1}>
              {item.title}
            </ThemedText>

            {/* Rating removed until implemented */}
            {/* <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={14} color="#FFD700" />
              <ThemedText type="caption" variant="secondary">
                4.8
              </ThemedText>
            </View> */}
          </View>

          <View style={styles.locationRow}>
            <IconSymbol name="location.fill" size={14} color={textSecondary} />
            <ThemedText type="bodyMedium" variant="secondary" style={styles.roomAddress} numberOfLines={1}>
              {item.address.street}
            </ThemedText>
          </View>

          {item.description && (
            <ThemedText type="bodySmall" variant="secondary" style={styles.roomDescription} numberOfLines={2}>
              {item.description}
            </ThemedText>
          )}

          <View style={styles.ownerRow}>
            <IconSymbol name="person.fill" size={14} color={textSecondary} />
            <ThemedText type="caption" variant="secondary" style={styles.ownerText}>
              Posted by: {item.ownerName}
            </ThemedText>
          </View>



          <View style={styles.featuresRow}>
            <View style={styles.featureBadge}>
              <ThemedText type="caption" variant="secondary">
                {item.roomType === 'private' ? 'Private Room' : 'Shared Room'}
              </ThemedText>
            </View>
            {item.amenities.slice(0, 2).map((amenity, index) => (
              <View key={index} style={styles.featureBadge}>
                <ThemedText type="caption" variant="secondary">
                  {amenity}
                </ThemedText>
              </View>
            ))}
          </View>

          {item.houseRules && (
            <View style={styles.houseRulesContainer}>
              <View style={styles.houseRulesHeader}>
                <IconSymbol name="list.bullet.rectangle.fill" size={12} color={textSecondary} />
                <ThemedText type="caption" variant="secondary" style={styles.houseRulesTitle}>
                  House Rules
                </ThemedText>
              </View>
              <ThemedText type="caption" variant="secondary" numberOfLines={2} style={styles.ruleText}>
                {item.houseRules}
              </ThemedText>
            </View>
          )}

          <TouchableOpacity
            style={styles.mapButton}
            onPress={(e) => {
              e.stopPropagation();
              handleViewOnMap(item.address.street);
            }}
          >
            <IconSymbol name="map" size={16} color={primaryColor} />
            <ThemedText type="caption" style={{ color: primaryColor, fontWeight: '600' }}>
              View on Map
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={(e) => {
                e.stopPropagation();
                handleCall(item);
              }}
            >
              <IconSymbol name="phone.fill" size={16} color="#000" />
              <ThemedText style={styles.callButtonText}>Call</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.whatsappButton}
              onPress={(e) => {
                e.stopPropagation();
                handleWhatsApp(item);
              }}
            >
              <IconSymbol name="message.fill" size={16} color="#fff" />
              <ThemedText style={styles.whatsappButtonText}>WhatsApp</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Card >
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <ThemedText type="hero" style={styles.heroTitle}>
          Find Your{'\n'}Perfect Space
        </ThemedText>

        <SearchBar
          placeholder="Search city, area, or room type..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          resultsCount={searchQuery ? filteredRooms.length : undefined}
          onFilterPress={() => {
            Alert.alert('Filters', 'Filter functionality coming soon!');
          }}
        />
      </View>

      <FlatList
        data={filteredRooms}
        renderItem={renderRoomItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.roomsList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={primaryColor}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <IconSymbol name="house" size={64} color={iconColor} />
            </View>
            <ThemedText type="h3" style={styles.emptyText}>
              {searchQuery ? 'No rooms found' : 'Discover amazing rooms'}
            </ThemedText>
            <ThemedText type="bodyLarge" variant="secondary" style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search terms' : 'Explore premium listings in top cities'}
            </ThemedText>
          </View>
        }
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.xl }} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ThemedText style={{ textAlign: 'center' }}>Loading more...</ThemedText>
            </View>
          ) : null
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.xxl,
  },
  heroTitle: {
    marginBottom: Spacing.xl,
    textAlign: 'left',
  },
  roomsList: {
    padding: Spacing.xl,
    paddingTop: 0,
    paddingBottom: Spacing.massive,
  },
  roomCard: {
    overflow: 'hidden',
    borderWidth: 0,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 240,
    borderRadius: 0, // Reset border radius since Card handles it
    backgroundColor: '#E5E7EB',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },

  favoriteButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    zIndex: 10,
    elevation: 5,
  },
  heartIcon: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  priceTag: {
    position: 'absolute',
    bottom: Spacing.md,
    left: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  priceGradient: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  priceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  pricePeriod: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
  },
  roomInfo: {
    padding: Spacing.lg,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  roomTitle: {
    flex: 1,
    marginRight: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
  },
  ownerText: {
    flex: 1,
  },
  contactText: {
    flex: 1,
  },
  roomAddress: {
    flex: 1,
  },
  roomDescription: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
    lineHeight: 18,
    opacity: 0.8,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  featureBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
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
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.md,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.massive,
    paddingHorizontal: Spacing.xxl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptySubtext: {
    textAlign: 'center',
    marginBottom: Spacing.xxxl,
    maxWidth: 280,
  },
  sampleDataButton: {
    marginTop: Spacing.lg,
  },
  imageHelperText: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.6,
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
    marginTop: Spacing.lg,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#000000',
  },
  callButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  whatsappButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
