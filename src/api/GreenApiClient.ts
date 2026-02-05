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
            quotedMessageId?: string,
            typingTime?: number,
            customPreview?: object
        } = {}) {
        const payload: any = {
            chatId: chatId.includes('@') ? chatId : `${chatId}@c.us`,
            message: message
        };

        if (options.linkPreview !== undefined) payload.linkPreview = options.linkPreview;
        if (options.typePreview !== undefined) payload.typePreview = options.typePreview;
        if (options.quotedMessageId !== undefined) payload.quotedMessageId = options.quotedMessageId;
        if (options.typingTime !== undefined) payload.typingTime = options.typingTime;
        if (options.customPreview !== undefined) payload.customPreview = options.customPreview;

        return await this.client.post(`/sendMessage/${this.apiToken}`, payload);
    }

    async getChatHistory(chatId: string | number, count: number = 100) {
        // Приводим к строке, чтобы метод .includes не вызывал ошибку
        const strChatId = String(chatId);
    
        // Проверяем: если это не числовой ID (не содержит только цифры) 
        // и в нем нет @, тогда добавляем @c.us
        let finalChatId = strChatId;
        if (!strChatId.includes('@') && !/^\d+$/.test(strChatId)) {
            finalChatId = `${strChatId}@c.us`;
        }

        const payload = {
            chatId: finalChatId,
            count: count
        };
    
        return await this.client.post(`/getChatHistory/${this.apiToken}`, payload);
    }

    async getSettings() {
        return await this.client.get(`/getSettings/${this.apiToken}`);
    }

    async setSettings(settings: object) {
        return await this.client.post(`/setSettings/${this.apiToken}`, settings);
    }
}