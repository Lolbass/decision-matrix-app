import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { authService } from '../../backend/services/authService';

interface AuthPageProps {
  onAuthSuccess: () => void;
  authError?: string | null;
}

// Password validation rule
const MIN_PASSWORD_LENGTH = 8;

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, authError: externalError }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [signupDisabled, setSignupDisabled] = useState(false);

  // Update internal error state when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const validatePassword = (password: string): boolean => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long`);
      return false;
    }
    
    // Check if password has at least one number and one letter
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    
    if (!hasNumber || !hasLetter) {
      setPasswordError('Password must contain at least one number and one letter');
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate password before submission
    if (!validatePassword(password)) {
      return;
    }
    
    setLoading(true);

    try {
      const result = await authService.signUp(email, username, password);
      
      // If email confirmation is required, immediately try to sign in anyway
      if ('emailConfirmationRequired' in result && result.user) {
        try {
          // Try immediate sign-in
          await authService.signIn(email, password);
          const hasSession = await authService.hasValidSession();
          if (hasSession) {
            onAuthSuccess();
            return;
          }
        } catch {
          // Fall back to showing email confirmation message
          setError("Please check your email and click the confirmation link to activate your account");
          setActiveTab('signin');
          return;
        }
      }
      
      // Normal flow - check for session validity
      const hasSession = await authService.hasValidSession();
      if (hasSession) {
        onAuthSuccess();
      } else {
        setError("Account created but session not established. Please sign in.");
        setActiveTab('signin');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred during sign up';
      
      // Check for email signup disabled error
      if (errMsg.includes('Email signups are disabled')) {
        setError('Registration is currently disabled. Please contact the administrator.');
        setSignupDisabled(true);
        setActiveTab('signin');
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.signIn(email, password);
      // Validate session after sign-in
      const hasSession = await authService.hasValidSession();
      if (hasSession) {
        onAuthSuccess();
      } else {
        // Try to refresh the session
        try {
          const refreshResult = await authService.refreshSession();
          if (refreshResult.session) {
            onAuthSuccess();
          } else {
            throw new Error('Failed to establish session');
          }
        } catch {
          throw new Error('Failed to establish session after sign in');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-dark">
              <div className="d-flex justify-content-center">
                {!signupDisabled ? (
                  <div className="btn-group" role="group">
                    <Button
                      variant={activeTab === 'signin' ? 'primary' : 'outline-primary'}
                      onClick={() => setActiveTab('signin')}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant={activeTab === 'signup' ? 'primary' : 'outline-primary'}
                      onClick={() => setActiveTab('signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <h5 className="mb-0">Sign In</h5>
                )}
              </div>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                  {error}
                </Alert>
              )}

              {activeTab === 'signin' || signupDisabled ? (
                <Form onSubmit={handleSignIn}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleSignUp}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Choose a password (min 8 characters with letters and numbers)"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) validatePassword(e.target.value);
                      }}
                      required
                      isInvalid={!!passwordError}
                    />
                    {passwordError && (
                      <Form.Control.Feedback type="invalid">
                        {passwordError}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}; 