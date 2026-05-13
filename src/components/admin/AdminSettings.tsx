import { useState, useEffect } from 'react'
import {
  Settings,
  User,
  Shield,
  Bell,
  Save,
  Loader2,
  Check,
} from 'lucide-react'
import { getCurrentUser } from '@/lib/auth-service'
import type { AdminUser } from '@/lib/auth-service'
import { cn } from '@/lib/utils'

export default function AdminSettings() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [siteName, setSiteName] = useState('ImpuestIA')
  const [siteEmail, setSiteEmail] = useState('contacto@impuestia.cl')
  const [postsPerPage, setPostsPerPage] = useState('10')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    setUser(getCurrentUser())
  }, [])

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSaveMessage('Configuracion guardada correctamente')
      setTimeout(() => setSaveMessage(''), 3000)
    }, 600)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configuracion general del panel</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={16} className="text-[#0073aa]" />
          Perfil de Usuario
        </h3>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#0073aa' }}
          >
            <span className="text-white text-lg font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium text-gray-900">{user?.name || 'Admin'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#0073aa]/10 text-[#0073aa]">
              <Shield size={10} />
              {user?.role === 'admin' ? 'Administrador' : 'Editor'}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full h-9 px-3 rounded-lg border text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input
              type="text"
              value={user?.email || ''}
              readOnly
              className="w-full h-9 px-3 rounded-lg border text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              style={{ borderColor: '#e5e7eb' }}
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={16} className="text-[#0073aa]" />
          Configuracion General
        </h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre del Sitio</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email de Contacto</label>
              <input
                type="text"
                value={siteEmail}
                onChange={(e) => setSiteEmail(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Posts por Pagina</label>
            <select
              value={postsPerPage}
              onChange={(e) => setPostsPerPage(e.target.value)}
              className="w-full sm:w-32 h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={16} className="text-[#0073aa]" />
          Notificaciones
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-800">Notificaciones por email</p>
            <p className="text-xs text-gray-500">Recibe alertas cuando lleguen nuevos leads</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={cn(
              'relative w-11 h-6 rounded-full transition-colors duration-200',
              notificationsEnabled ? 'bg-[#0073aa]' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
                notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        {saveMessage && (
          <span className="text-sm text-green-600 flex items-center gap-1 px-3 py-2 bg-green-50 rounded-lg">
            <Check size={14} />
            {saveMessage}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white',
            'hover:opacity-90 transition-opacity disabled:opacity-50'
          )}
          style={{ backgroundColor: '#0073aa' }}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Guardar Configuracion
        </button>
      </div>
    </div>
  )
}
