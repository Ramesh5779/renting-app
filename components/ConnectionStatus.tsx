import { ThemedText } from '@/components/themed-text';
import { supabase } from '@/lib/supabase';
import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';

export function ConnectionStatus() {
    const [status, setStatus] = useState<'connected' | 'connecting' | 'error' | 'hidden'>('hidden');
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        let mounted = true;
        const checkConnection = async () => {
            // Only show "Connecting..." if it takes more than 2 seconds
            const timer = setTimeout(() => {
                if (mounted) {
                    setStatus('connecting');
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }
            }, 2000);

            try {
                // Simple query to wake up the database
                const { error } = await supabase.from('room_listings').select('id').limit(1).maybeSingle();

                if (error) throw error;

                if (mounted) {
                    clearTimeout(timer);
                    // If we were showing "connecting", show "connected" briefly then hide
                    if (status === 'connecting') {
                        setStatus('connected');
                        setTimeout(() => {
                            Animated.timing(fadeAnim, {
                                toValue: 0,
                                duration: 300,
                                useNativeDriver: true,
                            }).start(() => setStatus('hidden'));
                        }, 2000);
                    } else {
                        // If we finished before the timer, just stay hidden
                        setStatus('hidden');
                    }
                }
            } catch (err) {
                console.error('Connection check failed:', err);
                if (mounted) {
                    clearTimeout(timer);
                    setStatus('error');
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }).start();
                }
            }
        };

        checkConnection();

        return () => {
            mounted = false;
        };
    }, []);

    if (status === 'hidden') return null;

    const getBackgroundColor = () => {
        switch (status) {
            case 'connecting': return '#FFA500'; // Orange
            case 'connected': return '#4CAF50'; // Green
            case 'error': return '#F44336'; // Red
            default: return 'transparent';
        }
    };

    const getMessage = () => {
        switch (status) {
            case 'connecting': return 'Waking up server...';
            case 'connected': return 'Connected!';
            case 'error': return 'Connection failed. Please restart.';
            default: return '';
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: getBackgroundColor() }]}>
            <ThemedText style={styles.text}>{getMessage()}</ThemedText>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50, // Below status bar
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
    text: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
});
