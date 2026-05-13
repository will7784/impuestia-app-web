import { useState, useEffect } from 'react'
import {
  Linkedin,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  BarChart3,
  Eye,
  MousePointerClick,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Clock,
  FileText,
  Share2,
  Settings,
  Save,
  Loader2,
  Plus,
  Trash2,
  Star,
} from 'lucide-react'
import {
  getLinkedInPosts,
  getConnectionStatus,
  getTemplates,
  saveTemplate,
  deleteTemplate,
  setDefaultTemplate,
} from '@/lib/linkedin-service'
import type { LinkedInPost } from '@/lib/linkedin-service'
import type { LinkedInTemplate } from '@/lib/linkedin-service'
import { cn } from '@/lib/utils'

export default function LinkedInPanel() {
  const [posts, setPosts] = useState<LinkedInPost[]>([])
  const [status, setStatus] = useState<{ connected: boolean; accountName: string; lastSync: string }>({ connected: false, accountName: '', lastSync: '' })
  const [templates, setTemplates] = useState<LinkedInTemplate[]>([])
  const [activeTab, setActiveTab] = useState<'shares' | 'templates' | 'analytics'>('shares')
  const [isEditingTemplate, setIsEditingTemplate] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<LinkedInTemplate | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setPosts(getLinkedInPosts())
    const s = getConnectionStatus()
    setStatus({
      connected: s.connected,
      accountName: s.accountName || '',
      lastSync: s.lastSync || '',
    })
    setTemplates(getTemplates())
  }

  const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0)
  const totalClicks = posts.reduce((sum, p) => sum + p.clicks, 0)
  const totalReactions = posts.reduce((sum, p) => sum + p.reactions, 0)
  const totalComments = posts.reduce((sum, p) => sum + p.comments, 0)

  const handleSaveTemplate = async () => {
    if (!editingTemplate) return
    setIsSaving(true)
    await saveTemplate(editingTemplate)
    setTemplates(getTemplates())
    setIsEditingTemplate(false)
    setEditingTemplate(null)
    setIsSaving(false)
  }

  const handleDeleteTemplate = async (id: string) => {
    await deleteTemplate(id)
    setTemplates(getTemplates())
  }

  const handleSetDefault = async (id: string) => {
    await setDefaultTemplate(id)
    setTemplates(getTemplates())
  }

  const handleNewTemplate = () => {
    setEditingTemplate({
      id: `template_${Date.now()}`,
      name: 'Nueva Plantilla',
      content: '{title}\n\n{excerpt}\n\n{url}',
      isDefault: false,
    })
    setIsEditingTemplate(true)
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LinkedIn</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gestion de publicaciones en LinkedIn</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Connection status */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium',
            status.connected
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          )}>
            {status.connected ? (
              <>
                <CheckCircle2 size={16} />
                <span>Conectado: {status.accountName}</span>
              </>
            ) : (
              <>
                <XCircle size={16} />
                <span>No conectado</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Eye size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Impresiones</p>
              <p className="text-xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <MousePointerClick size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Clics</p>
              <p className="text-xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <ThumbsUp size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Reacciones</p>
              <p className="text-xl font-bold text-gray-900">{totalReactions.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <MessageCircle size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Comentarios</p>
              <p className="text-xl font-bold text-gray-900">{totalComments.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex items-center border-b" style={{ borderColor: '#e5e7eb' }}>
          <button
            onClick={() => setActiveTab('shares')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'shares'
                ? 'border-[#0073aa] text-[#0073aa]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <Share2 size={16} />
            Shares
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'templates'
                ? 'border-[#0073aa] text-[#0073aa]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <FileText size={16} />
            Plantillas
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
              activeTab === 'analytics'
                ? 'border-[#0073aa] text-[#0073aa]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            )}
          >
            <BarChart3 size={16} />
            Analytics
          </button>
        </div>

        <div className="p-5">
          {activeTab === 'shares' && (
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <Linkedin size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No hay publicaciones en LinkedIn aun</p>
                  <p className="text-xs text-gray-400 mt-1">Comparte un post desde la lista de posts para verlo aqui.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Post</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Fecha</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Estado</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Impresiones</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Clics</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">URL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: '#f0f2f5' }}>
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.blogPostTitle}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs mt-0.5">{post.shareText.substring(0, 60)}...</p>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(post.publishedAt).toLocaleDateString('es-CL')}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={cn(
                              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
                              post.status === 'published'
                                ? 'bg-green-100 text-green-700'
                                : post.status === 'scheduled'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-700'
                            )}>
                              {post.status === 'published' && <CheckCircle2 size={10} />}
                              {post.status === 'scheduled' && <Clock size={10} />}
                              {post.status === 'draft' && <XCircle size={10} />}
                              {post.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden sm:table-cell">
                            <span className="text-xs text-gray-600">{post.impressions.toLocaleString()}</span>
                          </td>
                          <td className="px-3 py-3 hidden sm:table-cell">
                            <span className="text-xs text-gray-600">{post.clicks.toLocaleString()}</span>
                          </td>
                          <td className="px-3 py-3">
                            <a
                              href={post.shareUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#0073aa] hover:underline"
                            >
                              <LinkIcon size={14} />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Personaliza las plantillas para generar posts de LinkedIn.</p>
                <button
                  onClick={handleNewTemplate}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#0073aa' }}
                >
                  <Plus size={16} />
                  Nueva Plantilla
                </button>
              </div>

              {/* Template variables help */}
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 space-y-1">
                <p className="font-medium text-gray-700">Variables disponibles:</p>
                <div className="flex flex-wrap gap-2">
                  {['{title}', '{excerpt}', '{url}', '{category}', '{author}'].map((v) => (
                    <code key={v} className="bg-white px-1.5 py-0.5 rounded border text-[#0073aa] font-mono" style={{ borderColor: '#e5e7eb' }}>{v}</code>
                  ))}
                </div>
              </div>

              {isEditingTemplate && editingTemplate && (
                <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">
                    {editingTemplate.id.startsWith('template_') && !templates.find((t) => t.id === editingTemplate.id)
                      ? 'Nueva Plantilla'
                      : 'Editar Plantilla'}
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
                      <input
                        type="text"
                        value={editingTemplate.name}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                        className="w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                        style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Plantilla</label>
                      <textarea
                        value={editingTemplate.content}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] resize-y font-mono"
                        style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveTemplate}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                        style={{ backgroundColor: '#0073aa' }}
                      >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingTemplate(false)
                          setEditingTemplate(null)
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-start gap-4 p-4 rounded-lg border transition-colors hover:bg-gray-50"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">{template.name}</p>
                        {template.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <Star size={10} />
                            Por defecto
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 font-mono truncate">{template.content}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!template.isDefault && (
                        <button
                          onClick={() => handleSetDefault(template.id)}
                          className="p-1.5 rounded-lg hover:bg-amber-50 text-gray-400 hover:text-amber-600 transition-colors"
                          title="Establecer como predeterminada"
                        >
                          <Star size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingTemplate(template)
                          setIsEditingTemplate(true)
                        }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-[#0073aa] transition-colors"
                        title="Editar"
                      >
                        <Settings size={14} />
                      </button>
                      {!template.isDefault && (
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-[#ef4444] transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 size={32} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No hay datos de analytics aun</p>
                </div>
              ) : (
                <>
                  {/* Per-post analytics */}
                  <div className="space-y-3">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="p-4 rounded-lg border"
                        style={{ borderColor: '#e5e7eb' }}
                      >
                        <p className="text-sm font-medium text-gray-900 mb-3">{post.blogPostTitle}</p>
                        <div className="grid grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Impresiones</p>
                            <p className="text-lg font-semibold text-gray-900">{post.impressions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Clics</p>
                            <p className="text-lg font-semibold text-gray-900">{post.clicks}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Reacciones</p>
                            <p className="text-lg font-semibold text-gray-900">{post.reactions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Comentarios</p>
                            <p className="text-lg font-semibold text-gray-900">{post.comments}</p>
                          </div>
                        </div>
                        {/* Mini bar chart */}
                        <div className="flex items-end gap-2 mt-3 h-16">
                          {[
                            { label: 'Imp.', value: post.impressions, color: '#3b82f6' },
                            { label: 'Clics', value: post.clicks, color: '#22c55e' },
                            { label: 'Reac.', value: post.reactions, color: '#a855f7' },
                            { label: 'Com.', value: post.comments, color: '#f59e0b' },
                          ].map((item) => {
                            const max = Math.max(post.impressions, 1)
                            return (
                              <div key={item.label} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                  className="w-full rounded-t"
                                  style={{
                                    height: `${Math.max((item.value / max) * 100, 8)}%`,
                                    backgroundColor: item.color,
                                  }}
                                />
                                <span className="text-[10px] text-gray-500">{item.label}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
