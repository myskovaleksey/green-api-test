import { GreenApiClient } from '../../api/GreenApiClient';

const api = new GreenApiClient();
const testChatId = process.env.NUMERIC_CHAT_ID || '';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Method: getChatHistory - Comprehensive Testing', () => {

    beforeEach(async () => {
        await sleep(1000);
    });


    beforeAll(() => {
        if (!testChatId) {
            throw new Error("NUMERIC_CHAT_ID is not defined in .env file");
        }
    });

    test('Positive: Retrieve last 5 messages', async () => {
        const response = await api.getChatHistory(testChatId, 5);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.data.length).toBeLessThanOrEqual(5);
    });

    test('Boundary: Retrieve exactly 1 message', async () => {
        const response = await api.getChatHistory(testChatId, 1);
        expect(response.status).toBe(200);
        expect(response.data.length).toBe(1);
    });

    test('Negative: Invalid count format (string)', async () => {
        // Проверяем, как сервер реагирует на "abc" вместо числа
        const response = await api.getChatHistory(testChatId, "abc" as any);
        // Обычно API Green-API возвращает 400 или 422 на неверный тип
        expect([400, 422]).toContain(response.status);
    });

    test('Negative: Incorrect API Token', async () => {
        // Создаем временный клиент с "битым" токеном
        const brokenApi = new GreenApiClient();
        (brokenApi as any).apiToken = "INVALID_TOKEN_123";
        
        const response = await brokenApi.getChatHistory(testChatId, 10);
        expect(response.status).toBe(401);
    });

    test('Data Integrity: Check message object structure', async () => {
        const response = await api.getChatHistory(testChatId, 1);
        const msg = response.data[0];
        
        // Проверяем наличие обязательных полей согласно документации
        expect(msg).toHaveProperty('type');
        expect(msg).toHaveProperty('idMessage');
        expect(msg).toHaveProperty('timestamp');
        // Поле может быть либо textMessage, либо extendedTextMessage
        const hasText = msg.textMessage !== undefined || msg.extendedTextMessage !== undefined;
        expect(hasText).toBe(true);
    });
});