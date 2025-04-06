# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- `npm run dev` - Run development server
- `npm run build` - Build for production (tsc compile + vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript compiler in noEmit mode

## Code Style Guidelines
- TypeScript with strict mode; use explicit types and interfaces for data structures
- React components in PascalCase (e.g., MatrixApp); services/utilities in camelCase
- Frontend/backend separation with shared types in src/shared/types/
- Use named exports over default exports
- No unused locals/parameters allowed (noUnusedLocals: true)
- Proper error handling with try/catch blocks and detailed error messages
- Import order: React imports first, then external libs, then local modules
- Use functional components with hooks; follow React hooks rules (useEffect dependencies)
- Prefer TypeScript interfaces for API/data types and explicit return types
- UI components use Bootstrap and Heroicons (^2.2.0)
- Organize Supabase queries with proper error handling and type checking