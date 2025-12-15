"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
const authController_1 = require("./src/controllers/authController");
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// Auth Routes
app.post('/api/auth/google', authController_1.loginWithGoogle);
// Portfolio Routes
const portfolioController_1 = require("./src/controllers/portfolioController");
app.get('/api/portfolios', portfolioController_1.getPortfolios);
app.post('/api/portfolios', portfolioController_1.createPortfolio);
app.post('/api/portfolios/:portfolioId/positions', portfolioController_1.addPosition);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
