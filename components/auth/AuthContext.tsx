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
        // Initial session check
        AuthService.getSession().then(session => {
            setSession(session);
            if (session) {
                refreshProfile();
            }
            setIsLoading(false);
        }).catch(err => {
            // Suppress "Invalid Refresh Token" error - expected when logged out
            if (!err?.message?.includes('Refresh Token Not Found')) {
                console.error('Error getting session:', err);
            }
            setIsLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
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
