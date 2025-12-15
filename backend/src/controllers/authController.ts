import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (req: Request, res: Response) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        // Verify the token from Google
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            return res.status(400).json({ error: 'Invalid token payload' });
        }

        const { email, name, picture, sub: googleId } = payload;

        // Create or Update User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name,
                avatarUrl: picture,
                googleId
            },
            create: {
                email,
                name,
                avatarUrl: picture,
                googleId
            },
        });

        // In a production app, we would issue our own JWT here.
        // For now, we return the user info.
        res.json({
            message: 'Login successful',
            user
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};
