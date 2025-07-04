# Decision Matrix App

A modern web application for creating and managing decision matrices. Built with React, TypeScript, and Supabase. Features a sleek dark/light theme switcher and intuitive user interface.

![Decision Matrix Icon](/public/decision-matrix-icon.svg)

## Features

- 🔐 Simplified authentication (email-based)
- 📊 Create and manage decision matrices
- ⚖️ Define criteria with weights
- 📝 Add and evaluate options
- 📈 **1-10 scoring scale** with automatic weighted calculation and visual score bars
- 🎨 Modern, responsive UI with dark/light theme support
- 🌓 Theme switcher with persistent preferences
- 🔍 Advanced search and sorting capabilities
- ⚡ Real-time updates
- 🏠 Welcome page with quick actions
- 🛣️ Intuitive navigation
- 👥 Matrix sharing and collaboration
- 📋 Modern card-based matrix management
- 🔒 Row-level security for data protection

## Tech Stack

- **Frontend:**
  - React 19
  - TypeScript
  - Bootstrap 5 with theme support
  - React Bootstrap
  - Heroicons
  - React Router DOM
  - CSS Variables for theming

- **Backend:**
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)
  - Real-time subscriptions

## Documentation

Comprehensive documentation is available in the [documentation](/documentation) directory:

- [Project Overview](/documentation/project-overview.md)
- [Getting Started](/documentation/getting-started.md)
- [Architecture](/documentation/architecture.md)
- [Application Flow](/documentation/flow.md)
- [Frontend Guide](/documentation/frontend-guide.md)
- [Backend Guide](/documentation/backend-guide.md)
- [API Documentation](/documentation/API.md)
- [Database Schema](/documentation/database-schema.md)
- [Supabase Setup](/documentation/supabase-setup.md)
- [Deployment Guide](/documentation/deployment.md)
- [User Guide](/documentation/user-guide.md)

## Project Structure

```
src/
├── frontend/
│   ├── components/     # React components
│   │   ├── features/   # Feature components
│   │   ├── layout/     # Layout components
│   │   └── ui/         # UI components
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # CSS styles
│   └── utils/          # Frontend utility functions
├── backend/
│   ├── lib/            # Backend library code
│   ├── services/       # Backend services
│   └── types/          # Backend type definitions
├── shared/
│   └── types/          # Shared type definitions
└── App.tsx             # Main application component
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/decision_matrix.git
   cd decision_matrix
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal)

6. Run tests:
   ```bash
   npm test
   ```

## Testing

The application includes end-to-end tests using Playwright:

- Authentication tests (login, signup)
- User flow tests
- Form validation tests

For more details, see the [tests/README.md](tests/README.md) file.

## Scoring System

The application uses a **1-10 scoring scale** for evaluating options against criteria:
- **1**: Poorest performance  
- **10**: Best performance
- **0**: No score assigned (shows as "-" in interface)

Final scores are calculated using weighted averages based on criterion importance.

## Application Flow

1. **Welcome Page** (`/`)
   - Landing page for authenticated users
   - Quick access to create new matrices or view existing ones
   - Feature highlights and application overview

2. **Authentication** (`/`)
   - Sign up with email and username
   - Sign in with email
   - Automatic user creation on first sign-in

3. **Matrix Management**
   - Create new matrices (`/matrix`)
   - View and manage existing matrices (`/matrices`)
   - Define criteria and options
   - Calculate and view results
   - Share matrices with other users

4. **Matrix Listing** (`/matrices`)
   - View all your matrices in a modern card-based layout
   - Search matrices by name or description
   - Sort matrices by date created, modified, or alphabetically
   - Quick access to matrix details
   - Create new matrices
   - Delete matrices you no longer need

## Database Schema

The application uses the following main tables:

- `users`: User information
- `matrices`: Decision matrices
- `criteria`: Evaluation criteria
- `options`: Decision options
- `option_criteria`: Option scores for each criterion
- `user_matrices`: User-matrix relationships for sharing and access control

## Row Level Security (RLS)

The application implements Row Level Security for data protection:

1. **Matrices Table**
   - Users can only access their own matrices
   - Matrix owners can share their matrices with other users

2. **User Matrices Table**
   - Users can only view and modify their own matrix relationships
   - Access is controlled through RLS policies

3. **Criteria and Options Tables**
   - Access is restricted to users with access to the parent matrix

## Authentication

The application uses a simplified authentication system:
- Sign up with email and username
- Sign in with email
- No password management required
- Automatic user creation on first sign-in
- Secure session management

## Theme Support

The application features a comprehensive theming system:

1. **Theme Switching**
   - Toggle between light and dark themes
   - Theme preference is persisted in local storage
   - Smooth transitions between themes

2. **CSS Variables**
   - Theme-aware color system using CSS variables
   - Consistent styling across components
   - Easy theme customization

3. **Component Theming**
   - All components are theme-aware
   - Proper contrast in both themes
   - Accessible color combinations
   - Visual indicators and progress bars adapt to current theme

4. **Bootstrap Integration**
   - Uses Bootstrap's theme system
   - Custom theme extensions for specialized components
   - Consistent with Bootstrap's design language

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Bootstrap](https://getbootstrap.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Router](https://reactrouter.com/)
- [Heroicons](https://heroicons.com/)
