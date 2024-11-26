import { Page } from "@playwright/test";

export class SpacePage {
    constructor(private page: Page) {}

    private readonly canvas = () => this.page.locator('canvas.fabric-canvas').last();
    private readonly shapesButton = () => this.page.getByRole('button', { name: 'Shapes' });
    private readonly selectButton = () => this.page.getByRole('button', { name: 'select' });
    private readonly textButton = () => this.page.getByRole('button', { name: 'Text' });
    private readonly lineShape = () => this.page.locator('[data-name="space-toolbar-button-object-line"]');
    private readonly boardsButton = () => this.page.getByRole('button', { name: 'Boards' });
    private readonly newBoardButton = () => this.page.getByRole('button', { name: 'New' });
    private readonly lastBoard = () => this.page.locator('.board-box').last();
    private readonly textItalicFormat = () => this.page.locator('[data-name="space-toolbar-button-object-null"]').nth(1);

      async drawLine(start: { x: number; y: number }, end: { x: number; y: number }) {
        await this.shapesButton().click();
        await this.lineShape().click();
        await this.performMouseAction(start, end);
      }
    
      // Move line using the helper method
      async moveLine(from: { x: number; y: number }, to: { x: number; y: number }) {
        await this.selectButton().click();
        await this.performMouseAction(from, to); 
      }
  
    async addText(position: { x: number; y: number }, text: string) {
      await this.textButton().click();
      await this.canvas().click({ position });
      await this.page.keyboard.type(text);
      await this.canvas().click({ position: {x:position.x+100, y:position.y+100} });
      await this.page.waitForTimeout(1000); //to make sure that the text is saved

      
    }
    async selectAllAndDelete() {
      const boundingBox = await this.canvas().boundingBox();
      const canvasWidth = boundingBox?.width || 1000;
      const canvasHeight = boundingBox?.height || 1000;
      await this.selectButton().click();

      const start = { x: 0, y: 0 }; 
      const end = { x: canvasWidth, y: canvasHeight }; 
    
      await this.performMouseAction(start, end);
    
      await this.page.keyboard.press('Delete');
      await this.page.waitForTimeout(2000); 
    }
    async createNewBoard() {
      await this.boardsButton().click();
      await this.newBoardButton().click();
      await this.lastBoard().click();
    }
    async italicazeText(position: { x: number; y: number }) {
      await this.selectButton().click();
      await this.canvas().click({ position });
      await this.textItalicFormat().click();
      await this.canvas().click({ position: {x:position.x+100, y:position.y+100} });
    }
    async deleteLastBoard(){
      await this.lastBoard().hover();
      await this.lastBoard().locator('.more-icon').click();
      await this.page.getByRole('button', { name: 'Delete', exact: true }).click();
      await this.page.getByRole('button', { name: 'Delete board' }).click();
    }
    
    private async performMouseAction(start: { x: number; y: number }, end: { x: number; y: number }) {
        await this.canvas().dispatchEvent('mousedown', { bubbles: true, cancelable: true, clientX: start.x, clientY: start.y });
        await this.canvas().dispatchEvent('mousemove', { bubbles: true, cancelable: true, clientX: end.x, clientY: end.y });
        await this.canvas().dispatchEvent('mouseup', { bubbles: true, cancelable: true, clientX: end.x, clientY: end.y });
      }
    
  }
  