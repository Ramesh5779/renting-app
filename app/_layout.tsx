import { AuthProvider, useAuth } from '@/components/auth/AuthContext';
import { OfflineBanner } from '@/components/ui/offline-banner';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { logDeviceDiagnostics } from '@/utils/deviceInfo';
import { ErrorBoundary } from '@/utils/ErrorBoundary';
import { startLagDetector, stopLagDetector } from '@/utils/lagDetector';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import * as Sentry from '@sentry/react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

// Initialize Sentry for production error tracking
// Only initialize if DSN is provided (production environment)
if (process.env.EXPO_PUBLIC_SENTRY_DSN && !__DEV__) {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,

    tracesSampleRate: 1.0, // Capture 100% of transactions for performance monitoring
    _experiments: {
      profilesSampleRate: 1.0, // Profile 100% of sampled transactions
    },
  });
}

export const unstable_settings = {
  anchor: '(tabs)',
};

import { ConnectionStatus } from '@/components/ConnectionStatus';

function RootLayoutNav() {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { isOnline } = useNetworkStatus();

  // Initialize debug tools in development
  useEffect(() => {
    if (__DEV__) {
      // Start performance monitoring
      startLagDetector(100);

      // Log device diagnostics on startup
      logDeviceDiagnostics().catch(console.error);

      return () => {
        stopLagDetector();
      };
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (session && inAuthGroup) {
      // Redirect to the tabs page if authenticated
      router.replace('/(tabs)');
    }
  }, [session, segments, isLoading, router]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <ConnectionStatus />
      <OfflineBanner visible={!isOnline} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="debug-console" options={{ title: 'Debug Console' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}

