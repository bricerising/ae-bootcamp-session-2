# Coding Guidelines

## General Formatting

- Use 2-space indentation for JavaScript and JSON files.
- Use single quotes for strings.
- Always include trailing semicolons.
- Keep lines under 100 characters where practical.
- End files with a single newline.

## Import Organization

Organize imports in the following order, separated by a blank line between groups:

1. Node built-in modules (e.g., `path`, `fs`)
2. External packages (e.g., `express`, `react`)
3. Internal modules (relative paths)

## Naming Conventions

- **Variables and functions**: camelCase
- **React components**: PascalCase
- **Constants**: UPPER_SNAKE_CASE for true constants; camelCase for derived values
- **Files**: kebab-case for utilities, PascalCase for React components

## Code Quality Principles

- **DRY (Don't Repeat Yourself)**: Extract repeated logic into shared functions or components.
- **Single Responsibility**: Each function or component should do one thing well.
- **Keep functions short**: Aim for functions that fit on one screen (~30 lines).
- **Prefer clarity over cleverness**: Code is read far more often than written.

## Error Handling

- Always handle errors at API boundaries (routes, fetch calls).
- Return meaningful HTTP status codes and error messages from the backend.
- Display user-friendly error messages in the frontend.

## Linting

- Use ESLint with the project's existing configuration.
- Fix all linting warnings before committing.
- Prefer auto-fixable rules to minimize friction.

## Version Control

- Write clear, concise commit messages.
- Keep commits focused on a single logical change.
- Do not commit commented-out code or debug statements.
