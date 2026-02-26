import { supabase } from '../config/supabase.js';
import prisma from '../config/prisma.js';
import logger from '../utils/logger.js';

export const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
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

        const user = await prisma.user.create({
            data: {
                id: data.user.id,
                email: data.user.email,
                name: name || email.split('@')[0],
                role: 'CITIZEN'
            }
        });

        const token = data.session?.access_token ?? null;
        res.status(201).json({ user, token });
    } catch (err) {
        logger.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register' });
    }
};

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

        res.json({ user, token: data.session?.access_token ?? null });
    } catch (err) {
        logger.error('Login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
};

export const getMe = (req, res) => {
    res.json({ user: req.user });
};

export const logout = async (_req, res) => {
    res.status(200).json({ success: true });
};
