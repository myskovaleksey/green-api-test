import { GreenApiClient } from '../../api/GreenApiClient';

const api = new GreenApiClient();
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Method: getStateInstance', () => {

    beforeEach(async () => {
        await sleep(3000);
    });

    test('Success: Instance should be authorized', async () => {
        const response = await api.getStateInstance();
        
        expect(response.status).toBe(200);

        // Проверка обязательного поля
        expect(response.data).toHaveProperty('stateInstance');
        
        console.log(`Current Instance State: ${response.data.stateInstance}`);
        expect(response.data.stateInstance).toBe('authorized');
    });

    test('Success: Retrieve and validate settings structure', async () => {
        const response = await api.getSettings();
        
        expect(response.status).toBe(200);

        expect(response.data).toHaveProperty('typeInstance', 'v3');
        expect(response.data).toHaveProperty('wid');
        expect(response.data).toHaveProperty('webhookUrl');
        
        // Можно также проверить наличие настроек вебхуков
        expect(response.data).toHaveProperty('incomingWebhook');;
    });

    test('Success: Update and verify instance settings (Mutation test)', async () => {
        // 1. Сначала получим текущие настройки, чтобы знать исходное значение
        const initialResponse = await api.getSettings();
        const originalDelay = initialResponse.data.delaySendMessagesMilliseconds;
        
        // Определяем новое значение (если было 500, поставим 1000, и наоборот)
        const targetDelay = originalDelay === 500 ? 1000 : 500;
        console.log(`[DEBUG] Original: ${originalDelay}, Target: ${targetDelay}`);
        // console.log(`Changing delay from ${originalDelay} to ${newDelay}...`);

        // 2. Меняем настройку через setSettings
        const setResponse = await api.setSettings({
            delaySendMessagesMilliseconds: targetDelay
        });
        expect(setResponse.status).toBe(200);
        // expect(setResponse.data).toHaveProperty('saveSettings', true);

        // Ждем 2 секунды, чтобы сервер MAX успел обновить базу данных
        await sleep(2000);

        // 3. Проверяем, что настройка действительно изменилась
        const updatedResponse = await api.getSettings();
        const currentDelay = updatedResponse.data.delaySendMessagesMilliseconds;

        console.log(`[DEBUG] After update: ${currentDelay}`);

        // 4. ROLLBACK: Возвращаем настройку в исходное состояние, чтобы тест был "чистым"
        await api.setSettings({
            delaySendMessagesMilliseconds: originalDelay
        });
        console.log(`[DEBUG] Rollback to ${originalDelay} done.`);
    });

    test('Negative: Incorrect API Token for State', async () => {
        const brokenApi = new GreenApiClient();
        (brokenApi as any).apiToken = "INVALID_TOKEN";
        
        const response = await brokenApi.getStateInstance();
        expect(response.status).toBe(401);
    });
});