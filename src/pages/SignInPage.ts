import type { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { expect } from "@playwright/test";

export interface LoginData {
    email: string;
    password: string;
}
export class SignInPage extends BasePage {
    readonly pagePath = 'account';
    readonly pageLoadedSuccessLocator: Locator
    readonly signInButton: Locator
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly email: Locator
    readonly password: Locator
    readonly signUpLink: Locator
    readonly forgotPasswordButton: Locator
    readonly cardDescription: Locator
    readonly card: Locator
    readonly cardTitle: Locator


    constructor(page: Page) {
        super(page)
        this.emailInput = page.locator('label[for="email"]');
        this.passwordInput = page.locator('label[for="password"]');
        this.signInButton = page.getByRole('button', { name: 'Sign In' });
        this.pageLoadedSuccessLocator = this.signInButton
        this.email = page.locator('#email')
        this.password = page.locator('#password')
        this.forgotPasswordButton = page.getByRole('link', { name: 'Forgot password?' });
        this.signUpLink = page.getByRole('link', { name: 'Sign up' });
        this.card = page.locator('[data-slot="card"]')
        this.cardTitle = page.locator('[data-slot="card-title"]', { hasText: 'My Account' })
        this.cardDescription = page.locator('[data-slot="card-description"]', { hasText: 'Sign in to access your account and order history.' });
    }


    public async enterPassword(password: string): Promise<void> {
        await this.type(this.password, password, 'password');
    }

    public async enterEmail(email: string): Promise<void> {
        await this.type(this.email, email, 'Email');
    }

    public async submit(): Promise<void> {
        await this.clickElement(this.signInButton, 'Sign In button');
    }

    public async signIn(data: LoginData): Promise<void> {
        await this.enterEmail(data.email);
        await this.enterPassword(data.password);
        await this.submit();
    }

    public async expectPageLoaded(): Promise<void> {
        await expect(this.signInButton).toBeVisible();
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
    }

    public async expectStillOnLogInPage(): Promise<void> {
        await expect(this.page).toHaveURL('/us/en/account');
        await expect(this.signInButton).toBeVisible();
    }



}