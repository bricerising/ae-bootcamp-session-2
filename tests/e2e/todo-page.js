class TodoPage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('http://localhost:3000');
    await this.page.waitForSelector('.items-section');
  }

  async addTask(title, dueDate = '') {
    await this.page.fill('input[aria-label="Task title"]', title);
    if (dueDate) {
      await this.page.fill('input[aria-label="Due date"]', dueDate);
    }
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(300);
  }

  async toggleTask(title) {
    const taskRow = this.page.locator('li', { has: this.page.locator(`text="${title}"`) });
    await taskRow.locator('input[type="checkbox"]').click();
    await this.page.waitForTimeout(300);
  }

  async deleteTask(title) {
    const taskRow = this.page.locator('li', { has: this.page.locator(`text="${title}"`) });
    await taskRow.locator('.delete-btn').click();
    await this.page.waitForTimeout(300);
  }

  async editTask(title, newTitle, newDueDate = '') {
    const taskRow = this.page.locator('li', { has: this.page.locator(`text="${title}"`) });
    await taskRow.locator('.edit-btn').click();
    await this.page.fill('input[aria-label="Edit task title"]', newTitle);
    if (newDueDate) {
      await this.page.fill('input[aria-label="Edit due date"]', newDueDate);
    }
    await this.page.click('.save-btn');
    await this.page.waitForTimeout(300);
  }

  async filterBy(status) {
    await this.page.click(`.filter-btn:text("${status}")`);
    await this.page.waitForTimeout(300);
  }

  async getTaskNames() {
    return this.page.locator('.task-name').allTextContents();
  }

  async isTaskVisible(title) {
    return this.page.locator(`.task-name:text("${title}")`).isVisible();
  }

  async isTaskCompleted(title) {
    const taskRow = this.page.locator('li', { has: this.page.locator(`text="${title}"`) });
    return taskRow.evaluate(el => el.classList.contains('completed'));
  }

  async getErrorMessage() {
    const error = this.page.locator('.error');
    if (await error.isVisible()) {
      return error.textContent();
    }
    return null;
  }
}

module.exports = { TodoPage };
