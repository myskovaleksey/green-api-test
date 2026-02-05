import { GreenApiClient } from '../api/GreenApiClient';

const api = new GreenApiClient();
const testChatId = process.env.RECIPIENT_PHONE || '';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('GREEN-API Integration Tests', () => {

    beforeEach(async () => {
        await sleep(1000);
    });

    test('Requirement: Instance must be authorized', async () => {
        const response = await api.getStateInstance();
        expect(response.status).toBe(200);
        expect(response.data.stateInstance).toBe('authorized');
    });

    describe('Method: sendMessage', () => {
        test('Success: Send text message with emoji (Status 200)', async () => {
            const response = await api.sendMessage(testChatId, "Emoji test 😃🚀");
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('idMessage');
        });

        test('Error: Message exceeds 20000 characters (Status 400)', async () => {
            const response = await api.sendMessage(testChatId, "A".repeat(20001));
            expect(response.status).toBe(400);
        });
    });

    describe('Method: getChatHistory', () => {
        test('Requirement 3 & 5: Success retrieve history and validate fields', async () => {
            const response = await api.getChatHistory(testChatId, 5);
            expect(response.status).toBe(200);
            expect(Array.isArray(response.data)).toBe(true);
            
            if (response.data.length > 0) {
                expect(response.data[0]).toHaveProperty('typeMessage');
            }
        });

        test('Error: Get history with invalid count type (Status 400)', async () => {
            const response = await api.getChatHistory(testChatId, "много" as any); 
            expect(response.status).toBe(400);
        });
    });
});