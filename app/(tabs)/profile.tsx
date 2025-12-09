import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Gradients, Spacing } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, View } from 'react-native';

import { useAuth } from '@/components/auth/AuthContext';
import { StorageService } from '@/utils/storage';

export default function ProfileScreen() {
  const iconColor = useThemeColor({}, 'icon');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        },
      ]
    );
  };

  const supportItems = [
    { icon: 'questionmark.circle.fill', label: 'Help Centre', route: 'help' },
    { icon: 'doc.text.fill', label: 'Terms of Services', route: 'terms' },
    { icon: 'lock.fill', label: 'Privacy Policy', route: 'privacy' },
  ];

  const renderMenuItem = (item: { icon: string; label: string; route: string }, index: number) => (
    <Card
      key={index}
      variant="outlined"
      padding="medium"
      pressable
      onPress={() => {
        if (item.route === 'terms') {
          router.push('/terms-of-service');
        } else if (item.route === 'help') {
          router.push('/help-centre');
        } else if (item.route === 'privacy') {
          router.push('/privacy-policy');
        } else {
          Alert.alert('Info', `${item.label} functionality coming soon`);
        }
      }}
      style={styles.menuItem}
    >
      <View style={styles.menuItemContent}>
        <View style={styles.menuIconContainer}>
          <IconSymbol name={item.icon as any} size={24} color={iconColor} />
        </View>
        <ThemedText type="bodyMedium" style={styles.menuLabel}>{item.label}</ThemedText>
        <IconSymbol name="chevron.right" size={16} color={textSecondary} />
      </View>
    </Card>
  );

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header with Gradient */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={Gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {user?.profileImage ? (
                  <Image
                    source={{ uri: user.profileImage }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                ) : user ? (
                  <View style={[styles.avatar, styles.avatarInitial]}>
                    <ThemedText type="h1" style={styles.avatarText}>
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </ThemedText>
                  </View>
                ) : (
                  <View style={[styles.avatar, styles.avatarGuest]}>
                    <IconSymbol name="person.fill" size={48} color="#fff" />
                  </View>
                )}
              </View>
              <View style={styles.profileInfo}>
                <ThemedText type="h2" style={styles.userName}>
                  {user?.name || 'Guest User'}
                </ThemedText>
                <ThemedText type="bodyMedium" style={styles.userEmail}>
                  {user?.email || 'Please log in to personalize your experience'}
                </ThemedText>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.contentContainer}>
          {/* Auth Section */}
          <View style={styles.section}>
            {user ? (
              <Button
                title="Log Out"
                variant="outline"
                onPress={handleLogout}
                style={styles.logoutButton}
              />
            ) : (
              <Button
                title="Log In / Sign Up"
                variant="primary"
                onPress={() => router.push('/(auth)/login')}
                style={styles.logoutButton}
              />
            )}
          </View>

          {user && (
            <View style={styles.section}>
              <Button
                title="Delete Account"
                variant="destructive"
                onPress={async () => {
                  Alert.alert(
                    'Delete Account',
                    'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: async () => {
                          try {
                            // Create deletion request in database
                            await StorageService.requestAccountDeletion();

                            Alert.alert(
                              'Account Deletion Requested',
                              'Your account deletion request has been submitted. All your data will be permanently removed within 30 days. You will receive a confirmation email once the deletion is complete.',
                              [{
                                text: 'OK',
                                onPress: () => signOut()
                              }]
                            );
                          } catch (error) {
                            console.error('Failed to request account deletion:', error);
                            Alert.alert(
                              'Error',
                              'Failed to submit deletion request. Please try again or contact support at renthive357@gmail.com'
                            );
                          }
                        }
                      }
                    ]
                  );
                }}
                style={styles.logoutButton}
              />
            </View>
          )}

          {/* Support Section */}
          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>Support</ThemedText>
            <View style={styles.menuList}>
              {supportItems.map(renderMenuItem)}
            </View>
          </View>

          <ThemedText type="caption" variant="tertiary" style={styles.versionText}>
            Version 1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerGradient: {
    paddingTop: Spacing.massive,
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitial: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000000',
  },
  avatarGuest: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  placeholderAvatar: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    color: 'rgba(255,255,255,0.8)',
  },
  contentContainer: {
    padding: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  menuList: {
    gap: Spacing.md,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
  },
  authButtons: {
    gap: Spacing.md,
  },
  authButton: {
    width: '100%',
  },
  logoutButton: {
    width: '100%',
  },
  versionText: {
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
