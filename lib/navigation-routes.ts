import { MAIN_NAVIGATION, type NavigationItem } from '@/lib/navigation';

export type FlatNavigationRoute = {
  id: string;
  href: string;
  title: string;
  description?: string;
};

export function flattenNavigation(
  items: NavigationItem[] = MAIN_NAVIGATION
): FlatNavigationRoute[] {
  const result: FlatNavigationRoute[] = [];

  const walk = (nodes: NavigationItem[]) => {
    for (const node of nodes) {
      if (node.href && node.href !== '#') {
        result.push({
          id: node.id,
          href: node.href.split('?')[0].replace(/\/$/, '') || node.href,
          title: node.title,
          description: node.description,
        });
      }
      if (node.children?.length) {
        walk(node.children);
      }
    }
  };

  walk(items);
  return result;
}

export function getNavigationRoute(href: string): FlatNavigationRoute | undefined {
  const normalized = href.split('?')[0].replace(/\/$/, '') || href;
  return flattenNavigation().find((route) => route.href === normalized);
}
