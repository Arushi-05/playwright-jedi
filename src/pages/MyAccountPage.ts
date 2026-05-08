import type { Locator, Page } from "@playwright/test";
import { envConfig } from "../config/env.config.js"
import { BasePage } from "./BasePage.js";
import { expect } from "@playwright/test";

export type AccountCardName = 'Order History' | 'Addresses' | 'Payment Methods' | 'Profile';
export class MyAccountPage extends BasePage {
    readonly pagePath = 'us/en/account';
    readonly heading: Locator
    readonly pageLoadedSuccessLocator: Locator
    readonly signOutButton: Locator
    readonly overviewButton: Locator
    readonly email: Locator
    readonly ordersButton: Locator
    readonly addressButton: Locator
    readonly paymentMethodsButton: Locator
    readonly profileButton: Locator
    readonly giftCardsButton: Locator
    private readonly cardsContainer: Locator;

    constructor(page: Page) {
        super(page)
        this.signOutButton = page.getByRole('button', { name: 'Sign Out' });
        this.heading = page.getByRole('heading', { name: "Account Overview" })
        this.pageLoadedSuccessLocator = this.heading
        this.email = page.getByText(envConfig.email);
        this.cardsContainer = page.locator('div.grid');
        this.overviewButton = page.getByRole('link', { name: 'Overview' });
        this.ordersButton = page.getByRole('link', { name: 'Orders' });
        this.addressButton = page.getByRole('link', { name: 'Addresses' });
        this.paymentMethodsButton = page.getByRole('link', { name: 'Payment Methods' });
        this.profileButton = page.getByRole('link', { name: 'Profile' });
        this.giftCardsButton = page.getByRole('link', { name: 'Gift Cards' });
    }
    private getCard(name: AccountCardName): Locator {
        return this.page.getByRole('link').filter({ has: this.page.getByRole('heading', { name }) });
    }

    public async clickCard(name: AccountCardName): Promise<void> {
        await this.clickElement(this.getCard(name), `${name} card`);
    }

    public async getCardDescription(name: AccountCardName): Promise<string> {
        const card = this.getCard(name);
        return await card.locator('p').textContent() ?? '';
    }

    public async getCardCount(): Promise<number> {
        return await this.cardsContainer.locator('a').count();
    }
    public async expectAllCardsVisible(): Promise<void> {
        await expect(this.getCard('Order History')).toBeVisible();
        await expect(this.getCard('Addresses')).toBeVisible();
        await expect(this.getCard('Payment Methods')).toBeVisible();
        await expect(this.getCard('Profile')).toBeVisible();
    }

    public async expectCardVisible(name: AccountCardName): Promise<void> {
        await expect(this.getCard(name)).toBeVisible();
    }

    public async expectCardLeadsTo(name: AccountCardName, expectedPath: string): Promise<void> {
        await expect(this.getCard(name)).toHaveAttribute('href', expectedPath);
    }



}