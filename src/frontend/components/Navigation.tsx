import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle.tsx';

interface NavigationProps {
  onSignOut?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSignOut }) => {
  const navigate = useNavigate();

  return (
    <Navbar bg="transparent" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer' }}
        >
          Decision Matrix
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <div className="d-flex align-items-center gap-2">
            <ThemeToggle />
            {onSignOut && (
              <Button variant="outline-danger" onClick={onSignOut}>
                Sign Out
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}; 