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

// Portfolio Routes
import { getPortfolios, createPortfolio, addPosition } from './src/controllers/portfolioController';
app.get('/api/portfolios', getPortfolios);
app.post('/api/portfolios', createPortfolio);
app.post('/api/portfolios/:portfolioId/positions', addPosition);

// Analysis Routes (Proxy)
import { getStockAnalysis, getStockHistory } from './src/controllers/analysisController';
app.get('/api/analyze/:ticker', getStockAnalysis);
app.get('/api/history/:ticker', getStockHistory);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
