import { supabase } from '../config/supabase.js';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

/**
 * Register a new user
 */
export const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        // Create user in Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role: 'CITIZEN'
                }
            }
        });

        if (error) return res.status(400).json({ error: error.message });

        if (!data.user) return res.status(400).json({ error: 'User creation failed' });

        // Create user in Prisma
        const user = await prisma.user.create({
            data: {
                id: data.user.id,
                email: data.user.email,
                name: name || email.split('@')[0],
                role: 'CITIZEN'
            }
        });

        res.status(201).json({ user, session: data.session });
    } catch (err) {
        logger.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register' });
    }
};

/**
 * Login user
 */
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) return res.status(401).json({ error: error.message });

        const user = await prisma.user.findUnique({
            where: { id: data.user.id }
        });

        res.json({ user, session: data.session });
    } catch (err) {
        logger.error('Login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
};

/**
 * Get current user
 */
export const getMe = (req, res) => {
    res.json(req.user);
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
    // Client-side handles clearing tokens, but we can call supabase.auth.signOut() if session is provided
    res.status(200).json({ message: 'Logout successful' });
};

