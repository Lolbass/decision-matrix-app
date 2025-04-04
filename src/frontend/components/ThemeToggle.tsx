import React, { useEffect } from 'react';

export const ThemeToggle: React.FC = () => {
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }, []);

  // Empty component - no toggle button rendered
  return null;
}; 