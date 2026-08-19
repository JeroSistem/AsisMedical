import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByText('AsisMediCare')).toBeVisible()
    await expect(page.getByLabel('Correo electrónico')).toBeVisible()
    await expect(page.getByLabel('Contraseña')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByLabel('Correo electrónico').fill('invalid@example.com')
    await page.getByLabel('Contraseña').fill('wrongpassword')
    await page.getByRole('button', { name: 'Iniciar Sesión' }).click()
    
    await expect(page.getByText('Credenciales inválidas')).toBeVisible()
  })

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login')
    
    const passwordInput = page.getByLabel('Contraseña')
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    await page.getByRole('button', { name: 'Toggle password visibility' }).click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
  })
})
