"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPosition = exports.createPortfolio = exports.getPortfolios = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper to get userId from request (Mock for now, should use Auth middleware)
const getUserId = (req) => req.headers['user-id'];
const getPortfolios = async (req, res) => {
    const userId = getUserId(req);
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const portfolios = await prisma.portfolio.findMany({
            where: { userId },
            include: { positions: true }
        });
        res.json(portfolios);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolios' });
    }
};
exports.getPortfolios = getPortfolios;
const createPortfolio = async (req, res) => {
    const userId = getUserId(req);
    const { name } = req.body;
    if (!userId)
        return res.status(401).json({ error: 'Unauthorized' });
    if (!name)
        return res.status(400).json({ error: 'Name is required' });
    try {
        const portfolio = await prisma.portfolio.create({
            data: {
                name,
                userId
            }
        });
        res.json(portfolio);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create portfolio' });
    }
};
exports.createPortfolio = createPortfolio;
const addPosition = async (req, res) => {
    const { portfolioId } = req.params;
    const { ticker, quantity, avgPrice } = req.body;
    try {
        const position = await prisma.position.create({
            data: {
                portfolioId,
                ticker,
                quantity: Number(quantity),
                avgPrice: Number(avgPrice)
            }
        });
        res.json(position);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add position' });
    }
};
exports.addPosition = addPosition;
