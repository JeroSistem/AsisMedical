// Componentes compartidos del sistema

// Layout y navegación principal
export { AppLayout, PersistentAppShell } from './app-layout';
export { AppShellProvider, useAppShell, useSetAppChrome } from './app-shell-context';

// Navegación de módulos
export { 
  ModuleNavigation, 
  CompactModuleNavigation,
  BreadcrumbNavigation,
  QuickAccessNavigation,
  CategoryNavigation 
} from './module-navigation';

// Componentes de UI compartidos
export { Logo } from './logo';
export { ModalForm } from './modal-form';

// Tipos
export type { AppLayoutProps } from './app-layout';
