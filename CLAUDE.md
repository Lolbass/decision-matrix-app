# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- `npm run dev` - Run development server
- `npm run build` - Build for production (tsc compile + vite build)
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Code Style Guidelines
- TypeScript with strict mode; use explicit types
- React components in PascalCase (e.g., MatrixApp)
- Services/utilities in camelCase
- Frontend/backend separation with shared types
- Use named exports over default exports
- No unused locals/parameters allowed
- Proper error handling with try/catch blocks
- Organize imports: React imports first, then external libs, then local modules
- Use functional components with hooks
- Leverage TypeScript interfaces for data structures
- Follow React hooks rules (useEffect dependencies array)
- Bootstrap/Heroicons for UI components