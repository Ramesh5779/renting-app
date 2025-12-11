import { AuthService } from '@/lib/auth';
import { User } from '@/types/room';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
    session: Session | null;
    user: User | null;
    isLoading: boolean;
    signIn: typeof AuthService.signIn;
    signUp: typeof AuthService.signUp;
    signInWithGoogle: typeof AuthService.signInWithGoogle;
    signOut: typeof AuthService.signOut;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signIn: async () => { throw new Error('AuthContext not initialized'); },
    signUp: async () => { throw new Error('AuthContext not initialized'); },
    signInWithGoogle: async () => { throw new Error('AuthContext not initialized'); },
    signOut: async () => { throw new Error('AuthContext not initialized'); },
    refreshProfile: async () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshProfile = async () => {
        try {
            const profile = await AuthService.getCurrentUserProfile();
            setUser(profile);
        } catch (error) {
            console.error('Error refreshing profile:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        // Initial session check with timeout and guaranteed cleanup
        const initializeAuth = async () => {
            try {
                console.log('🔐 Initializing auth session...');

                // Import timeout utility inline to avoid circular dependencies
                const withTimeout = async <T,>(promise: Promise<T>, ms: number, errorMessage = 'Request timed out'): Promise<T> => {
                    const timeout = new Promise<never>((_, reject) =>
                        setTimeout(() => reject(new Error(errorMessage)), ms)
                    );
                    return Promise.race([promise, timeout]);
                };

                const session = await withTimeout(
                    AuthService.getSession(),
                    45000,
                    'Auth initialization timed out'
                );

                setSession(session);
                if (session) {
                    console.log('✅ Session found, loading profile...');
                    await refreshProfile();
                } else {
                    console.log('ℹ️  No active session - guest mode');
                }
            } catch (err: any) {
                // Suppress expected "Invalid Refresh Token" errors when logged out
                if (!err?.message?.includes('Refresh Token Not Found') &&
                    !err?.message?.includes('Invalid Refresh Token')) {
                    console.error('❌ Error getting session:', err);
                }
                // Continue in guest mode
                setSession(null);
                setUser(null);
            } finally {
                // CRITICAL: Always set isLoading to false, regardless of success/failure
                console.log('✅ Auth initialization complete');
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
            console.log('🔐 Auth state changed:', event);
            setSession(session);
            if (session) {
                await refreshProfile();
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        isLoading,
        signIn: AuthService.signIn,
        signUp: AuthService.signUp,
        signInWithGoogle: AuthService.signInWithGoogle,
        signOut: AuthService.signOut,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
