import { render, screen } from '@testing-library/react'
import { AppLayout } from '@/components/shared/app-layout'

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: {
      user: {
        name: 'Test User',
        email: 'test@example.com',
        role: 'ADMIN'
      }
    },
    status: 'authenticated'
  }),
  signOut: jest.fn()
}))

// Mock hooks
jest.mock('@/hooks/use-sidebar', () => ({
  useSidebar: () => ({
    sidebarOpen: false,
    toggleSidebar: jest.fn(),
    isLargeScreen: true
  })
}))

jest.mock('@/hooks/use-logout', () => ({
  useLogout: () => ({
    handleLogout: jest.fn()
  })
}))

describe('AppLayout', () => {
  it('renders without crashing', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    )
    
    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('displays user information when authenticated', () => {
    render(
      <AppLayout>
        <div>Test content</div>
      </AppLayout>
    )
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
  })
})
