import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    first_name: string;
    lastName: string;
    last_name: string;
    zoomConnected?: boolean;
    zohoConnected?: boolean;
}

interface AuthContextType {
    isAuthenticated: boolean;
    userProfile: UserProfile | null;
    loading: boolean;
    login: (profile: UserProfile) => void;
    checkAuthStatus: () => Promise<boolean>;
    setAuthData: (userId: string, userData: any) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Check auth status with server on load
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/users/me', {
                    withCredentials: true
                });
                setIsAuthenticated(true);
                setUserProfile(response.data);
            } catch (err) {
                setIsAuthenticated(false);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (profile: UserProfile) => {
        setIsAuthenticated(true);
        setUserProfile(profile);
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:4000/api/users/auth-status', {
                withCredentials: true
            });

            if (response.data.authenticated) {
                // Get full user profile
                const userResponse = await axios.get('http://localhost:4000/api/users/me', {
                    withCredentials: true
                });

                setIsAuthenticated(true);
                setUserProfile(userResponse.data);
                return true;
            } else {
                setIsAuthenticated(false);
                setUserProfile(null);
                return false;
            }
        } catch (err) {
            console.error('Error checking auth status:', err);
            setIsAuthenticated(false);
            setUserProfile(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Implement the missing setAuthData method
    const setAuthData = (userId: string, userData: any) => {
        if (userProfile && userProfile.id === userId) {
            setUserProfile({ ...userProfile, ...userData });
        }
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:4000/api/users/logout', {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error('Error logging out from server:', err);
        }

        setIsAuthenticated(false);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            userProfile,
            loading,
            login,
            checkAuthStatus,
            setAuthData, // Added the missing setAuthData method
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};