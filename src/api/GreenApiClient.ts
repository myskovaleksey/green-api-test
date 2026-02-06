import { apiClient } from './BaseClient';

export class GreenApiClient {
    private idInstance = process.env.ID_INSTANCE;
    private apiToken = process.env.API_TOKEN_INSTANCE;

    private get urlPrefix() {
        return `/waInstance${this.idInstance}`;
    }

    async getStateInstance() {
        return await apiClient.get(`${this.urlPrefix}/getStateInstance/${this.apiToken}`);
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

        return await apiClient.post(`${this.urlPrefix}/sendMessage/${this.apiToken}`, payload);
    }

    async getChatHistory(chatId: string | number, count: number = 100) {
        const strChatId = String(chatId);
        let finalChatId = strChatId;
        if (!strChatId.includes('@') && !/^\d+$/.test(strChatId)) {
            finalChatId = `${strChatId}@c.us`;
        }

        const payload = {
            chatId: finalChatId,
            count: count
        };
    
        return await apiClient.post(`${this.urlPrefix}/getChatHistory/${this.apiToken}`, payload);
    }

    async getSettings() {
        return await apiClient.get(`${this.urlPrefix}/getSettings/${this.apiToken}`);
    }

    async setSettings(settings: object) {
        return await apiClient.post(`${this.urlPrefix}/setSettings/${this.apiToken}`, settings);
    }

}