# Decision Matrix App

A modern web application for creating and managing decision matrices. Built with React, TypeScript, and Supabase.

## Features

- 🔐 Simplified authentication (email-based)
- 📊 Create and manage decision matrices
- ⚖️ Define criteria with weights
- 📝 Add and evaluate options
- 📈 Automatic score calculation
- 🎨 Modern, responsive UI
- 🔄 Real-time updates

## Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Bootstrap 5
  - React Bootstrap
  - React Icons

- **Backend:**
  - Supabase (PostgreSQL)
  - Row Level Security (RLS)
  - Real-time subscriptions

## Project Structure

```
src/
├── frontend/
│   ├── components/     # React components
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Frontend utility functions
├── backend/
│   ├── lib/           # Backend library code
│   └── services/      # Backend services
└── App.tsx            # Main application component
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

5. Open your browser and navigate to `http://localhost:5173`

## Database Schema

The application uses the following main tables:

- `users`: User information
- `matrices`: Decision matrices
- `criteria`: Evaluation criteria
- `options`: Decision options
- `option_criteria`: Option scores for each criterion
- `user_matrices`: User-matrix relationships

## Authentication

The application uses a simplified authentication system:
- Sign up with email and username
- Sign in with email
- No password management required
- Automatic user creation on first sign-in

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
