import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.API_URL;
if (!url) {
    console.error("ERROR: API_URL is not defined in .env");
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: url,
    validateStatus: () => true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));