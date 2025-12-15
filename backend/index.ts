import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

import { loginWithGoogle } from './src/controllers/authController';

app.use(cors());
app.use(express.json());

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Auth Routes
app.post('/api/auth/google', loginWithGoogle);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
