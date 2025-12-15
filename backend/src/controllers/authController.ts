import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key';

const generateToken = (user: any) => {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const loginWithGoogle = async (req: Request, res: Response) => {
    const { token } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload) {
            res.status(400).json({ error: 'Invalid token' });
            return;
        }

        const { email, name, picture, sub } = payload;

        const user = await prisma.user.upsert({
            where: { email: email! },
            update: { name: name!, picture: picture! },
            create: {
                email: email!,
                name: name!,
                picture: picture!,
                // valid google users don't need password
            },
        });

        const sessionToken = generateToken(user);
        res.json({ token: sessionToken, user });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export const register = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
            }
        });

        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Missing fields" });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            res.status(401).json({ error: "Invalid credentials" }); // Don't allow password login for google-only users without password
            return;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Login failed" });
    }
};

export const guestLogin = async (req: Request, res: Response) => {
    // Guest login creates a temporary user or uses a shared guest account logic.
    // Ideally, for a persistent guest experience without cluttering the DB, we might send a token with a specific "guest" payload 
    // and handle DB writes carefully (or transiently).
    // For simplicity here, we create a new random Guest User each time or reuse one if needed.
    // Let's create a distinct Guest user.

    try {
        const guestId = Math.random().toString(36).substring(7);
        const email = `guest_${guestId}@stocker.local`;

        const user = await prisma.user.create({
            data: {
                email: email,
                name: "Guest User",
                picture: "https://ui-avatars.com/api/?name=Guest&background=random",
                // data expires or is cleaned up via cron in real app
            }
        });

        const token = generateToken(user);
        res.json({ token, user });
    } catch (error) {
        console.error("Guest Login Error:", error);
        res.status(500).json({ error: "Guest login failed" });
    }
};
