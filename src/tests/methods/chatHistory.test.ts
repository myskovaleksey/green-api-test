import { GreenApiClient } from '../../api/GreenApiClient';

const api = new GreenApiClient();
const testChatId = "4069585";
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Method: getChatHistory', () => {

    beforeEach(async () => {
        await sleep(1000);
    });

    test('Success: Retrieve last 10 messages using Numeric ID', async () => {
        const count = 10;
        console.log(`--- Requesting last ${count} messages for: ${testChatId} ---`);
        console.log(`--- Requesting history for Numeric ID: ${testChatId} ---`);
        
        const response = await api.getChatHistory(testChatId, count);
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);

        if (response.data.length > 0) {
            console.log(`✅ Found ${response.data.length} messages!`);
            
            response.data.forEach((msg: any, index: number) => {
                const text = msg.textMessage || "[Media/System]";
                console.log(`${index + 1}. [${msg.type}] ID: ${msg.idMessage} | Text: ${text.substring(0, 30)}`);
            });
        } else {
            console.log("❌ Even with numeric ID, history is empty.");
        }
    });
    
   
});