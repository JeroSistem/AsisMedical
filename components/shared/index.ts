// 📦 Exportaciones de componentes compartidos

// Layout y navegación
export { AppLayout } from './app-layout';
export { SidebarNav } from './sidebar-nav';
export { SessionProvider } from './session-provider';
export { Logo } from './logo';
export { ModalForm } from './modal-form';
export { UserMenu } from './user-menu';

// Navegación de módulos
export {
  ModuleNavigation,
  CompactModuleNavigation,
} from './module-navigation';

// Tipos de componentes compartidos
export interface SharedComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Configuración de temas
export const THEME_CONFIG = {
  light: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    accent: '#fbbf24',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
  },
} as const; 