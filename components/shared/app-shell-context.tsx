'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

export type AppChromeState = {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  contentClassName?: string;
};

type ChromeMeta = {
  title?: string;
  description?: string;
  showBackButton?: boolean;
  contentClassName?: string;
};

type AppShellContextValue = {
  insideShell: boolean;
  chrome: AppChromeState;
  setChrome: (chrome: AppChromeState) => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

const BARE_EXACT = new Set([
  '/login',
  '/portal-paciente',
  '/portal-paciente/teleconsulta',
]);

const BARE_PREFIXES = ['/api', '/_next'];

export function isBareRoute(pathname: string | null): boolean {
  if (!pathname) return true;
  if (BARE_EXACT.has(pathname)) return true;
  return BARE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function useAppShell() {
  return useContext(AppShellContext);
}

/** Actualiza el chrome del shell persistente (título, acciones, etc.). */
export function useSetAppChrome(chrome: AppChromeState) {
  const ctx = useContext(AppShellContext);
  const setChrome = ctx?.setChrome;
  const insideShell = Boolean(ctx?.insideShell);
  const chromeRef = useRef(chrome);
  chromeRef.current = chrome;

  useLayoutEffect(() => {
    if (!insideShell || !setChrome) return;
    setChrome(chromeRef.current);
  }, [
    insideShell,
    setChrome,
    chrome.title,
    chrome.description,
    chrome.showBackButton,
    chrome.contentClassName,
    chrome.actions,
    chrome.onBack,
  ]);
}

export function AppShellProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = isBareRoute(pathname);
  const [meta, setMeta] = useState<ChromeMeta>({});
  const [slotTick, setSlotTick] = useState(0);
  const metaRef = useRef<ChromeMeta>({});
  const actionsRef = useRef<React.ReactNode>(undefined);
  const onBackRef = useRef<(() => void) | undefined>(undefined);

  const setChrome = useCallback((next: AppChromeState) => {
    const prevMeta = metaRef.current;
    const actionsChanged = actionsRef.current !== next.actions;
    const onBackChanged = onBackRef.current !== next.onBack;

    actionsRef.current = next.actions;
    onBackRef.current = next.onBack;

    const metaSame =
      prevMeta.title === next.title &&
      prevMeta.description === next.description &&
      prevMeta.showBackButton === next.showBackButton &&
      prevMeta.contentClassName === next.contentClassName;

    if (!metaSame) {
      const nextMeta: ChromeMeta = {
        title: next.title,
        description: next.description,
        showBackButton: next.showBackButton,
        contentClassName: next.contentClassName,
      };
      metaRef.current = nextMeta;
      setMeta(nextMeta);
      return;
    }

    if (actionsChanged || onBackChanged) {
      setSlotTick((t) => t + 1);
    }
  }, []);

  useEffect(() => {
    actionsRef.current = undefined;
    onBackRef.current = undefined;
    metaRef.current = {};
    setMeta({});
    setSlotTick((t) => t + 1);
  }, [pathname]);

  const chrome = useMemo<AppChromeState>(
    () => ({
      ...meta,
      actions: actionsRef.current,
      onBack: onBackRef.current,
    }),
    [meta, slotTick]
  );

  const value = useMemo(
    () => ({
      insideShell: !bare,
      chrome,
      setChrome,
    }),
    [bare, chrome, setChrome]
  );

  if (bare) {
    return <>{children}</>;
  }

  return (
    <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>
  );
}
