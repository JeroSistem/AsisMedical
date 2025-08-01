'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useLogout } from '@/hooks/use-logout';

export function UserMenu() {
  const { data: session } = useSession();
  const { handleLogout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Extraer el rol del usuario de manera segura
  const userRole = (session?.user as any)?.role || 'Médico';

  // Cerrar el menú cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoutClick = () => {
    setIsOpen(false);
    handleLogout();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-2 text-sm p-2 rounded-lg hover:bg-accent transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <span className="text-xs font-semibold text-primary-foreground">
            {session?.user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <span className="hidden md:inline-block font-medium">
          {session?.user?.name || 'Usuario'}
        </span>
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menú */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-background border border-border rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            <div className="px-3 py-2 text-sm text-muted-foreground border-b border-border mb-1">
              <div className="font-medium text-foreground">
                {session?.user?.name || 'Usuario'}
              </div>
              <div className="text-xs">{userRole}</div>
            </div>
            <button
              className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-colors flex items-center space-x-2"
              onClick={handleLogoutClick}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 