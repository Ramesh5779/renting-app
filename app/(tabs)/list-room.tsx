import { ListingForm, ListingFormData } from '@/components/ListingForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Spacing } from '@/constants/theme';
import { DatabaseService } from '@/lib/database';
import { SupabaseStorageService } from '@/lib/storage-service';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { useAuth } from '@/components/auth/AuthContext';

import { LoginRequiredView } from '@/components/ui/login-required-view';
import { logger } from '@/utils/logger';

export default function ListRoomScreen() {
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const { user } = useAuth();

  const handleCreateListing = async (data: ListingFormData) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a listing');
      return;
    }


    try {
      setLoading(true);
      logger.log('Creating listing...');

      // Upload images to Supabase Storage
      const savedImageUris = await Promise.all(
        data.images.map(async (uri, index) => {
          try {
            // Upload to Supabase and get public URL
            const publicUrl = await SupabaseStorageService.uploadImage(uri, user.id);
            return publicUrl;
          } catch (error) {
            logger.error(`Failed to upload image ${index + 1}:`, error);
            throw new Error(`Failed to upload image ${index + 1}`);
          }
        })
      );

      // ✅ FIXED: Use DatabaseService to create listing with proper UUID
      await DatabaseService.createListing({
        title: `${data.bhkType} - ${data.title}`,
        price: Number(data.price),
        address: {
          street: data.street,
        },
        images: savedImageUris,
        amenities: data.amenities,
        houseRules: data.houseRules,
        roomType: data.roomType,
        ownerId: user.id,
        ownerName: data.ownerName,
        ownerContact: data.ownerContact,
      });

      setFormKey(prev => prev + 1); // Reset form
      setShowSuccessModal(true);
    } catch (error: any) {
      logger.error('Error creating listing:', error);
      Alert.alert('Error', error.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <LoginRequiredView message="Please log in to list your room" />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="hero" style={styles.heroTitle}>List Your Room</ThemedText>
        <ThemedText style={styles.subtitle}>
          Share your space with people looking for a room
        </ThemedText>
      </ThemedView>

      <ListingForm
        key={formKey}
        initialValues={{
          ownerName: user.name || '',
          ownerContact: user.phone || '',
        }}
        onSubmit={handleCreateListing}
        submitLabel="List My Room"
        loading={loading}
      />

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <IconSymbol name="checkmark.circle.fill" size={64} color={Colors.success} />
            </View>

            <ThemedText type="h2" style={styles.modalTitle}>Congrats!</ThemedText>
            <ThemedText style={styles.modalMessage}>
              Your room listed successfully
            </ThemedText>

            <View style={styles.modalButtons}>
              <Button
                title="View Listing"
                onPress={() => {
                  setShowSuccessModal(false);
                  router.push('/manage');
                }}
                fullWidth
              />
              <Button
                title="Add Another"
                variant="secondary"
                onPress={() => {
                  setShowSuccessModal(false);
                  // Form is already reset by handleCreateListing, but good to be safe or if we move logic
                }}
                fullWidth
              />
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: Spacing.xl,
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.md,
  },
  heroTitle: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    marginBottom: 10,
    textAlign: 'center',
  },
  modalMessage: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 30,
  },
  modalButtons: {
    width: '100%',
    gap: 15,
  },
});