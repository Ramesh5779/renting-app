import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCallback() {
    useEffect(() => {
        handleCallback();
    }, []);

    const handleCallback = async () => {
        try {
            console.log('🔐 Processing OAuth callback...');

            // Get the URL that triggered this route
            // In Expo, we need to check for the session after OAuth redirect
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('❌ Error getting session:', error);
                router.replace('/(auth)/login');
                return;
            }

            if (session) {
                console.log('✅ OAuth session established!');
                router.replace('/(tabs)');
            } else {
                console.log('⚠️ No session found');
                router.replace('/(auth)/login');
            }
        } catch (error) {
            console.error('❌ Callback error:', error);
            router.replace('/(auth)/login');
        }
    };

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.text}>Completing sign in...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
});
