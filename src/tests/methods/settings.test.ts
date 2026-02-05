import { GreenApiClient } from '../../api/GreenApiClient';

const api = new GreenApiClient();

describe('Instance Configuration Check', () => {

    test('Verify and Force Enable Settings', async () => {
        // 1. Проверяем текущий статус подключения
        const state = await api.getStateInstance();
        console.log('--- Instance Status ---');
        console.log(`State: ${state.data.stateInstance}`); // Должно быть 'authorized'
        expect(state.data.stateInstance).toBe('authorized');

        // 2. Проверяем настройки
        let settings = await api.getSettings();
        console.log('--- Current Settings Before Fix ---');
        console.log(`Incoming Webhook: ${settings.data.incomingWebhook}`);
        console.log(`Outgoing Webhook: ${settings.data.outgoingMessageWebhook}`);

        // 3. Если настройки все еще "no", принудительно включаем их
        if (settings.data.incomingWebhook === 'no' || settings.data.outgoingMessageWebhook === 'no') {
            console.log('Settings are OFF. Sending update request...');
            await api.setSettings({
                incomingWebhook: "yes",
                outgoingMessageWebhook: "yes",
                outgoingAPIMessageWebhook: "yes",
                incomingMsgWebhook: "yes" // Дополнительный флаг для некоторых версий
            });
            
            // Ждем 5 секунд и перепроверяем
            await new Promise(resolve => setTimeout(resolve, 5000));
            settings = await api.getSettings();
        }

        // 4. Финальная проверка
        console.log('--- Final Settings Verification ---');
        console.log(`Incoming Webhook: ${settings.data.incomingWebhook}`);
        console.log(`Outgoing Webhook: ${settings.data.outgoingMessageWebhook}`);

        expect(settings.data.incomingWebhook).toBe('yes');
        expect(settings.data.outgoingMessageWebhook).toBe('yes');
    });
});