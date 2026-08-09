'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Credenciales inválidas')
      } else {
        router.push('/')
        router.refresh()
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1c30] p-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(57,184,253,0.25), transparent), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(15,23,42,0.9), transparent)',
        }}
      />
      <Card className="relative z-10 w-full max-w-md border-slate-200 bg-white shadow-clinical">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-[#0b1c30]">
            <span className="material-symbols-outlined text-[32px] text-[#39b8fd]">
              local_hospital
            </span>
          </div>
          <CardTitle className="font-geist text-headline-sm text-[#191c1e]">
            ASIS Medical
          </CardTitle>
          <p className="text-body-sm text-[#45464d]">
            Clinical ERP — inicia sesión en tu cuenta
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-geist text-label-md text-[#191c1e]">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@asismedicare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-geist text-label-md text-[#191c1e]">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 rounded-md border border-slate-100 bg-[#f7f9fb] p-3 text-center text-[12px] text-[#45464d]">
            <p className="font-geist font-medium text-[#191c1e]">Credenciales demo</p>
            <p className="mt-1 font-mono text-[11px]">admin@asismedicare.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
