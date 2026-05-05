const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./todo-page');

test.describe('TODO App Workflow', () => {
  let todoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.goto();
  });

  test('should display the app header and initial tasks', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('To Do App');
    const tasks = await todoPage.getTaskNames();
    expect(tasks.length).toBeGreaterThan(0);
  });

  test('should add a new task', async ({ page }) => {
    await todoPage.addTask('E2E Test Task');
    await expect(page.locator(`.task-name:text("E2E Test Task")`)).toBeVisible();
  });

  test('should add a task with a due date', async ({ page }) => {
    await todoPage.addTask('Task With Date', '2025-12-25');
    await expect(page.locator(`.task-name:text("Task With Date")`)).toBeVisible();
    await expect(page.locator('text=2025-12-25')).toBeVisible();
  });

  test('should mark a task as complete and incomplete', async ({ page }) => {
    await todoPage.addTask('Toggle Task');
    await todoPage.toggleTask('Toggle Task');

    const taskRow = page.locator('li', { has: page.locator('text="Toggle Task"') });
    await expect(taskRow).toHaveClass(/completed/);

    await todoPage.toggleTask('Toggle Task');
    await expect(taskRow).not.toHaveClass(/completed/);
  });

  test('should edit an existing task', async ({ page }) => {
    await todoPage.addTask('Task To Edit');
    await todoPage.editTask('Task To Edit', 'Edited Task Name');
    await expect(page.locator(`.task-name:text("Edited Task Name")`)).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    await todoPage.addTask('Task To Delete');
    await expect(page.locator(`.task-name:text("Task To Delete")`)).toBeVisible();

    await todoPage.deleteTask('Task To Delete');
    await expect(page.locator(`.task-name:text("Task To Delete")`)).not.toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    await todoPage.addTask('Filter Active Task');
    await todoPage.addTask('Filter Completed Task');
    await todoPage.toggleTask('Filter Completed Task');

    await todoPage.filterBy('Active');
    await expect(page.locator(`.task-name:text("Filter Active Task")`)).toBeVisible();
    await expect(page.locator(`.task-name:text("Filter Completed Task")`)).not.toBeVisible();

    await todoPage.filterBy('Completed');
    await expect(page.locator(`.task-name:text("Filter Completed Task")`)).toBeVisible();
    await expect(page.locator(`.task-name:text("Filter Active Task")`)).not.toBeVisible();

    await todoPage.filterBy('All');
    await expect(page.locator(`.task-name:text("Filter Active Task")`)).toBeVisible();
    await expect(page.locator(`.task-name:text("Filter Completed Task")`)).toBeVisible();
  });

  test('should not add a task with empty title', async ({ page }) => {
    const tasksBefore = await todoPage.getTaskNames();
    await page.click('button[type="submit"]');
    await page.waitForTimeout(300);
    const tasksAfter = await todoPage.getTaskNames();
    expect(tasksAfter.length).toBe(tasksBefore.length);
  });
});
