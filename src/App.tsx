import { useState, useEffect } from 'react';
import { AuthPage } from './frontend/components/AuthPage';
import { MatrixApp } from './frontend/components/MatrixApp';
import { authService } from './backend/services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    authService.getCurrentUser().then(user => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  return <MatrixApp onSignOut={() => setIsAuthenticated(false)} />;
}

export default App;
