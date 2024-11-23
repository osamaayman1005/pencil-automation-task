import { expect, Page } from "@playwright/test";

export class HomePage {
    constructor(private page: Page) { }

    private readonly goToSpaceButton = (spaceName: string) => this.page.locator('tr').filter({ hasText: spaceName }).locator('button');
    private readonly profileIcon = () => this.page.locator('#btn-home-avatar-menu').first();
    private readonly signoutButton = () => this.page.getByRole('button', { name: 'Sign-out' });
    private readonly confirmLogoutButton = () => this.page.getByRole('button', { name: 'Logout', exact: true });
    private readonly spaces = () => this.page.locator('table.spaces-list-table tbody tr.space-row');
    private readonly createSpaceButton = () => this.page.getByRole('button', { name: 'Create Space' });
    private readonly sidebarItem = (title: string) => this.page.locator(`.main-navbar-item_title`, { hasText: title });

    async selectSpace(spaceName: string) {
        await this.goToSpaceButton(spaceName).click();
    }

    async logout() {
        await this.profileIcon().click();
        await this.signoutButton().click();
        await this.confirmLogoutButton().click();
    }

    async assertNumberOfSpaces(numberOfSpaces: number) {
        await expect.soft(this.spaces()).toHaveCount(numberOfSpaces);
    }
    async assertSpaceTitle(spaceNumber: number, spaceTitle: string) {
        await expect.soft(this.spaces().nth(spaceNumber - 1)).toContainText(spaceTitle); //since nth is zero ordered.
    }

    async assertCreateSpaceButtonExists() {
        await expect.soft(this.createSpaceButton()).toBeVisible();
    }

    async assertProfileIcon() {
        await expect.soft(this.profileIcon()).toBeVisible();
    }

    async verifySidebarElements() {
        // Assert "Home" exists
        await expect(this.sidebarItem('Home')).toBeVisible();
        // Assert "Schedule" exists
        await expect(this.sidebarItem('Schedule')).toBeVisible();
      }

}
