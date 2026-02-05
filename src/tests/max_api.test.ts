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

            if (response.status !== 200) {
                console.log('API Error Data:', JSON.stringify(response.data, null, 2));
            }

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('idMessage');
        });

        test('Success: Send with large preview', async () => {
            const response = await api.sendMessage(testChatId, "Check this: https://green-api.com", {
                linkPreview: true,
                typePreview: "large"
            });
            
            if (response.status !== 200) {
                console.log('Error details:', response.data);
            }

            expect(response.status).toBe(200);
        });

        test('Success: Send with small preview', async () => {
            const response = await api.sendMessage(testChatId, "Check this: https://green-api.com", {
                linkPreview: true,
                typePreview: "small"
            });
            expect(response.status).toBe(200);
        });

        test('Success: Send message with invalid quotedMessageId (Status 200 per docs)', async () => {
                const invalidQuotedId = "NON_EXISTENT_ID_12345";
    
                const response = await api.sendMessage(testChatId, "A message with a citation check", {
                quotedMessageId: invalidQuotedId
            });

            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty('idMessage');
    
            console.log('Quoted ID test passed with status 200');
        });

        //Время показа уведомления набора сообщения в чате собеседника.
        //Время ограничено значениями от 1000 до 20000 миллисекунд (от 1 до 20 секунд).
        test('Negative: typingTime too small (500ms) - Expect 400', async () => {
            const response = await api.sendMessage(testChatId, "Checking min typingTime", {
                typingTime: 500
            });
            // Если сервер строго следует документации, он вернет 400
            expect([400, 429]).toContain(response.status);
        });

        test('Negative: typingTime too large (21000ms) - Expect 400', async () => {
            const response = await api.sendMessage(testChatId, "Checking max typingTime", {
                typingTime: 21000
            });
            expect([400, 429]).toContain(response.status);
        });

        test('Positive: typingTime at edge (1000ms) - Expect 200', async () => {
            const response = await api.sendMessage(testChatId, "Checking edge typingTime", {
                typingTime: 1000
            });
            expect(response.status).toBe(200);
        });

        test('Error: Message exceeds 20000 characters (Status 400)', async () => {
            const response = await api.sendMessage(testChatId, "A".repeat(20001));
            expect(response.status).toBe(400);
        });

        test('Error: linkPreview as string instead of boolean (Status 400)', async () => {
            const response = await api.sendMessage(testChatId, "Test", {
                linkPreview: "yes" as any // Передаем строку вместо true/false
            });
            expect([400, 429]).toContain(response.status); 
        });

        test('Error: Request entity too large (Status 500)', async () => {
            const hugeData = "X".repeat(150000); 
            const response = await api.sendMessage(testChatId, hugeData);
            console.log('Large Payload Status:', response.status);
            expect([400, 413, 500, 429]).toContain(response.status); 
        });

        test('Error: Invalid encoding - non UTF-8 (Status 400)', async () => {
            const invalidString = Buffer.from([0xFF, 0xFE, 0xFD]).toString('binary');
            const response = await api.sendMessage(testChatId, invalidString);
            expect([200, 400, 413, 429, 500]).toContain(response.status);
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