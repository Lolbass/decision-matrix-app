# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build` (TypeScript compile + Vite build)
- Dev: `npm run dev` (Vite dev server)
- Lint: `npm run lint` (ESLint)
- TypeCheck: `tsc -b` (TypeScript type check)
- Preview: `npm run preview` (Preview production build)

## Code Guidelines
- Apply SOLID principles in all code
- Use TypeScript with strict type checking
- React components use functional style with hooks (no class components)
- Import order: React/libraries → local modules → types/utils
- Error handling: use try/catch with specific error types
- Services should throw errors (not return them)
- Prefer async/await over Promise chains
- Use record types for key-value pairs (e.g., Record<string, ScoringScale>)
- Follow existing naming: PascalCase for components, camelCase for functions/variables
- Keep components focused and composable
- Use relative imports within modules, absolute for cross-module references
- Format code using consistent indentation (2 spaces) and semicolons
- Use Supabase for backend services and database operations
- Maintain clear separation between frontend and backend code