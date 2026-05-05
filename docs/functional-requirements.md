# Functional Requirements

## Core TODO App Features

### Task Management

1. **Add a Task** - Users can create a new task with a title and an optional due date.
2. **Edit a Task** - Users can edit the title and due date of an existing task.
3. **Delete a Task** - Users can delete a task permanently.
4. **Mark as Complete** - Users can toggle a task between complete and incomplete states.

### Due Dates

5. **Set Due Date** - Users can assign a due date when creating or editing a task.
6. **Visual Overdue Indicator** - Tasks past their due date are visually highlighted as overdue.

### Sorting and Filtering

7. **Sort by Due Date** - Tasks are sorted by due date (earliest first), with tasks that have no due date appearing last.
8. **Filter by Status** - Users can filter the task list to show all tasks, only active tasks, or only completed tasks.

### Persistence

9. **Server-Side Storage** - All tasks are stored in the backend database and persist across page refreshes.

### Validation

10. **Title Required** - A task cannot be created or saved without a non-empty title.
11. **Duplicate Prevention** - The UI should prevent submission of empty or whitespace-only titles.
