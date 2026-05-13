import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
  Save,
  Eye,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  ChevronLeft,
  Linkedin,
  Loader2,
  Check,
  Sparkles,
  FileText,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { getPostById, savePost, generateSlug, getCategories } from '@/lib/blog-service'
import { generateAutoPostText, publishToLinkedIn } from '@/lib/linkedin-service'
import { markPostAsSharedOnLinkedIn } from '@/lib/blog-service'
import type { BlogPost } from '@/lib/blog-service'
import { cn } from '@/lib/utils'

export default function PostEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = !!id

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [featuredImage, setFeaturedImage] = useState('')
  const [status, setStatus] = useState<'published' | 'draft'>('draft')
  const [linkedInText, setLinkedInText] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [saveMessage, setSaveMessage] = useState('')
  const [isPublishingLinkedIn, setIsPublishingLinkedIn] = useState(false)

  const categories = getCategories()
  const linkedInCharCount = linkedInText.length
  const linkedInMax = 3000

  useEffect(() => {
    if (isEdit && id) {
      const post = getPostById(id)
      if (post) {
        setTitle(post.title)
        setSlug(post.slug)
        setCategory(post.category)
        setTags(post.tags.join(', '))
        setExcerpt(post.excerpt)
        setContent(post.content)
        setFeaturedImage(post.imageUrl || '')
        setStatus(post.status)
        setLinkedInText(post.linkedinShareText || '')
      }
    }
  }, [isEdit, id])

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value)
    if (!isEdit) {
      setSlug(generateSlug(value))
    }
  }, [isEdit])

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.substring(start, end)
    const newText = content.substring(0, start) + before + selected + after + content.substring(end)
    setContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  const handleGenerateLinkedIn = () => {
    const draftPost = {
      title,
      excerpt,
      content,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    }
    const generated = generateAutoPostText(draftPost)
    setLinkedInText(generated)
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setIsSaving(true)

    try {
      await savePost({
        id: isEdit ? id : undefined,
        title,
        slug,
        excerpt,
        content,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        author: 'contacto@impuestia.cl',
        authorEmail: 'contacto@impuestia.cl',
        readTime: Math.ceil(content.split(/\s+/).length / 200),
        imageUrl: featuredImage || undefined,
        status,
        linkedinShared: false,
        linkedinShareText: linkedInText || undefined,
      })

      setSaveMessage(isEdit ? 'Post actualizado correctamente' : 'Post creado correctamente')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch {
      setSaveMessage('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleShareLinkedIn = async () => {
    if (!id || !linkedInText.trim()) return
    setIsPublishingLinkedIn(true)
    try {
      await publishToLinkedIn(id, linkedInText)
      await markPostAsSharedOnLinkedIn(id, linkedInText)
      setSaveMessage('Publicado en LinkedIn correctamente')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch {
      setSaveMessage('Error al publicar en LinkedIn')
    } finally {
      setIsPublishingLinkedIn(false)
    }
  }

  const previewPost: Partial<BlogPost> = {
    title,
    slug,
    excerpt,
    content,
    category,
    tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    author: 'contacto@impuestia.cl',
    authorEmail: 'contacto@impuestia.cl',
    date: new Date().toISOString().split('T')[0],
    readTime: Math.max(1, Math.ceil(content.split(' ').length / 200)),
    imageUrl: featuredImage || undefined,
    status,
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEdit ? 'Editar Post' : 'Nueva Entrada'}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-sm text-green-600 flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-lg">
              <Check size={14} />
              {saveMessage}
            </span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white',
              'hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            style={{ backgroundColor: '#0073aa' }}
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar
          </button>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className={cn('grid gap-4', showPreview ? 'lg:grid-cols-2' : 'grid-cols-1')}>
        {/* Editor Panel */}
        <div className="space-y-4">
          {/* Basic info */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Informacion Basica</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Titulo</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titulo del post"
                  className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                  style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-amigable-del-post"
                  className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                  style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                    style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                  >
                    <option value="">Seleccionar categoria</option>
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                    <option value="nueva">+ Nueva categoria</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Tags (separados por coma)</label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="tag1, tag2, tag3"
                    className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
                    style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Extracto</h3>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descripcion del post (aparece en listados)..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] resize-none"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            />
          </div>

          {/* Content Editor */}
          <div className="bg-white rounded-xl border" style={{ borderColor: '#e5e7eb' }}>
            <div className="px-4 py-2 border-b flex items-center gap-1 flex-wrap" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
              <span className="text-xs font-medium text-gray-500 mr-2">Contenido</span>
              <button
                onClick={() => insertMarkdown('**', '**')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Negrita"
              >
                <Bold size={14} />
              </button>
              <button
                onClick={() => insertMarkdown('*', '*')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Cursiva"
              >
                <Italic size={14} />
              </button>
              <button
                onClick={() => insertMarkdown('## ', '')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Encabezado"
              >
                <Heading size={14} />
              </button>
              <button
                onClick={() => insertMarkdown('- ', '')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Lista"
              >
                <List size={14} />
              </button>
              <button
                onClick={() => insertMarkdown('1. ', '')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Lista numerada"
              >
                <ListOrdered size={14} />
              </button>
              <button
                onClick={() => insertMarkdown('[', '](url)')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Enlace"
              >
                <LinkIcon size={14} />
              </button>
              <button
                onClick={() => insertMarkdown('![](', ')')}
                className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors"
                title="Imagen"
              >
                <ImageIcon size={14} />
              </button>
            </div>
            <textarea
              id="content-editor"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe el contenido en Markdown..."
              rows={16}
              className="w-full px-4 py-3 text-sm focus:outline-none resize-y font-mono"
              style={{ backgroundColor: '#f9fafb' }}
            />
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Imagen Destacada</h3>
            <input
              type="text"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="URL de la imagen destacada"
              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa]"
              style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
            />
            {featuredImage && (
              <div className="mt-3 rounded-lg overflow-hidden border" style={{ borderColor: '#e5e7eb' }}>
                <img src={featuredImage} alt="Preview" className="w-full h-40 object-cover" />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Estado</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStatus('draft')}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all',
                  status === 'draft'
                    ? 'border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                )}
              >
                Borrador
              </button>
              <button
                onClick={() => setStatus('published')}
                className={cn(
                  'flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all',
                  status === 'published'
                    ? 'border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                )}
              >
                Publicado
              </button>
            </div>
          </div>

          {/* LinkedIn Section */}
          <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-2 mb-4">
              <Linkedin size={18} style={{ color: '#0077b5' }} />
              <h3 className="text-sm font-semibold text-gray-900">LinkedIn</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-gray-500">Texto para compartir</label>
                  <span className={cn(
                    'text-xs font-medium',
                    linkedInCharCount > linkedInMax ? 'text-red-500' : 'text-gray-400'
                  )}>
                    {linkedInCharCount}/{linkedInMax}
                  </span>
                </div>
                <textarea
                  value={linkedInText}
                  onChange={(e) => setLinkedInText(e.target.value)}
                  placeholder="Texto personalizado para LinkedIn..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#0073aa] resize-none"
                  style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateLinkedIn}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0077b5] bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <Sparkles size={12} />
                  Generar desde contenido
                </button>
                {isEdit && linkedInText && (
                  <button
                    onClick={handleShareLinkedIn}
                    disabled={isPublishingLinkedIn}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#0077b5] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isPublishingLinkedIn ? <Loader2 size={12} className="animate-spin" /> : <Linkedin size={12} />}
                    Publicar en LinkedIn
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border p-6 sticky top-4" style={{ borderColor: '#e5e7eb' }}>
              <div className="flex items-center gap-2 mb-5">
                <Eye size={16} className="text-[#0073aa]" />
                <h3 className="text-sm font-semibold text-gray-900">Vista Previa</h3>
              </div>

              {previewPost.title ? (
                <article className="space-y-4">
                  {previewPost.imageUrl && (
                    <img
                      src={previewPost.imageUrl}
                      alt=""
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    {previewPost.category && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-2"
                        style={{ backgroundColor: '#0073aa15', color: '#0073aa' }}
                      >
                        {previewPost.category}
                      </span>
                    )}
                    <h1 className="text-xl font-bold text-gray-900">{previewPost.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>{previewPost.author}</span>
                      <span>·</span>
                      <span>{new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  {previewPost.excerpt && (
                    <p className="text-sm text-gray-600 italic border-l-2 pl-3" style={{ borderColor: '#0073aa' }}>
                      {previewPost.excerpt}
                    </p>
                  )}
                  {previewPost.content && (
                    <div className="prose prose-sm max-w-none text-gray-800">
                      <ReactMarkdown>{previewPost.content}</ReactMarkdown>
                    </div>
                  )}
                  {previewPost.tags && previewPost.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 border-t" style={{ borderColor: '#f0f2f5' }}>
                      {previewPost.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm">
                  <FileText size={32} className="mx-auto mb-3 opacity-40" />
                  <p>Empieza a escribir para ver la preview</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
