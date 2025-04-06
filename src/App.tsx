import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthPage } from './frontend/components/AuthPage';
import { MatrixApp } from './frontend/components/MatrixApp';
import { Home } from './frontend/components/Home';
import { MatricesPage } from './frontend/components/MatricesPage';
import { supabase } from './backend/lib/supabase';
import { authService } from './backend/services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize dark theme
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  useEffect(() => {
    let isMounted = true;
    
    // Get the initial session
    const initSession = async () => {
      try {
        // Try to refresh the session first
        await authService.refreshSession();
        
        // Then get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          setIsAuthenticated(!!session);
          if (session) {
            // Verify user exists
            try {
              await authService.getCurrentUser();
            } catch (userError) {
              console.error('User validation error:', userError);
              // If user validation fails but session exists, we'll still continue
            }
          }
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (isMounted) {
          setIsAuthenticated(false);
          setAuthError(error instanceof Error ? error.message : 'Authentication error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Set up auth state change listener
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        
        if (isMounted) {
          if (event === 'SIGNED_IN') {
            setIsAuthenticated(true);
            setAuthError(null);
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false);
          } else if (event === 'TOKEN_REFRESHED') {
            setIsAuthenticated(!!session);
          } else if (event === 'USER_UPDATED') {
            setIsAuthenticated(!!session);
          }
        }
      });
      
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth subscription:', error);
      if (isMounted) {
        setAuthError(error instanceof Error ? error.message : 'Authentication subscription error');
        setLoading(false);
      }
    }

    // Periodic session check
    const sessionCheckInterval = setInterval(async () => {
      if (isAuthenticated) {
        try {
          const hasSession = await authService.hasValidSession();
          if (isMounted && !hasSession) {
            console.warn('Session check failed - attempting refresh');
            try {
              const refreshResult = await authService.refreshSession();
              if (isMounted) {
                setIsAuthenticated(!!refreshResult.session);
              }
            } catch (refreshError) {
              console.error('Session refresh failed:', refreshError);
              if (isMounted) {
                setIsAuthenticated(false);
              }
            }
          }
        } catch (checkError) {
          console.error('Session check error:', checkError);
        }
      }
    }, 60000); // Check every minute

    return () => {
      isMounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
      clearInterval(sessionCheckInterval);
    };
  }, []);

  const handleAuthSuccess = async () => {
    try {
      setAuthError(null);
      const hasSession = await authService.hasValidSession();
      setIsAuthenticated(hasSession);
    } catch (error) {
      console.error('Error handling auth success:', error);
      setAuthError(error instanceof Error ? error.message : 'Error establishing session');
    }
  };

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
              <AuthPage 
                onAuthSuccess={handleAuthSuccess} 
                authError={authError}
              />
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
              <MatricesPage />
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
