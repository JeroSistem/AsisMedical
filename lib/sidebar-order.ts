import type { NavigationItem } from '@/lib/types';

const STORAGE_KEY = 'asis.sidebar.moduleOrder';

export function loadSidebarModuleOrder(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveSidebarModuleOrder(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / private mode
  }
}

/** Aplica un orden guardado a los módulos; los nuevos quedan al final. */
export function applyModuleOrder(
  modules: NavigationItem[],
  orderIds: string[]
): NavigationItem[] {
  if (!orderIds.length) return modules;

  const byId = new Map(modules.map((m) => [m.id, m]));
  const ordered: NavigationItem[] = [];

  for (const id of orderIds) {
    const item = byId.get(id);
    if (item) {
      ordered.push(item);
      byId.delete(id);
    }
  }

  // módulos nuevos no guardados aún
  for (const item of byId.values()) {
    ordered.push(item);
  }

  return ordered;
}

export function reorderModuleIds(
  ids: string[],
  fromId: string,
  toId: string
): string[] {
  const next = [...ids];
  const fromIndex = next.indexOf(fromId);
  const toIndex = next.indexOf(toId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return ids;

  next.splice(fromIndex, 1);
  next.splice(toIndex, 0, fromId);
  return next;
}
