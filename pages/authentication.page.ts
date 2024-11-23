import { expect, Page } from "@playwright/test";

export class AuthenticationPage {
    constructor(private page: Page) {}

    private readonly continueWithEmailButton = () => this.page.getByRole('button', { name: 'Continue with Email' });
    private readonly emailField = () => this.page.locator('#email-value');
    private readonly continueButton = () => this.page.getByRole('button', { name: 'Continue', exact: true });
    private readonly passwordField = () => this.page.locator('#password-value');

    async login(email: string, password: string) {
      await this.continueWithEmailButton().click();
      await this.emailField().fill(email);
      await this.continueButton().click();
      await this.passwordField().fill(password);
      await this.continueButton().click();
    }
    async verifyThatCurrentPageIsLoginPage(){
        await expect.soft(this.continueWithEmailButton()).toBeVisible();
    }
  }
  