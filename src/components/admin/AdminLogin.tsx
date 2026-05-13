import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login } from '@/lib/auth-service'
import { cn } from '@/lib/utils'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/admin')
      } else {
        setError('Credenciales invalidas. Intenta de nuevo.')
      }
    } catch {
      setError('Error al iniciar sesion. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #1e3a5f 100%)' }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" fill="#0073aa" />
              <text x="20" y="26" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">
                I
              </text>
            </svg>
            <span className="text-white text-2xl font-bold">ImpuestIA</span>
          </div>
          <p className="text-[#b0b0b0] text-sm">Panel de Administracion</p>
        </div>

        {/* Login Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-white text-xl font-bold mb-6 text-center">Iniciar Sesion</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin o editor"
                className={cn(
                  'w-full h-11 px-4 rounded-lg border text-white text-sm',
                  'placeholder:text-[#666]',
                  'focus:outline-none focus:ring-2 focus:ring-[#0073aa] focus:border-transparent',
                  'transition-all duration-200'
                )}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.12)',
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className={cn(
                  'w-full h-11 px-4 rounded-lg border text-white text-sm',
                  'placeholder:text-[#666]',
                  'focus:outline-none focus:ring-2 focus:ring-[#0073aa] focus:border-transparent',
                  'transition-all duration-200'
                )}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.12)',
                }}
              />
            </div>

            {error && (
              <div className="text-[#ef4444] text-sm bg-[#ef4444]/10 rounded-lg p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full h-11 rounded-lg text-white text-sm font-bold',
                'transition-all duration-200',
                'hover:opacity-90 hover:shadow-lg',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              style={{ backgroundColor: '#0073aa' }}
            >
              {isLoading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 text-center">
          <p className="text-[#666] text-xs">
            Credenciales demo:{' '}
            <span className="text-[#999] font-mono">admin / admin123</span>{' '}
            o{' '}
            <span className="text-[#999] font-mono">editor / editor123</span>
          </p>
        </div>
      </div>
    </div>
  )
}
