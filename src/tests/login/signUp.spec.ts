
import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger.js';
import { DataGenerator } from '../../utils/data-generator.js';
import { SignUpPage } from '../../pages/SignUpPage.js';
import { MyAccountPage } from '../../pages/MyAccountPage.js';
test.describe('Sign Up Flow @smoke', () => {

  test('user can register a new account successfully', async ({ page }) => {

    const signUpPage = new SignUpPage(page);
    const profilePage = new MyAccountPage(page)
    //const timestamp = Date.now();
    const userData = DataGenerator.randomUser();

    await signUpPage.goTo();
    await expect(page).toHaveURL(/account\/register/);
    await signUpPage.registerNewUser(userData);
    logger.info(`Navigating to: ${profilePage.pagePath}`);
    await expect(page).toHaveURL(profilePage.pagePath);
    await profilePage.waitForPageLoad();
    await profilePage.expectAllCardsVisible();

    await expect(page.getByText('Account Overview')).toBeVisible()
    await expect(page.getByText(`${userData.firstName} ${userData.lastName}`)).toBeVisible();

  });
});