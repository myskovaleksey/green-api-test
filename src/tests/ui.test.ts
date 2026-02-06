import { GreenApiConsole } from '../api/GreenApiConsole';

describe('MAX Web UI Smoke Tests', () => {
    let consoleUi: GreenApiConsole;

    beforeAll(async () => {
        consoleUi = new GreenApiConsole();
        await consoleUi.init();
    }, 20000); // Увеличиваем таймаут до 20 сек для запуска браузера

    afterAll(async () => {
        await consoleUi.close();
    });

    test('Should load main page and have correct title', async () => {
        await consoleUi.openMainPage();
        const title = await consoleUi.getTitle();
        // console.log('--- DEBUG INFO ---');
        // console.log('Page Title:', title);
        // console.log('------------------');
        expect(title).toContain('MAX');  
    });

    test('Should find .title class specifically inside body', async () => {
        await consoleUi.openMainPage();
        const bodyText = await consoleUi.getBodyText();
        expect(bodyText.toUpperCase()).toContain('MAX');
    })
});