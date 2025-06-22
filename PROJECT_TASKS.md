# Project Tasks

## Frontend Improvement Tasks
### Completed

- [x] **Restructure Component Organization**
  - [x] Create `/components/layout` directory for navigation and layout components
  - [x] Create `/components/features` directory for CriteriaManager, OptionsManager
  - [x] Create `/components/ui` directory for reusable UI components like EditableTitle, ThemeToggle

- [x] **Extract Custom Hooks**
  - [x] Create `useMatrix.ts` hook for matrix data fetching/updating
  - [x] Create `useCriteria.ts` hook for criteria management
  - [x] Create `useOptions.ts` hook for options management
  - [x] Create `useScores.ts` hook for score calculations

- [x] **Improve Style Organization**
  - [x] Move CSS files to `/styles` directory with component-matching names
  - [x] Consider implementing CSS modules or styled-components

- [x] **Consolidate Type Definitions**
  - [x] Resolve duplication between `src/frontend/types/decisionMatrix.ts` and `src/shared/types/matrix.types.ts`
  - [x] Define clear boundaries between frontend/backend types

### To Do
- [ ] **Implement State Management**
  - [ ] Add Context API for matrix data to reduce prop drilling
  - [ ] Consider React Query for data fetching and caching

- [ ] **Refactor Complex Components**
  - [ ] Break MatrixApp into smaller, focused components
  - [ ] Separate data loading logic from presentation

- [ ] **Standardize Naming Conventions**
  - [ ] Use consistent file extensions (.tsx for components with JSX)
  - [ ] Align component file names with export names

## Testing Tasks

- [x] **Setup Playwright Testing Environment**
  - [x] Install Playwright and necessary dependencies
  - [x] Configure Playwright for TypeScript and React
  - [x] Create test directory structure and utility files

- [ ] **Component Tests**
  - [ ] Create tests for EditableTitle component
  - [ ] Create tests for ThemeToggle component
  - [ ] Create tests for Navigation component

- [ ] **Feature Tests**
  - [ ] Test criteria creation, editing, and deletion flows
  - [ ] Test options creation, editing, and deletion flows
  - [ ] Test scoring functionality and results calculation

- [x] **Authentication Tests**
  - [x] Test login functionality with valid credentials
  - [x] Test login functionality with invalid credentials
  - [x] Test registration form validation
  - [x] Test authentication persistence
  - [ ] Test protected routes and authentication state

- [ ] **End-to-End Workflows**
  - [ ] Test complete matrix creation workflow
  - [ ] Test matrix sharing functionality
  - [ ] Test matrix results visualization

- [ ] **Accessibility Testing**
  - [ ] Verify component accessibility with Playwright's a11y tools
  - [ ] Test keyboard navigation throughout the application
  - [ ] Ensure proper screen reader support

## Dockerization Tasks (Future)

- [ ] **Setup Docker Configuration**
  - [ ] Create Dockerfile with multi-stage build (Node.js for build, Nginx for serving)
  - [ ] Create nginx.conf for SPA routing
  - [ ] Create .dockerignore file

- [ ] **Environment Configuration**
  - [ ] Set up environment variables for Supabase connection
  - [ ] Implement secure environment variable handling

- [ ] **Docker Compose Setup**
  - [ ] Create docker-compose.yml for easy deployment
  - [ ] Configure appropriate ports and volumes

- [ ] **Production Optimizations**
  - [ ] Minimize final image size
  - [ ] Implement caching strategies for builds
  - [ ] Configure Nginx for performance