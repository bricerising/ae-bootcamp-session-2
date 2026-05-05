const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) {
    db.close();
  }
});

const createItem = async (name = 'Test Task', due_date = null) => {
  const response = await request(app)
    .post('/api/items')
    .send({ name, due_date })
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('API Endpoints', () => {
  describe('GET /', () => {
    it('should return health check', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const item = response.body[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('completed');
      expect(item).toHaveProperty('created_at');
    });

    it('should filter active items', async () => {
      await createItem('Active Task');
      const created = await createItem('Completed Task');
      await request(app).patch(`/api/items/${created.id}/toggle`);

      const response = await request(app).get('/api/items?status=active');
      expect(response.status).toBe(200);
      response.body.forEach(item => {
        expect(item.completed).toBe(0);
      });
    });

    it('should filter completed items', async () => {
      const response = await request(app).get('/api/items?status=completed');
      expect(response.status).toBe(200);
      response.body.forEach(item => {
        expect(item.completed).toBe(1);
      });
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'New Task' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Task');
      expect(response.body.completed).toBe(0);
      expect(response.body.due_date).toBeNull();
    });

    it('should create an item with a due date', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: 'Task with date', due_date: '2025-12-31' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.due_date).toBe('2025-12-31');
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({})
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required');
    });

    it('should return 400 if name is empty', async () => {
      const response = await request(app)
        .post('/api/items')
        .send({ name: '   ' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an item', async () => {
      const item = await createItem('Original Name');

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: 'Updated Name', due_date: '2025-06-15' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.due_date).toBe('2025-06-15');
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app)
        .put('/api/items/999999')
        .send({ name: 'Does not matter' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('should return 400 if name is empty', async () => {
      const item = await createItem('To Edit');

      const response = await request(app)
        .put(`/api/items/${item.id}`)
        .send({ name: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Item name is required');
    });
  });

  describe('PATCH /api/items/:id/toggle', () => {
    it('should toggle item completion', async () => {
      const item = await createItem('Toggle Me');
      expect(item.completed).toBe(0);

      const toggleOn = await request(app).patch(`/api/items/${item.id}/toggle`);
      expect(toggleOn.status).toBe(200);
      expect(toggleOn.body.completed).toBe(1);

      const toggleOff = await request(app).patch(`/api/items/${item.id}/toggle`);
      expect(toggleOff.status).toBe(200);
      expect(toggleOff.body.completed).toBe(0);
    });

    it('should return 404 for non-existent item', async () => {
      const response = await request(app).patch('/api/items/999999/toggle');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an existing item', async () => {
      const item = await createItem('To Delete');

      const deleteResponse = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Item deleted successfully', id: item.id });

      const deleteAgain = await request(app).delete(`/api/items/${item.id}`);
      expect(deleteAgain.status).toBe(404);
    });

    it('should return 404 when item does not exist', async () => {
      const response = await request(app).delete('/api/items/999999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Item not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/items/abc');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Valid item ID is required');
    });
  });
});
