import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Clinical Precision System (Stitch)
        surface: {
          DEFAULT: '#f7f9fb',
          dim: '#d8dadc',
          bright: '#f7f9fb',
          variant: '#e0e3e5',
          container: {
            DEFAULT: '#eceef0',
            lowest: '#ffffff',
            low: '#f2f4f6',
            high: '#e6e8ea',
            highest: '#e0e3e5',
          },
        },
        'on-surface': {
          DEFAULT: '#191c1e',
          variant: '#45464d',
        },
        'primary-container': '#131b2e',
        'on-primary-container': '#7c839b',
        'secondary-container': '#39b8fd',
        'on-secondary-container': '#004666',
        'tertiary-container': '#0b1c30',
        'on-tertiary-container': '#75859d',
        outline: {
          DEFAULT: '#76777d',
          variant: '#c6c6cd',
        },
        shell: {
          bg: '#c5ecf4',
          panel: '#b3e3ee',
          border: 'rgba(62, 155, 176, 0.35)',
          text: '#163a47',
          muted: '#4d7f8f',
          accent: '#39b8fd',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          background: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          muted: {
            foreground: 'hsl(var(--sidebar-muted-foreground))',
          },
          border: 'hsl(var(--sidebar-border))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
        },
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        base: '4px',
        'container-margin': '24px',
        'gutter-md': '16px',
        'component-gap-sm': '8px',
        'component-gap-md': '12px',
        'section-padding': '32px',
        'shell-sidebar': '280px',
        'shell-top': '48px',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'Inter', 'system-ui', 'sans-serif'],
        geist: ['var(--font-geist)', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Geist Mono', 'ui-monospace', 'monospace'],
        display: ['var(--font-geist)', 'Geist', 'Inter', 'system-ui', 'sans-serif'],
        body: ['var(--font-geist)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['32px', {lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600'}],
        'headline-md': ['24px', {lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600'}],
        'headline-sm': ['20px', {lineHeight: '28px', fontWeight: '600'}],
        'title-lg': ['18px', {lineHeight: '28px', fontWeight: '500'}],
        'body-md': ['14px', {lineHeight: '20px', fontWeight: '400'}],
        'body-sm': ['13px', {lineHeight: '18px', fontWeight: '400'}],
        'label-md': ['12px', {lineHeight: '16px', letterSpacing: '0.02em', fontWeight: '500'}],
        'label-sm': ['11px', {lineHeight: '12px', fontWeight: '600'}],
        'mono-data': ['13px', {lineHeight: '20px', fontWeight: '400'}],
      },
      boxShadow: {
        clinical: '0 4px 12px rgba(15, 23, 42, 0.08)',
        none: 'none',
      },
    },
  },
  plugins: [],
} satisfies Config;
