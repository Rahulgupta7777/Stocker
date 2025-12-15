import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    name: string;
    email: string;
    picture: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Ensure decoded token has expected structure
                const userData: User = {
                    id: decoded.sub || decoded.id,
                    name: decoded.name,
                    email: decoded.email,
                    picture: decoded.picture || "https://ui-avatars.com/api/?name=" + (decoded.name || 'User')
                };
                setUser(userData);
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('auth_token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token: string) => {
        localStorage.setItem('auth_token', token);
        try {
            const decoded: any = jwtDecode(token);
            const userData: User = {
                id: decoded.sub || decoded.id,
                name: decoded.name,
                email: decoded.email,
                picture: decoded.picture || "https://ui-avatars.com/api/?name=" + (decoded.name || 'User')
            };
            setUser(userData);
        } catch (e) {
            console.error("Login decode error", e);
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setUser(null);
    };

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading }}>
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
