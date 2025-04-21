# Project Tasks

## Frontend Improvement Tasks

- [ ] **Restructure Component Organization**
  - [ ] Create `/components/layout` directory for navigation and layout components
  - [ ] Create `/components/features` directory for CriteriaManager, OptionsManager
  - [ ] Create `/components/ui` directory for reusable UI components like EditableTitle, ThemeToggle

- [ ] **Extract Custom Hooks**
  - [ ] Create `useMatrix.ts` hook for matrix data fetching/updating
  - [ ] Create `useCriteria.ts` hook for criteria management
  - [ ] Create `useOptions.ts` hook for options management
  - [ ] Create `useScores.ts` hook for score calculations

- [ ] **Improve Style Organization**
  - [ ] Move CSS files to `/styles` directory with component-matching names
  - [ ] Consider implementing CSS modules or styled-components

- [ ] **Consolidate Type Definitions**
  - [ ] Resolve duplication between `src/frontend/types/decisionMatrix.ts` and `src/shared/types/matrix.types.ts`
  - [ ] Define clear boundaries between frontend/backend types

- [ ] **Implement State Management**
  - [ ] Add Context API for matrix data to reduce prop drilling
  - [ ] Consider React Query for data fetching and caching

- [ ] **Refactor Complex Components**
  - [ ] Break MatrixApp into smaller, focused components
  - [ ] Separate data loading logic from presentation

- [ ] **Standardize Naming Conventions**
  - [ ] Use consistent file extensions (.tsx for components with JSX)
  - [ ] Align component file names with export names

## Dockerization Tasks

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