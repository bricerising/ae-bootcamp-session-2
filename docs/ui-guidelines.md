# UI Guidelines

## Design Principles

- Keep the interface simple, clean, and focused on task management.
- Use Material-inspired design: consistent spacing, elevation via box-shadows, and rounded corners.
- Ensure the app is responsive and usable on both desktop and mobile viewports.

## Color Palette

| Role        | Color     | Usage                        |
|-------------|-----------|------------------------------|
| Primary     | `#1976d2` | Buttons, active states       |
| Secondary   | `#9c27b0` | Accents, filters             |
| Danger      | `#d32f2f` | Delete actions, overdue      |
| Success     | `#388e3c` | Completed tasks              |
| Background  | `#fafafa` | Page background              |
| Surface     | `#ffffff` | Cards and sections           |
| Text        | `#212121` | Primary text                 |
| Text Light  | `#757575` | Secondary/helper text        |

## Typography

- Use the system font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
- Headings: bold, appropriately sized (h1 for app title, h2 for section titles).
- Body text: 16px base size for readability.

## Components

### Buttons

- Primary actions (Add, Save): filled with the primary color, white text.
- Destructive actions (Delete): filled with danger color, white text.
- Filter buttons: outlined style, filled when active.

### Input Fields

- Full-width within their container.
- Clear placeholder text describing expected input.
- Visible focus state with primary color border.

### Task List Items

- Each task displayed as a card-like row with clear separation.
- Completed tasks show a strikethrough on the title and muted text color.
- Overdue tasks display the due date in the danger color.

## Accessibility

- All interactive elements must be keyboard accessible.
- Use semantic HTML elements (button, input, form, main, header).
- Color is not the sole indicator of state; include text labels or icons alongside color changes.
- Minimum contrast ratio of 4.5:1 for text.

## Layout

- Single-column layout, centered with a max-width of 800px.
- Consistent padding and spacing (multiples of 8px).
- Clear visual hierarchy: header, input area, filter controls, task list.
