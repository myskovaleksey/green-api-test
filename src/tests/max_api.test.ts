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

});