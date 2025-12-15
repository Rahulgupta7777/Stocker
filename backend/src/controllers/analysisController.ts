import { Request, Response } from 'express';
import axios from 'axios';

const PYTHON_SERVICE_URL = 'http://127.0.0.1:8000';

export const getStockAnalysis = async (req: Request, res: Response) => {
    const { ticker } = req.params;

    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/analyze/${ticker}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error connecting to analysis service:', error);
        res.status(502).json({ error: 'Failed to fetch analysis from engine' });
    }
};

export const getStockHistory = async (req: Request, res: Response) => {
    const { ticker } = req.params;
    const { period } = req.query;

    try {
        const response = await axios.get(`${PYTHON_SERVICE_URL}/api/history/${ticker}`, {
            params: { period }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error connecting to analysis service:', error);
        res.status(502).json({ error: 'Failed to fetch history from engine' });
    }
};
