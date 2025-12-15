import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
    baseURL: API_URL,
});

export const authGoogle = async (token: string) => {
    const response = await api.post('/auth/google', { token });
    return response.data;
};

export const registerEmail = async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const loginEmail = async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const loginGuest = async () => {
    const response = await api.post('/auth/guest');
    return response.data;
};

export const getAnalysis = async (ticker: string) => {
    const response = await api.get(`/analyze/${ticker}`);
    return response.data;
};

export const getHistory = async (ticker: string) => {
    const response = await api.get(`/history/${ticker}`);
    return response.data;
};
