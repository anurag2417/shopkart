import { createContext, useContext, useEffect, useState } from 'react';
import {
    getMyProfile,
    loginCustomer as loginAPI,
    logoutCustomer as logoutAPI,
    registerCustomer as registerAPI,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getMyProfile();
                setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (credentials) => {
        const res = await loginAPI(credentials);
        setUser(res.data.customer);
        return res.data;
    };

    const register = async (data) => {
        const res = await registerAPI(data);
        return res.data;
    };

    const logout = async () => {
        await logoutAPI();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
