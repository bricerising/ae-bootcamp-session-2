import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await fetch(`/api/items${params}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setTasks(result);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTitle,
          due_date: newDueDate || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      setNewTitle('');
      setNewDueDate('');
      await fetchTasks();
    } catch (err) {
      setError('Error adding task: ' + err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}/toggle`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to toggle task');
      }

      await fetchTasks();
    } catch (err) {
      setError('Error toggling task: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      await fetchTasks();
    } catch (err) {
      setError('Error deleting task: ' + err.message);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.name);
    setEditDueDate(task.due_date || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDueDate('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editTitle,
          due_date: editDueDate || null
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setEditingId(null);
      setEditTitle('');
      setEditDueDate('');
      await fetchTasks();
    } catch (err) {
      setError('Error updating task: ' + err.message);
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date(new Date().toDateString());
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>To Do App</h1>
        <p>Keep track of your tasks</p>
      </header>

      <main>
        <section className="add-item-section">
          <h2>Add New Task</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter task title"
              aria-label="Task title"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              aria-label="Due date"
            />
            <button type="submit">Add Task</button>
          </form>
        </section>

        <section className="filter-section">
          <h2>Filter</h2>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </section>

        <section className="items-section">
          <h2>Tasks</h2>
          {loading && <p>Loading data...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && (
            <ul>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <li key={task.id} className={task.completed ? 'completed' : ''}>
                    {editingId === task.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          aria-label="Edit task title"
                        />
                        <input
                          type="date"
                          value={editDueDate}
                          onChange={(e) => setEditDueDate(e.target.value)}
                          aria-label="Edit due date"
                        />
                        <button onClick={() => handleSaveEdit(task.id)} className="save-btn">Save</button>
                        <button onClick={cancelEditing} className="cancel-btn">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <div className="task-content">
                          <input
                            type="checkbox"
                            checked={!!task.completed}
                            onChange={() => handleToggle(task.id)}
                            aria-label={`Mark "${task.name}" as ${task.completed ? 'incomplete' : 'complete'}`}
                          />
                          <span className={`task-name ${task.completed ? 'strikethrough' : ''}`}>
                            {task.name}
                          </span>
                          {task.due_date && (
                            <span className={`due-date ${isOverdue(task.due_date) && !task.completed ? 'overdue' : ''}`}>
                              {task.due_date}
                            </span>
                          )}
                        </div>
                        <div className="task-actions">
                          <button onClick={() => startEditing(task)} className="edit-btn">Edit</button>
                          <button onClick={() => handleDelete(task.id)} className="delete-btn">Delete</button>
                        </div>
                      </>
                    )}
                  </li>
                ))
              ) : (
                <p>No tasks found. Add some!</p>
              )}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
