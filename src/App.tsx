import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './frontend/components/AuthPage';
import { MatrixApp } from './frontend/components/MatrixApp';
import { Home } from './frontend/components/Home';
import { supabase } from './backend/lib/supabase';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the initial session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    initSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
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

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
            )
          } 
        />
        <Route 
          path="/matrix/:id" 
          element={
            isAuthenticated ? (
              <MatrixApp onSignOut={() => setIsAuthenticated(false)} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/matrices" 
          element={
            isAuthenticated ? (
              <MatrixApp onSignOut={() => setIsAuthenticated(false)} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
