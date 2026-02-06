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
        await this.driver.get('https://web.max.ru/');
    }

    async getTitle() {
        return await this.driver?.getTitle();
    }
    
    async getBodyText(className: string) {
        if (!this.driver) throw new Error("Driver not initialized");
    
        const element = await this.driver.wait(
            until.elementLocated(By.css('body .title')), 
        10000
        );
        return await element.getText();
    }


    async close() {
        await this.driver?.quit();
    }
}