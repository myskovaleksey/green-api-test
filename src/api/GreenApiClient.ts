import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class GreenApiClient {
    private client: AxiosInstance;
    private idInstance = process.env.ID_INSTANCE;
    private apiToken = process.env.API_TOKEN_INSTANCE;

    constructor() {
        this.client = axios.create({
            baseURL: `${process.env.API_URL}/waInstance${this.idInstance}`,
            validateStatus: () => true,
        });
    }

    // Method: checked auth
    async getStateInstance() {
        return await this.client.get(`/getStateInstance/${this.apiToken}`);
    }

    // Method: send message
    async sendMessage(chatId: string, message: string) {
        return await this.client.post(`/sendMessage/${this.apiToken}`, {
            chatId: `${chatId}@c.us`,
            message: message
        });
    }

    // Method: get hysory
    async getChatHistory(chatId: string, count: number = 10) {
        return await this.client.post(`/getChatHistory/${this.apiToken}`, {
            chatId: `${chatId}@c.us`,
            count: count
        });
    }
}