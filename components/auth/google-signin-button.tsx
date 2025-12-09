import { Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Required for proper OAuth flow
WebBrowser.maybeCompleteAuthSession();

interface GoogleSignInButtonProps {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}

export function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            console.log('🔐 Starting Google OAuth flow...');

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    skipBrowserRedirect: true,
                },
            });

            if (error) {
                console.error('❌ OAuth initiation error:', error);
                throw error;
            }

            if (!data?.url) {
                throw new Error('No OAuth URL returned from Supabase');
            }

            console.log('🌐 Opening OAuth URL...');

            // Open the OAuth URL in browser
            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                'rentingapp://'
            );

            console.log('📱 Browser result:', result);

            if (result.type === 'success') {
                console.log('✅ OAuth successful, checking session...');

                // Wait a moment for Supabase to process the session
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Check if we have a session
                const { data: { session } } = await supabase.auth.getSession();

                if (session) {
                    console.log('✅ Session established!');
                    onSuccess?.();
                    router.replace('/(tabs)');
                } else {
                    console.log('⚠️ No session found after OAuth');
                    Alert.alert('Sign In Issue', 'Authentication completed but session not found. Please try again.');
                }
            } else if (result.type === 'cancel') {
                console.log('❌ User cancelled Google sign-in');
                Alert.alert('Cancelled', 'Google sign-in was cancelled');
            } else {
                console.log('❌ OAuth failed:', result.type);
                Alert.alert('Sign In Failed', 'Failed to complete Google sign-in. Please try again.');
            }
        } catch (error: any) {
            console.error('❌ Google Sign-In Error:', error);
            Alert.alert(
                'Sign In Failed',
                error.message || 'Failed to sign in with Google. Please check your internet connection and try again.'
            );
            onError?.(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleGoogleSignIn}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#666" />
            ) : (
                <>
                    <View style={styles.iconContainer}>
                        <Ionicons name="logo-google" size={20} color="#DB4437" />
                    </View>
                    <Text style={styles.buttonText}>Continue with Google</Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: Spacing.md,
        minHeight: 50,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    iconContainer: {
        marginRight: Spacing.sm,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
