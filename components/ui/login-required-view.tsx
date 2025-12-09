import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from './button';
import { IconSymbol } from './icon-symbol';

interface LoginRequiredViewProps {
    message?: string;
}

export function LoginRequiredView({ message = 'Please log in to access this feature' }: LoginRequiredViewProps) {
    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <IconSymbol name="person.fill" size={56} color="#666" />
                </View>
                <ThemedText type="h3" style={styles.title}>
                    Login Required
                </ThemedText>
                <ThemedText style={styles.message}>
                    {message}
                </ThemedText>
                <Button
                    title="Log In / Sign Up"
                    onPress={() => router.push('/(auth)/login')}
                    style={styles.button}
                />
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    content: {
        alignItems: 'center',
        maxWidth: 300,
        width: '100%',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    message: {
        textAlign: 'center',
        opacity: 0.7,
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
    button: {
        width: '100%',
    },
});
