import { test, expect } from '@playwright/test';
import { AuthenticationPage } from '../pages/authentication.page';
import { HomePage } from '../pages/home.page';
import { SpacePage } from '../pages/space.page';
import * as config from '../config.json';

test('Pencil App Test', async ({ page }) => {
  const auth = new AuthenticationPage(page);
  const home = new HomePage(page);
  const space = new SpacePage(page);

  await page.goto(config.spacesUrl);
  await auth.login(config.credentials.email, config.credentials.password);

  await home.assertNumberOfSpaces(1);
  await home.assertSpaceTitle(1, 'My First Space')
  await home.verifySidebarElements();
  await home.assertCreateSpaceButtonExists();
  await home.assertProfileIcon();

  await home.selectSpace('My First Space');

  await space.drawLine({ x: 100, y: 100 }, { x: 100, y: 150 });

  await space.moveLine({ x: 101, y: 125 }, { x: 111, y: 125 }); //there is an issue in the x axis, so i had to ad 1 pixel to select the line

  await space.addText({ x: 200, y: 150 }, 'This is a test');

  await expect.soft(page).toHaveScreenshot('space-after-modifications.png', { threshold: 0.3 });

  await space.selectAllAndDelete();

  await page.goto(config.spacesUrl);

  await home.logout();

  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); //this should be removed and fix why the logout doesn't happen properly
  await page.goto(config.baseUrl);

  await auth.verifyThatCurrentPageIsLoginPage();
});

test('Pencil App Bonus', async ({ page }) => {
  const auth = new AuthenticationPage(page);
  const home = new HomePage(page);
  const space = new SpacePage(page);

  await page.goto(config.spacesUrl);
  await auth.login(config.credentials.email, config.credentials.password);

  await home.selectSpace('My First Space');

  await space.createNewBoard();

  await space.addText({ x: 500, y: 350 }, 'test');

  await space.italicazeText({ x: 500, y: 350 });

  await expect.soft(page).toHaveScreenshot('new-board.png', { threshold: 1 });

  await space.deleteLastBoard();

  await page.waitForLoadState('networkidle');

})