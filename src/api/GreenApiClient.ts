import axios, { AxiosInstance } from 'axios';
import options = require('axios');
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

    async getStateInstance() {
        return await this.client.get(`/getStateInstance/${this.apiToken}`);
    }

    async sendMessage(
        chatId: string, 
        message: string, 
        options: { 
            linkPreview?: boolean, 
            typePreview?: string, 
            quotedMessageId?: string 
        } = {}) {
        const payload: any = {
            chatId: chatId.includes('@') ? chatId : `${chatId}@c.us`,
            message: message
        };

        if (options.linkPreview !== undefined) payload.linkPreview = options.linkPreview;
        if (options.typePreview !== undefined) payload.typePreview = options.typePreview;
        if (options.quotedMessageId !== undefined) payload.quotedMessageId = options.quotedMessageId;

        return await this.client.post(`/sendMessage/${this.apiToken}`, payload);
    }

    async getChatHistory(chatId: string, count: number = 10) {
        return await this.client.post(`/getChatHistory/${this.apiToken}`, {
            chatId: chatId.includes('@') ? chatId : `${chatId}@c.us`,
            count: count
        });
    }
}