import type { Locator, Page } from "@playwright/test";
import { envConfig } from "../config/env.config.js"


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
        await this.page.goto(fullUrl, { waitUntil: 'domcontentloaded' })

    }

    public async waitForPageLoad(): Promise<void> {
        await this.pageLoadedSuccessLocator.waitFor({ state: 'visible' })
    }
    protected async scrollIntoView(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(150);
    }
    
    public async clickElement(locator:Locator):Promise<void> {
        await this.scrollIntoView(locator)
        await locator.click(); 
    }









}