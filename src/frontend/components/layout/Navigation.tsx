import React from 'react';
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle.tsx';
import { ChartBarIcon, TableCellsIcon, ArrowRightOnRectangleIcon, HomeIcon } from '@heroicons/react/24/outline';
import './Navigation.css';

interface NavigationProps {
  onSignOut?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the matrices page
  const isMatricesPage = location.pathname === '/matrices';
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  return (
    <Navbar 
      expand="lg" 
      className="py-2 mb-3 navigation-bar"
      variant="dark"
    >
      <Container fluid="lg">
        <Navbar.Brand 
          onClick={() => navigate('/')} 
          className="d-flex align-items-center gap-2 brand-logo"
        >
          <TableCellsIcon width={24} height={24} />
          <span className="fw-bold">Decision Matrix</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              onClick={() => navigate('/')}
              active={isHomePage}
              className="d-flex align-items-center gap-2"
            >
              <HomeIcon width={18} height={18} />
              <span>New Matrix</span>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => navigate('/matrices')}
              active={isMatricesPage}
              className="d-flex align-items-center gap-2"
            >
              <ChartBarIcon width={18} height={18} />
              <span>My Matrices</span>
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center gap-3">
            <ThemeToggle />
            {onSignOut && (
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={onSignOut}
                className="d-flex align-items-center gap-2 sign-out-btn"
              >
                <ArrowRightOnRectangleIcon width={18} height={18} />
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}; 