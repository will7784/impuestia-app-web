export interface AdminUser {
  email: string
  name: string
  role: 'admin' | 'editor'
}

const AUTH_TOKEN_KEY = 'impuestia_admin_token'
const AUTH_USER_KEY = 'impuestia_admin_user'

const DEMO_USERS: Record<string, { password: string; user: AdminUser }> = {
  'admin': {
    password: 'admin123',
    user: { email: 'admin@impuestia.cl', name: 'Administrador', role: 'admin' },
  },
  'editor': {
    password: 'editor123',
    user: { email: 'editor@impuestia.cl', name: 'Editor', role: 'editor' },
  },
}

export function login(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; token?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const demoAccount = DEMO_USERS[email]
      if (demoAccount && demoAccount.password === password) {
        const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`
        localStorage.setItem(AUTH_TOKEN_KEY, token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(demoAccount.user))
        resolve({ success: true, user: demoAccount.user, token })
      } else {
        resolve({ success: false })
      }
    }, 400)
  })
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(AUTH_TOKEN_KEY)
}

export function logout(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export function getCurrentUser(): AdminUser | null {
  try {
    const stored = localStorage.getItem(AUTH_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function requireAuth(): void {
  if (!isAuthenticated()) {
    window.location.hash = '#/admin/login'
  }
}
