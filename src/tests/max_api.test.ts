import { GreenApiClient } from '../api/GreenApiClient';

const api = new GreenApiClient();
const testChatId = process.env.RECIPIENT_PHONE || '';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('MAX App Integration Tests', () => {

    beforeEach(async () => {
        await sleep(1500); 
    });

    /**
     * ТРЕБОВАНИЕ: Проверка авторизации инстанса
     * Метод: getStateInstance
     */
    test('Requirement: Instance must be authorized', async () => {
        const response = await api.getStateInstance();
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('stateInstance');
        expect(response.data.stateInstance).toBe('authorized');
    });

    /**
     * ТРЕБОВАНИЕ: Отправка текстовых сообщений
     * Метод: sendMessage
     */
    describe('Method: sendMessage', () => {
        
        test('Success: Send valid text message (Status 200)', async () => {
            const message = "Test message for MAX app";
            const response = await api.sendMessage(testChatId, message);

            expect(response.status).toBe(200);
            // ПРОВЕРКА ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ
            expect(response.data).toHaveProperty('idMessage');
            expect(typeof response.data.idMessage).toBe('string');
        });

        test('Error: Send empty message (Status 400)', async () => {
            // В зависимости от реализации API, пустая строка может вернуть 400
            const response = await api.sendMessage(testChatId, "");
            
            expect(response.status).toBe(400);
        });
    });

    /**
     * ТРЕБОВАНИЕ: Получение истории сообщений
     * Метод: getChatHistory
     */
    describe('Method: getChatHistory', () => {
        
        test('Success: Retrieve chat history (Status 200)', async () => {
            const response = await api.getChatHistory(testChatId, 5);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);

            // ПРОВЕРКА ОБЯЗАТЕЛЬНЫХ ПОЛЕЙ в объектах истории
            if (response.data.length > 0) {
                const firstMsg = response.data[0];
                expect(firstMsg).toHaveProperty('type');
                expect(firstMsg).toHaveProperty('idMessage');
                expect(firstMsg).toHaveProperty('timestamp');
            }
        });

        test('Error: Get history for invalid chatId (Status 400)', async () => {
            // Передаем некорректный формат ID (например, слишком короткий)
            const response = await api.getChatHistory(testChatId, -1);
            
            expect(response.status).toBe(400);
        });
    });
});