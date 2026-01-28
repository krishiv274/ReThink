'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext({
  isOpen: false,
  toggle: () => {},
  open: () => {},
  close: () => {},
});

export function SidebarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  // Persist sidebar state in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) {
      setIsOpen(saved === 'true');
    }
  }, []);

  const toggle = () => {
    setIsOpen(prev => {
      const newState = !prev;
      localStorage.setItem('sidebarOpen', String(newState));
      return newState;
    });
  };

  const open = () => {
    setIsOpen(true);
    localStorage.setItem('sidebarOpen', 'true');
  };

  const close = () => {
    setIsOpen(false);
    localStorage.setItem('sidebarOpen', 'false');
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
