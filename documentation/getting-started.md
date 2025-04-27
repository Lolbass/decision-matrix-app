# Getting Started

This guide will help you set up the Decision Matrix application for development.

## Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- A Supabase account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/decision_matrix.git
cd decision_matrix
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the project root with the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Development

Run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server with hot module replacement (HMR) at `http://localhost:5173`.

## Building for Production

Build the application for production:

```bash
npm run build
```

This will:
- Run TypeScript type checking
- Build the application using Vite
- Output to the `dist` directory

To preview the built application:

```bash
npm run preview
```

## Project Structure

The project follows a modular structure:

```
/src
  /frontend           # React UI components and hooks
    /components       # UI components
      /features       # Feature components (CriteriaManager, etc.)
      /layout         # Layout components (Navigation, etc.)
      /ui             # Reusable UI components
    /hooks            # Custom React hooks
    /styles           # CSS styles
  /backend            # Backend services
    /services         # Service modules for database operations
    /lib              # Backend utilities and libraries
  /shared             # Shared code between frontend and backend
    /types            # TypeScript type definitions
```

## Next Steps

After setup, consider:

1. Exploring the [Project Documentation](./README.md)
2. Checking the [Project Tasks](../PROJECT_TASKS.md) to find areas to work on
3. Reviewing the [Database Schema](./database-schema.md)
4. Understanding the [Application Architecture](./architecture.md)