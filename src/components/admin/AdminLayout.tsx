import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router'
import {
  LayoutDashboard,
  FileText,
  Plus,
  Users,
  Linkedin,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  ChevronRight,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout, getCurrentUser } from '@/lib/auth-service'
import type { AdminUser } from '@/lib/auth-service'

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Posts', icon: FileText, path: '/admin/posts' },
  { label: 'Nueva Entrada', icon: Plus, path: '/admin/posts/new' },
  { label: 'Leads', icon: Users, path: '/admin/leads' },
  { label: 'LinkedIn', icon: Linkedin, path: '/admin/linkedin' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const activePath = location.pathname

  return (
    <div className="min-h-[100dvh] flex" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{
          width: '240px',
          backgroundColor: '#1a1a2e',
        }}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0073aa' }}>
              <span className="text-white text-sm font-bold">I</span>
            </div>
            <span className="text-white font-bold text-sm">ImpuestIA</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = activePath === item.path
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'text-white'
                    : 'text-[#8b8ba7] hover:text-white hover:bg-white/5'
                )}
                style={isActive ? { backgroundColor: 'rgba(0,115,170,0.2)', color: '#fff' } : {}}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-60" />
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0073aa' }}>
              <span className="text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || 'Admin'}</p>
              <p className="text-[#666] text-xs truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#8b8ba7] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all duration-200 mt-1"
          >
            <LogOut size={18} />
            <span>Cerrar Sesion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          className="h-16 flex items-center px-4 lg:px-8 border-b bg-white"
          style={{ borderColor: '#e5e7eb' }}
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 mr-3 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} className="text-gray-600" />
          </button>

          {/* Search */}
          <div className="relative hidden sm:block flex-1 max-w-md">
            {searchOpen ? (
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Buscar..."
                  autoFocus
                  className="w-full h-9 pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                  style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                />
                <Search size={16} className="absolute left-3 text-gray-400" />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Search size={18} />
                <span className="text-sm">Buscar...</span>
              </button>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Role badge */}
            {user?.role === 'admin' && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#0073aa] bg-[#0073aa]/10 px-2.5 py-1 rounded-full">
                <Shield size={12} />
                Admin
              </span>
            )}

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ef4444]" />
            </button>

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: '#0073aa' }}
            >
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
