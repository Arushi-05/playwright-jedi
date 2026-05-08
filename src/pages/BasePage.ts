import type { Locator, Page } from "@playwright/test";
import { envConfig } from "../config/env.config.js"
import { logger } from '../utils/logger.js'
import { expect } from '@playwright/test'
export abstract class BasePage {
    protected readonly page: Page
    protected readonly baseUrl: string
    abstract readonly pagePath: string
    abstract readonly pageLoadedSuccessLocator: Locator

    constructor(page: Page) {
        this.page = page
        this.baseUrl = envConfig.baseUrl;

    }
    public async goTo(): Promise<void> {
        const fullUrl = `${this.baseUrl}${this.pagePath}`;
        logger.info(`Navigating to: ${fullUrl}`);
        await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' })
        await this.waitForPageLoad();

    }

    public async waitForPageLoad(): Promise<void> {
        await this.pageLoadedSuccessLocator.waitFor({ state: 'visible' })
    }
    protected async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(150);
    }

    public async clickElement(locator: Locator, description: string = 'element'): Promise<void> {
        await this.scrollIntoView(locator)
        logger.info(`Clicking: ${description}`);
        await locator.click();
    }
    protected async type(locator: Locator, text: string, description: string = 'field'): Promise<void> {
        logger.info(`Typing into ${description}: "${text}"`);
        await this.scrollIntoView(locator);
        await locator.fill(text);
    }

    protected async typeSequentially(locator: Locator, text: string, delay: number = 50): Promise<void> {
        await this.scrollIntoView(locator);
        await locator.pressSequentially(text, { delay });
    }

    protected async selectOption(locator: Locator, value: string): Promise<void> {
        await locator.selectOption(value);
    }

    protected async check(locator: Locator): Promise<void> {
        await this.scrollIntoView(locator);
        await locator.check();
    }

    protected async uncheck(locator: Locator): Promise<void> {
        await this.scrollIntoView(locator);
        await locator.uncheck();
    }

    protected async getText(locator: Locator): Promise<string> {
        return (await locator.textContent())?.trim() ?? '';
    }

    protected async getValue(locator: Locator): Promise<string> {
        return await locator.inputValue();
    }

    protected async getAttribute(locator: Locator, attr: string): Promise<string | null> {
        return await locator.getAttribute(attr);
    }

    protected async isVisible(locator: Locator): Promise<boolean> {
        return await locator.isVisible();
    }
    public async getUrl(): Promise<string> {
        return this.page.url();
    }

    public async assertUrlContains(text: string): Promise<void> {
        await expect(this.page).toHaveURL(new RegExp(text));
    }
    protected async isEnabled(locator: Locator): Promise<boolean> {
        return await locator.isEnabled();
    }
    public async takeScreenshot(name: string): Promise<void> {
        const filePath = `test-results/${name}-${Date.now()}.png`;
        await this.page.screenshot({ path: filePath, fullPage: true });
        logger.info(`Screenshot saved: ${filePath}`);
    }









}