import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { API_CONFIG } from "../config/api";
import { Session } from "@supabase/supabase-js";

type UserProfile = {
    id: string;
    email: string;
    name: string;
    role: "CITIZEN" | "ADMIN" | "DEPT_OFFICER";
    points: number;
};

type AuthContextType = {
    isSignedIn: boolean;
    user: UserProfile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    getToken: () => Promise<string | null>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    isSignedIn: false,
    user: null,
    loading: true,
    refreshProfile: async () => { },
    getToken: async () => null,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchProfile(session.access_token);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) {
                fetchProfile(session.access_token);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (token: string) => {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.ME, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const profile = await response.json();
                setUser(profile);
            }
        } catch (error) {
            console.error(
                "Failed to fetch user profile. This is usually a backend connectivity issue, not a Supabase login issue:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            await fetchProfile(session.access_token);
        }
    };

    const getToken = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token ?? null;
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            isSignedIn: !!session,
            user,
            loading,
            refreshProfile,
            getToken,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
