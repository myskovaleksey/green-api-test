import { GreenApiClient } from '../../api/GreenApiClient';

const api = new GreenApiClient();
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Method: getStateInstance', () => {

    beforeEach(async () => {
        await sleep(1000);
    });

    test('Success: Instance should be authorized', async () => {
        const response = await api.getStateInstance();
        
        expect(response.status).toBe(200);
        
        // Проверка обязательного поля
        expect(response.data).toHaveProperty('stateInstance');
        
        console.log(`Current Instance State: ${response.data.stateInstance}`);
        expect(response.data.stateInstance).toBe('authorized');
    });

    test('Negative: Incorrect API Token for State', async () => {
        const brokenApi = new GreenApiClient();
        (brokenApi as any).apiToken = "INVALID_TOKEN";
        
        const response = await brokenApi.getStateInstance();
        expect(response.status).toBe(401);
    });
});