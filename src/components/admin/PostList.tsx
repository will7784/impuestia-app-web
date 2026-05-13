import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  FileText,
  Edit3,
  Trash2,
  Linkedin,
  Eye,
  Search,
  Filter,
  ChevronDown,
  Share2,
  AlertCircle,
} from 'lucide-react'
import { getAllPosts, deletePost, bulkDeletePosts, markPostAsSharedOnLinkedIn } from '@/lib/blog-service'
import { generateAutoPostText, publishToLinkedIn } from '@/lib/linkedin-service'
import type { BlogPost } from '@/lib/blog-service'
import { cn } from '@/lib/utils'

export default function PostList() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    setPosts(getAllPosts())
  }, [])

  const categories = [...new Set(posts.map((p) => p.category))]

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const handleDelete = async (id: string) => {
    setDeleteTarget(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return
    if (selectedIds.length > 1 && deleteTarget === 'bulk') {
      await bulkDeletePosts(selectedIds)
      setSelectedIds([])
    } else {
      await deletePost(deleteTarget)
    }
    setPosts(getAllPosts())
    setShowDeleteConfirm(false)
    setDeleteTarget(null)
  }

  const handleShareLinkedIn = async (post: BlogPost) => {
    const text = generateAutoPostText(post)
    await publishToLinkedIn(post.id, text)
    await markPostAsSharedOnLinkedIn(post.id, text)
    setPosts(getAllPosts())
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPosts.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredPosts.map((p) => p.id))
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredPosts.length} entradas encontradas</p>
        </div>
        <button
          onClick={() => navigate('/admin/posts/new')}
          className={cn(
            'flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white',
            'hover:opacity-90 transition-opacity duration-200'
          )}
          style={{ backgroundColor: '#0073aa' }}
        >
          <FileText size={16} />
          Nuevo Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border p-4" style={{ borderColor: '#e5e7eb' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por titulo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')}
              className="h-10 pl-9 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] appearance-none cursor-pointer"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            >
              <option value="all">Todos los estados</option>
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 pl-9 pr-8 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] appearance-none cursor-pointer"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            >
              <option value="all">Todas las categorias</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Bulk actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: '#f0f2f5' }}>
            <span className="text-sm text-gray-600">{selectedIds.length} seleccionados</span>
            <button
              onClick={() => {
                setDeleteTarget('bulk')
                setShowDeleteConfirm(true)
              }}
              className="text-sm text-[#ef4444] hover:bg-[#ef4444]/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <FileText size={24} className="text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-medium mb-1">No hay posts</h3>
            <p className="text-sm text-gray-500">Comienza creando tu primera entrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredPosts.length && filteredPosts.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Titulo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Autor</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Fecha</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">LinkedIn</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#f0f2f5' }}>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        className="rounded border-gray-300 text-[#0073aa] focus:ring-[#0073aa]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 max-w-xs truncate">{post.title}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-600">{post.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-600">{post.author}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">
                        {new Date(post.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          post.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        )}
                      >
                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {post.linkedinShared ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <Share2 size={12} />
                          Si
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-[#0073aa] transition-colors"
                          title="Editar"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-[#ef4444] transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={15} />
                        </button>
                        {!post.linkedinShared && (
                          <button
                            onClick={() => handleShareLinkedIn(post)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-[#0077b5] transition-colors"
                            title="Compartir en LinkedIn"
                          >
                            <Linkedin size={15} />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                          title="Ver"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle size={20} className="text-[#ef4444]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminacion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              {deleteTarget === 'bulk'
                ? `Estas seguro de eliminar ${selectedIds.length} posts? Esta accion no se puede deshacer.`
                : 'Estas seguro de eliminar este post? Esta accion no se puede deshacer.'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteTarget(null)
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#ef4444] hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
