import React, { createContext, useContext, useState, useEffect } from 'react';
import Lenis from 'lenis';

// Create context
const LenisContext = createContext(null);

// Provider component
export function LenisProvider({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const lenisInstance = new Lenis({
      autoRaf: true,
    });
    setLenis(lenisInstance);

    return () => {
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

// Get the Lenis instance
export function useLenis() {
  const context = useContext(LenisContext);
  if (context === undefined) {
    throw new Error('useLenis must be used within a LenisProvider');
  }
  return context;
}
