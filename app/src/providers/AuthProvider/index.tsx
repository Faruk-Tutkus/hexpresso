import { auth } from '@api/config.firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    authError: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null, 
    loading: true,
    isAuthenticated: false,
    authError: null
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);
    const isMountedRef = useRef(true);
    const authListenerRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 3;

        const setupAuthListener = () => {
            try {
                console.log('🔐 AuthProvider: Setting up auth listener...');
                
                const unsubscribe = onAuthStateChanged(
                    auth, 
                    (user) => {
                        if (!isMountedRef.current) return;
                        
                        console.log('🔐 AuthProvider: Auth state changed:', !!user);
                        setUser(user);
                        setLoading(false);
                        setAuthError(null);
                        retryCount = 0; // Reset retry count on successful auth change
                    },
                    (error) => {
                        if (!isMountedRef.current) return;
                        
                        console.error('🔐 AuthProvider: Auth error:', error);
                        setAuthError(error.message);
                        setLoading(false);
                        
                        // Retry logic for auth errors
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`🔐 AuthProvider: Retrying auth listener (${retryCount}/${maxRetries})...`);
                            setTimeout(() => {
                                if (isMountedRef.current) {
                                    setupAuthListener();
                                }
                            }, 1000 * retryCount); // Exponential backoff
                        }
                    }
                );
                
                authListenerRef.current = unsubscribe;
                return unsubscribe;
            } catch (error) {
                console.error('🔐 AuthProvider: Failed to setup auth listener:', error);
                setAuthError('Authentication setup failed');
                setLoading(false);
                return null;
            }
        };

        const unsubscribe = setupAuthListener();

        // Cleanup function
        return () => {
            isMountedRef.current = false;
            if (authListenerRef.current) {
                console.log('🔐 AuthProvider: Cleaning up auth listener');
                authListenerRef.current();
                authListenerRef.current = null;
            }
        };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const contextValue = {
        user,
        loading,
        isAuthenticated: !!user && !loading,
        authError
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};