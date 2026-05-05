const request = require('supertest');
const { app, db } = require('../../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('TODO API Integration', () => {
  let taskId;

  it('should create a task with a due date', async () => {
    const response = await request(app)
      .post('/api/items')
      .send({ name: 'Integration Task', due_date: '2025-12-25' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Integration Task');
    expect(response.body.due_date).toBe('2025-12-25');
    expect(response.body.completed).toBe(0);
    taskId = response.body.id;
  });

  it('should retrieve the created task in the list', async () => {
    const response = await request(app).get('/api/items');

    expect(response.status).toBe(200);
    const task = response.body.find(item => item.id === taskId);
    expect(task).toBeDefined();
    expect(task.name).toBe('Integration Task');
  });

  it('should edit the task title and due date', async () => {
    const response = await request(app)
      .put(`/api/items/${taskId}`)
      .send({ name: 'Updated Integration Task', due_date: '2025-12-31' });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Integration Task');
    expect(response.body.due_date).toBe('2025-12-31');
  });

  it('should toggle task to completed', async () => {
    const response = await request(app).patch(`/api/items/${taskId}/toggle`);

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(1);
  });

  it('should appear in completed filter', async () => {
    const response = await request(app).get('/api/items?status=completed');

    expect(response.status).toBe(200);
    const task = response.body.find(item => item.id === taskId);
    expect(task).toBeDefined();
    expect(task.completed).toBe(1);
  });

  it('should not appear in active filter when completed', async () => {
    const response = await request(app).get('/api/items?status=active');

    expect(response.status).toBe(200);
    const task = response.body.find(item => item.id === taskId);
    expect(task).toBeUndefined();
  });

  it('should toggle task back to active', async () => {
    const response = await request(app).patch(`/api/items/${taskId}/toggle`);

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(0);
  });

  it('should delete the task', async () => {
    const response = await request(app).delete(`/api/items/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Item deleted successfully');

    const getResponse = await request(app).get('/api/items');
    const task = getResponse.body.find(item => item.id === taskId);
    expect(task).toBeUndefined();
  });

  it('should sort tasks with due dates before tasks without', async () => {
    const withDate = await request(app)
      .post('/api/items')
      .send({ name: 'Has Date', due_date: '2025-01-01' });

    const withoutDate = await request(app)
      .post('/api/items')
      .send({ name: 'No Date' });

    const response = await request(app).get('/api/items');
    const ids = response.body.map(item => item.id);
    const withDateIndex = ids.indexOf(withDate.body.id);
    const withoutDateIndex = ids.indexOf(withoutDate.body.id);

    expect(withDateIndex).toBeLessThan(withoutDateIndex);
  });
});
