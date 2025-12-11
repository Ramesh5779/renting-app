import { ThemedText } from '@/components/themed-text';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

export function ConnectionStatus() {
    const [isWakingUp, setIsWakingUp] = useState(false);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [fadeAnim] = useState(new Animated.Value(0));

    // Helper to animate visibility
    const animateVisibility = (visible: boolean) => {
        Animated.timing(fadeAnim, {
            toValue: visible ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const wakeServer = async () => {
        // 1. Set loading state ON, clear errors
        setIsWakingUp(true);
        setConnectionError(null);
        animateVisibility(true);

        try {
            console.log('🟡 ConnectionStatus: Waking server...');

            // 2. Try to get session (auth check)
            const { error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.log('⚠️ Session check warning:', sessionError.message);
                // We don't throw here, just log, as auth might fail for other reasons
            }

            // 3. Light warmup query with specific timeout
            // Use Promise.race for timeout since AbortController support varies in RN/Hermes 
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Warmup timeout')), 8000)
            );

            const warmupPromise = supabase
                .from('room_listings')
                .select('id')
                .limit(1)
                .maybeSingle();

            const result: any = await Promise.race([warmupPromise, timeoutPromise]);

            if (result?.error) {
                console.log('🔴 Warmup error:', result.error);
                throw result.error;
            }

            console.log('🟢 ConnectionStatus: Server awake & connected');

            // Success! Hide everything after a brief delay
            // But we must turn off "isWakingUp" immediately in finally
            setTimeout(() => animateVisibility(false), 500);

        } catch (e: any) {
            console.error('🔴 Fatal wake error:', e);
            setConnectionError('Connection failed: ' + (e.message || 'Unknown error'));
        } finally {
            // 4. ALWAYS turn off loading state
            setIsWakingUp(false);
        }
    };

    // Run once on mount
    useEffect(() => {
        wakeServer();
    }, []);

    // If nothing is showing, return null (after animation completes ideally, but for now strict check)
    if (!isWakingUp && !connectionError) {
        // Keep rendered but invisible if animation is running, or null? 
        // For simplicity, let's just return if opacity is 0? 
        // Better: logic based on states
    }

    // Determine what to show
    const isVisible = isWakingUp || !!connectionError;

    // Update animation based on strict state
    useEffect(() => {
        animateVisibility(isVisible);
    }, [isVisible]);

    if (!isVisible) return null;

    const backgroundColor = isWakingUp ? '#FFA500' : '#F44336'; // Orange vs Red
    const message = isWakingUp ? 'Waking up server...' : 'Connection failed';

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor }]}>
            <View style={styles.content}>
                <ThemedText style={styles.text}>{message}</ThemedText>
                {!!connectionError && !isWakingUp && (
                    <TouchableOpacity onPress={wakeServer} style={styles.retryButton}>
                        <ThemedText style={styles.retryText}>Retry</ThemedText>
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    retryButton: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    retryText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
});
