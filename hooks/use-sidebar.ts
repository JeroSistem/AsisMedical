import { useState, useEffect, useCallback } from 'react';

export function useSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const large = window.innerWidth >= 1024;
      setIsLargeScreen(large);
      if (large) {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
        return true;
      }
      return !prev;
    });
  }, []);

  const forceOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  const forceCloseSidebar = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  return {
    sidebarOpen,
    isLargeScreen,
    toggleSidebar,
    forceOpenSidebar,
    forceCloseSidebar,
  };
}
