# Frontend Development Guide

## Component Structure

Components are organized into three categories:

1. **Feature Components**: Implement specific application features
   - CriteriaManager.tsx - Manages criteria creation and weighting
   - OptionsManager.tsx - Manages options and scoring against criteria
   - Results.tsx - Displays comparison results

2. **Layout Components**: Control application structure
   - Navigation.tsx - Main navigation component

3. **UI Components**: Reusable interface elements
   - EditableTitle.tsx - Editable text component
   - ThemeToggle.tsx - Theme switching component

## State Management

State is managed through custom React hooks:

- **useMatrix**: Matrix data management
- **useCriteria**: Criteria operations
- **useOptions**: Options and scoring
- **useScores**: Score calculation and analysis

## Routing

Routing uses React Router with the following main routes:

- `/` - Home/landing page
- `/auth` - Authentication page
- `/matrices` - List of user matrices
- `/matrix/:id` - Individual matrix with its criteria, options, and results

## Styling

Styles follow a component-scoped approach with matching CSS files for each component. Global styles are in `src/frontend/styles/global.css`.

## Component Development Guidelines

- Keep components focused and under 200 lines
- Use functional components with hooks
- Follow naming conventions (PascalCase for components)
- Implement proper prop typing with TypeScript
- Handle loading, error, and empty states appropriately