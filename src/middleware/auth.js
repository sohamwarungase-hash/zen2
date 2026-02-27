const jose = require('jose');

// ─── Remote JWKS set from Neon Auth ─────────────────────────────────────────
// Caches the JWKS and rotates automatically as keys change.
const JWKS = jose.createRemoteJWKSet(
    new URL(`${process.env.NEON_AUTH_URL}/.well-known/jwks.json`)
);

/**
 * JWT authentication middleware using Neon Auth JWKS verification.
 *
 * Extracts the Bearer token from the Authorization header,
 * verifies it against the Neon Auth JWKS endpoint, and attaches
 * `req.user` with the decoded `sub` (userId) claim.
 */
async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: 'Unauthorized',
            message: 'No token provided. Include a Bearer token in the Authorization header.',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { payload } = await jose.jwtVerify(token, JWKS, {
            issuer: new URL(process.env.NEON_AUTH_URL).origin,
        });

        if (!payload.sub) {
            return res.status(401).json({
                success: false,
                error: 'Invalid Token',
                message: 'Token is missing user identity (sub claim).',
            });
        }

        // Attach the verified user info to the request object
        req.user = {
            userId: payload.sub,
            email: payload.email || null,
            name: payload.name || null,
            raw: payload, // full payload available when needed
        };

        next();
    } catch (error) {
        console.error('[AUTH] JWT verification failed:', error.message);
        return res.status(401).json({
            success: false,
            error: 'Invalid token',
            message: 'Token verification failed. It may be expired or malformed.',
        });
    }
}

module.exports = authMiddleware;
