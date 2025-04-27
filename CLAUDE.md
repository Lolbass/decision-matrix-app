# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build` (TypeScript compile + Vite build)
- Dev: `npm run dev` (Vite dev server with HMR)
- Lint: `npm run lint` (ESLint)
- TypeCheck: `tsc -b` (TypeScript type check)
- Preview: `npm run preview` (Preview production build)

## Code Guidelines
- Apply SOLID principles in all code
- Use TypeScript with strict type checking
- React components use functional style with hooks (no class components)
- Import order: React/libraries → local modules → types/utils → CSS
- Error handling: use try/catch with specific error types; log errors appropriately
- Services should throw errors (not return them) for consistent error handling
- Prefer async/await over Promise chains
- Use Record<K,V> types for key-value pairs (e.g., Record<string, ScoringScale>)
- Naming: PascalCase for components/types, camelCase for functions/variables
- Keep components focused, composable and under 200 lines
- Use relative imports within modules, absolute paths for cross-module references
- Format: 2-space indentation, semicolons, max 100 char line length
- Use Supabase for backend services and database operations
- Maintain clear separation between frontend (/src/frontend) and backend (/src/backend) code
- CSS: Use component-scoped CSS files with matching names (Component.tsx, Component.css)
- Use React Router for navigation between pages