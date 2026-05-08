import { test, expect } from '@playwright/test';
import { SignInPage } from '../../pages/SignInPage.js';
import { DataGenerator } from '../../utils/data-generator.js';

test.describe('Sign In Page Validation @regression', () => {
    test.beforeEach(async ({ page }) => {
        const signInPage = new SignInPage(page);
        await signInPage.goTo();
        await signInPage.expectPageLoaded();
    });

    test.describe('Empty field validation', () => {

        test('cannot submit with both fields empty', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.submit();
            await signInPage.expectStillOnLogInPage();
        });

        test('cannot submit with only email filled (password empty)', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.enterEmail('test@example.com');
            await signInPage.submit();
            await signInPage.expectStillOnLogInPage();
        });

        test('cannot submit with only password filled (email empty)', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.enterPassword('SomePassword123');
            await signInPage.submit();
            await signInPage.expectStillOnLogInPage();
        });
    });


    test.describe('Email format validation', () => {

        const invalidEmails = [
            { value: 'plainaddress', description: 'no @ symbol' },
            { value: 'missing@domain', description: 'no TLD' },
            { value: '@example.com', description: 'no local part' },
            { value: 'user@', description: 'no domain' },
            { value: 'user @example.com', description: 'space in email' },
            { value: 'user@ex ample.com', description: 'space in domain' },
        ];

        for (const { value, description } of invalidEmails) {
            test(`rejects invalid email: ${description} ("${value}")`, async ({ page }) => {
                const signInPage = new SignInPage(page);
                await signInPage.enterEmail(value);
                await signInPage.enterPassword('AnyPassword123');
                await signInPage.submit();
                await signInPage.expectStillOnLogInPage();
            });
        }
    });


    test.describe('Authentication validation', () => {

        test('rejects non-existent user with appropriate error', async ({ page }) => {
            const signInPage = new SignInPage(page);
            const credentials = {
                email: DataGenerator.randomEmail(),
                password: 'SomeValidPassword123!',
            };

            await signInPage.signIn(credentials);
            await signInPage.expectStillOnLogInPage();

        });

        test('rejects wrong password for existing user', async ({ page }) => {

            const signInPage = new SignInPage(page);
            await signInPage.signIn({
                email: 'spree@example.com',
                password: 'DefinitelyWrongPassword!',
            });

            await signInPage.expectStillOnLogInPage();
        });

        test('does NOT reveal whether email exists in error message', async ({ page }) => {
            const signInPage = new SignInPage(page);


            await signInPage.signIn({
                email: DataGenerator.randomEmail(),
                password: 'wrong',
            });

            const errorText = await page.locator('[role="alert"], .flash').first().textContent();
            expect(errorText?.toLowerCase()).not.toMatch(/not found|doesn['']?t exist|no user/);
        });
    });

    test.describe('Security validation', () => {

        test('handles SQL injection attempt safely', async ({ page }) => {
            const signInPage = new SignInPage(page);

            await signInPage.signIn({
                email: "admin'--",
                password: "' OR '1'='1",
            });
    
            await signInPage.expectStillOnLogInPage();
        });

        test('handles XSS attempt in email field safely', async ({ page }) => {
            const signInPage = new SignInPage(page);

            const xssPayload = '<script>alert("xss")</script>@example.com';
            await signInPage.enterEmail(xssPayload);
            await signInPage.enterPassword('any');
            await signInPage.submit();
            page.on('dialog', () => {
                throw new Error('SECURITY ISSUE: XSS payload triggered an alert!');
            });

            await signInPage.expectStillOnLogInPage();
        });
    });

    test.describe('Navigation links', () => {

        test('"Forgot password" link navigates to recovery page', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.forgotPasswordButton.click();

            await expect(page).toHaveURL(/forgot|recover|password/i);
        });

        test('"Sign up" link navigates to registration page', async ({ page }) => {
            const signInPage = new SignInPage(page);
            await signInPage.signUpLink.click();

            await expect(page).toHaveURL(/register|sign[-_]?up/i);
        });
    });


    test.describe('UI behavior', () => {

        test('email field is required', async ({ page }) => {
            const emailField = page.getByLabel('Email');
            const isRequired = await emailField.getAttribute('required');
            const ariaRequired = await emailField.getAttribute('aria-required');

            expect(isRequired !== null || ariaRequired === 'true').toBe(true);
        });


        test('sign-in button is enabled by default', async ({ page }) => {
            const signInButton = page.getByRole('button', { name: /sign in|log in/i });
            await expect(signInButton).toBeEnabled();
        });
    });

    test.describe('Boundary inputs', () => {

        test('handles very long email gracefully', async ({ page }) => {
            const signInPage = new SignInPage(page);
            const longEmail = `${'a'.repeat(200)}@example.com`;

            await signInPage.signIn({
                email: longEmail,
                password: 'SomePassword123',
            });

        
            await signInPage.expectStillOnLogInPage();
        });

        test('handles very long password gracefully', async ({ page }) => {
            const signInPage = new SignInPage(page);

            await signInPage.signIn({
                email: 'test@example.com',
                password: 'p'.repeat(500),
            });

            await signInPage.expectStillOnLogInPage();
        });

        test('preserves email value on failed login', async ({ page }) => {
            const signInPage = new SignInPage(page);
            const email = 'preserve@example.com';

            await signInPage.signIn({
                email,
                password: 'WrongPassword',
            });

            await expect(page.getByLabel('Email')).toHaveValue(email);
            await expect(page.getByLabel('Password', { exact: true })).toHaveValue('WrongPassword');
        });
    });
});