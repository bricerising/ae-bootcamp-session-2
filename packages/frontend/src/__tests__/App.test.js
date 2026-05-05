import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

const mockItems = [
  { id: 1, name: 'Task 1', completed: 0, due_date: '2025-12-01', created_at: '2025-01-01' },
  { id: 2, name: 'Task 2', completed: 1, due_date: null, created_at: '2025-01-02' },
];

const server = setupServer(
  rest.get('/api/items', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    let items = [...mockItems];
    if (status === 'active') {
      items = items.filter(i => i.completed === 0);
    } else if (status === 'completed') {
      items = items.filter(i => i.completed === 1);
    }
    return res(ctx.status(200), ctx.json(items));
  }),

  rest.post('/api/items', async (req, res, ctx) => {
    const { name, due_date } = req.body;
    if (!name || name.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Item name is required' }));
    }
    return res(ctx.status(201), ctx.json({
      id: 3, name, completed: 0, due_date: due_date || null, created_at: new Date().toISOString()
    }));
  }),

  rest.patch('/api/items/:id/toggle', (req, res, ctx) => {
    const id = parseInt(req.params.id);
    const item = mockItems.find(i => i.id === id);
    if (!item) return res(ctx.status(404), ctx.json({ error: 'Item not found' }));
    return res(ctx.status(200), ctx.json({ ...item, completed: item.completed ? 0 : 1 }));
  }),

  rest.delete('/api/items/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Item deleted successfully', id: parseInt(req.params.id) }));
  }),

  rest.put('/api/items/:id', async (req, res, ctx) => {
    const { name, due_date } = req.body;
    return res(ctx.status(200), ctx.json({
      id: parseInt(req.params.id), name, completed: 0, due_date, created_at: '2025-01-01'
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the header', async () => {
    await act(async () => { render(<App />); });
    expect(screen.getByText('To Do App')).toBeInTheDocument();
    expect(screen.getByText('Keep track of your tasks')).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    await act(async () => { render(<App />); });

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('displays due date for tasks that have one', async () => {
    await act(async () => { render(<App />); });

    await waitFor(() => {
      expect(screen.getByText('2025-12-01')).toBeInTheDocument();
    });
  });

  test('adds a new task', async () => {
    const user = userEvent.setup();
    await act(async () => { render(<App />); });

    await waitFor(() => {
      expect(screen.queryByText('Loading data...')).not.toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Enter task title');
    await act(async () => { await user.type(input, 'New Task'); });

    const submitButton = screen.getByText('Add Task');
    await act(async () => { await user.click(submitButton); });

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  test('shows filter buttons', async () => {
    await act(async () => { render(<App />); });

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  test('handles API error', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    await act(async () => { render(<App />); });

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch data/)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    server.use(
      rest.get('/api/items', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    await act(async () => { render(<App />); });

    await waitFor(() => {
      expect(screen.getByText('No tasks found. Add some!')).toBeInTheDocument();
    });
  });

  test('shows completed task with strikethrough class', async () => {
    await act(async () => { render(<App />); });

    await waitFor(() => {
      const task2 = screen.getByText('Task 2');
      expect(task2).toHaveClass('strikethrough');
    });
  });
});
