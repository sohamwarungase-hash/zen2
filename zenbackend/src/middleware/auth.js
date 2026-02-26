import { supabase } from '../config/supabase.js';
import prisma from '../config/prisma.js';

export async function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.slice(7).trim();
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

        if (error || !authUser) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        let dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
        });

        if (!dbUser) {
            dbUser = await prisma.user.create({
                data: {
                    id: authUser.id,
                    email: authUser.email,
                    name: authUser.user_metadata?.name || authUser.email.split('@')[0],
                    role: authUser.user_metadata?.role || 'CITIZEN',
                }
            });
        }

        req.user = dbUser;
        next();
    } catch (_err) {
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
}
