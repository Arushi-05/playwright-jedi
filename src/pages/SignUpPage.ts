import type { Locator, Page } from "@playwright/test";
import { envConfig } from "../config/env.config.js"
import { BasePage } from "./BasePage.js";
import {expect } from "@playwright/test";

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
export class SignUpPage extends BasePage {
  readonly pagePath = 'account/register';
  readonly pageLoadedSuccessLocator: Locator
  readonly createAccountButton: Locator
  readonly firstName: Locator
  readonly lastName: Locator
  readonly email: Locator
  readonly password: Locator
  readonly passwordConfirm: Locator
  readonly agreeTermsCheckBox: Locator
  readonly signInLink: Locator

  constructor(page: Page) {
    super(page)
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.pageLoadedSuccessLocator = this.createAccountButton
    this.firstName = page.locator('#firstName')
    this.lastName = page.locator('#lastName')
    this.email = page.locator('#email')
    this.password = page.locator('#password')
    this.passwordConfirm = page.locator('#passwordConfirmation')
    this.agreeTermsCheckBox = page.locator('#policy-consent')
    this.signInLink = page.getByRole('link', { name: 'Sign in' });

  }

  public async enterName(first: string, last: string): Promise<void> {
    await this.type(this.firstName, first, 'First Name');
    await this.type(this.lastName, last, 'Last Name');

  }

  public async enterPassword(password: string): Promise<void> {
    await this.type(this.password, password, 'password');
  }

  public async enterEmail(email: string): Promise<void> {
    await this.type(this.email, email, 'Email');
  }

  public async confirmPassword(password: string): Promise<void> {
    await this.type(this.passwordConfirm, password, 'confirmed password');
  }

  public async confirmTerms(): Promise<void> {
    await this.check(this.agreeTermsCheckBox);
  }

  public async clickRegister(): Promise<void> {
    await this.clickElement(this.createAccountButton, 'Create Account button');
  }
  public async expectCreateAccountEnabled(): Promise<void> {
    await expect(this.createAccountButton).toBeEnabled();
  }
  public async fillRegistrationForm(data: SignUpData): Promise<void> {
    await this.enterName(data.firstName, data.lastName);
    await this.enterEmail(data.email);
    await this.enterPassword(data.password);
    await this.confirmPassword(data.password);
    await this.confirmTerms();
  }

  public async registerNewUser(data: SignUpData): Promise<void> {
    await this.fillRegistrationForm(data);
    await this.clickRegister();
  }

}