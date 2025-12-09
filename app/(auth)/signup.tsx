import { useAuth } from '@/components/auth/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signUp, signIn } = useAuth();

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Validate email format
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            Alert.alert('Weak Password', passwordValidation.error || 'Please choose a stronger password');
            return;
        }

        try {
            setLoading(true);

            // Add timeout protection (60s for cold starts)
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out. The server might be waking up, please try again.')), 60000);
            });

            const signupPromise = signUp(email, password, { name });

            const result: any = await Promise.race([signupPromise, timeoutPromise]);

            // Check if email confirmation is required
            if (result?.emailConfirmationRequired) {
                Alert.alert(
                    'Check Your Email',
                    'We\'ve sent a confirmation link to your email address. Please check your inbox and click the link to activate your account before signing in.',
                    [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
                );
                return;
            }

            // If signup successful and no email confirmation needed, sign in automatically
            console.log('✅ Signup successful, signing in automatically...');
            await signIn(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            console.error('Signup Error Details:', error);
            Alert.alert('Signup Failed', error.message || 'An unknown error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.content}>
                <ThemedText type="h1" style={styles.title}>Create Account</ThemedText>
                <ThemedText style={styles.subtitle}>Join us to find your perfect space</ThemedText>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Full Name</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Email</ThemedText>
                        <TextInput
                            style={styles.input}
                            placeholder="john@example.com"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText style={styles.label}>Password</ThemedText>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={24}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Button
                        title="Create Account"
                        onPress={handleSignup}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <ThemedText>Already have an account? </ThemedText>
                        <Link href="/(auth)/login" asChild>
                            <ThemedText type="link">Sign In</ThemedText>
                        </Link>
                    </View>
                </View>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: Spacing.xl,
        opacity: 0.7,
    },
    form: {
        gap: Spacing.lg,
    },
    inputContainer: {
        gap: Spacing.xs,
    },
    label: {
        fontWeight: '600',
        marginLeft: 4,
    },
    input: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: Spacing.md,
        borderRadius: 12,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        position: 'relative',
    },
    passwordInput: {
        flex: 1,
        padding: Spacing.md,
        fontSize: 16,
    },
    eyeIcon: {
        padding: Spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: Spacing.sm,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.lg,
    },
});
