import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface OfflineBannerProps {
    visible: boolean;
}

export function OfflineBanner({ visible }: OfflineBannerProps) {
    const [slideAnim] = React.useState(new Animated.Value(-60));

    React.useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: visible ? 0 : -60,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [visible, slideAnim]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY: slideAnim }],
                },
            ]}
        >
            <View style={styles.content}>
                <IconSymbol name="wifi" size={18} color="#fff" />
                <ThemedText style={styles.text}>No internet connection</ThemedText>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#DC2626',
        paddingVertical: 12,
        paddingHorizontal: 16,
        paddingTop: 50, // Account for status bar
        zIndex: 9999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});
