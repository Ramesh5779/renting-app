import { User } from '@/types/room';
import { parseError } from '@/utils/errorHandler';
import { logger } from '@/utils/logger';
import { supabase } from './supabase';

export const AuthService = {
    /**
     * Sign up a new user
     */
    async signUp(email: string, password: string, userData: { name: string; phone?: string }) {
        logger.log('🔐 Starting signup for:', email);

        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: userData.name,
                        phone: userData.phone,
                    },
                },
            });

            // Log the complete response for debugging
            logger.log('📝 SignUp Response:', {
                hasUser: !!authData.user,
                hasSession: !!authData.session,
                userId: authData.user?.id,
                emailConfirmationSent: authData.user && !authData.session,
                error: authError
            });

            if (authError) {
                logger.error('❌ Signup error:', authError);
                throw parseError(authError);
            }

            if (!authData.user) {
                logger.error('❌ Signup failed: No user data returned');
                throw new Error('User creation failed');
            }

            // Check if email confirmation is required
            if (authData.user && !authData.session) {
                logger.log('📧 Email confirmation required for:', email);
                return {
                    ...authData,
                    emailConfirmationRequired: true
                };
            }

            logger.log('✅ User created successfully:', authData.user.id);
            return authData;
        } catch (error) {
            logger.error('❌ SignUp exception:', error);
            throw error;
        }
    },

    /**
     * Sign in existing user
     */
    async signIn(email: string, password: string) {
        logger.log('🔐 Starting sign in for:', email);
        const startTime = Date.now();

        try {
            logger.log('⏱️ Calling Supabase signInWithPassword...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            const duration = Date.now() - startTime;
            logger.log(`✅ Supabase responded in ${duration}ms`);

            // Log the complete response for debugging
            logger.log('📝 SignIn Response:', {
                hasUser: !!data.user,
                hasSession: !!data.session,
                userId: data.user?.id,
                error: error
            });

            if (error) {
                logger.error('❌ Sign in error:', error);

                // Provide specific error messages
                if (error.message.includes('Email not confirmed')) {
                    throw new Error('Please confirm your email address before signing in. Check your inbox for the confirmation link.');
                }

                if (error.message.includes('Invalid login credentials')) {
                    throw new Error('Invalid email or password. Please check your credentials and try again.');
                }

                throw parseError(error);
            }

            if (!data.session) {
                logger.error('❌ Sign in failed: No session created');
                throw new Error('Sign in failed. Please try again or contact support.');
            }

            logger.log('✅ Sign in successful');
            return data;
        } catch (error) {
            logger.error('❌ SignIn exception:', error);
            throw error;
        }
    },

    /**
     * Sign in with Google OAuth
     */
    async signInWithGoogle() {
        logger.log('🔐 Starting Google sign-in');

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'rentingapp://auth/callback',
                    skipBrowserRedirect: false,
                },
            });

            if (error) {
                logger.error('❌ Google sign-in error:', error);
                throw parseError(error);
            }

            logger.log('✅ Google sign-in initiated');
            return data;
        } catch (error) {
            logger.error('❌ Google sign-in exception:', error);
            throw error;
        }
    },

    /**
     * Sign out current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw parseError(error);
    },

    /**
     * Get current session
     */
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw parseError(error);
        return session;
    },

    /**
     * Get current user profile
     */
    async getCurrentUserProfile(): Promise<User | null> {
        const session = await this.getSession();
        if (!session?.user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
            // If profile doesn't exist yet (race condition with trigger), return null
            if (error.code === 'PGRST116') {
                logger.warn('Profile not found yet, might still be creating');
                return null;
            }
            throw parseError(error);
        }

        return {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            profileImage: data.profile_image,
            createdAt: data.created_at,
        };
    },

    /**
     * Update user profile
     */
    async updateProfile(updates: Partial<User>) {
        const session = await this.getSession();
        if (!session?.user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('profiles')
            .update({
                name: updates.name,
                phone: updates.phone,
                profile_image: updates.profileImage,
            })
            .eq('id', session.user.id);

        if (error) throw parseError(error);
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (event: string, session: import('@supabase/supabase-js').Session | null) => void) {
        return supabase.auth.onAuthStateChange(callback);
    },
};
