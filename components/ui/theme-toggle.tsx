'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/lib/contexts/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Oscuro', icon: Moon },
    { value: 'system' as const, label: 'Sistema', icon: Monitor },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const Icon = resolvedTheme === 'dark' ? Moon : Sun;

  // Mismo número de hooks siempre; solo cambia el markup tras montar
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative h-9 w-9 rounded-md border border-border bg-background"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Cambiar tema</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground"
        >
          <Icon className="h-4 w-4" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {themes.map((themeOption) => {
          const ThemeIcon = themeOption.icon;
          return (
            <DropdownMenuItem
              key={themeOption.value}
              onClick={() => setTheme(themeOption.value)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ThemeIcon className="h-4 w-4" />
              <span>{themeOption.label}</span>
              {theme === themeOption.value && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SimpleThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="relative h-9 w-9 rounded-md border border-border bg-background"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="relative h-9 w-9 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground"
    >
      {resolvedTheme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}

/** Alias estable: siempre el mismo componente (mismos hooks). */
export function SafeThemeToggle() {
  return <ThemeToggle />;
}
