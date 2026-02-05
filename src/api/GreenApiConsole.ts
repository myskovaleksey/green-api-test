import { Builder, WebDriver, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export class GreenApiConsole {
    private driver: WebDriver | null = null;

    async init() {
        const options = new chrome.Options();
        // Включаем headless режим, чтобы браузер не мелькал при тестах (удобно для CI)
        options.addArguments('--headless', '--no-sandbox', '--disable-dev-shm-usage');
        
        this.driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
    }

    async openMainPage() {
        if (!this.driver) throw new Error("Driver not initialized");
        await this.driver.get('https://green-api.com/');
    }

    async getTitle() {
        return await this.driver?.getTitle();
    }

    async close() {
        await this.driver?.quit();
    }
}