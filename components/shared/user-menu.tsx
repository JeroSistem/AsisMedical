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
        className="flex w-full items-center gap-2 rounded-lg p-1.5 text-left text-xs transition-colors hover:bg-white/70"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#39b8fd] shadow-sm">
          <span className="text-xs font-semibold text-[#0F172A]">
            {session?.user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="truncate font-geist text-[12px] font-medium text-[#163a47]">
            {session?.user?.name || 'Usuario'}
          </span>
          <span className="truncate text-[11px] text-[#4d7f8f]">
            {userRole}
          </span>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-[#4d7f8f] transition-transform ${
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
        <div className="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-lg border border-[#7ec9d8]/50 bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
          <div className="p-2">
            <button
              className="flex w-full items-center space-x-2 rounded px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
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