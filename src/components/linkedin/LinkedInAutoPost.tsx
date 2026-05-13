import { useState, useCallback } from 'react'
import type { BlogPost } from '@/lib/blog-data'
import {
  generateAutoPostText,
  publishToLinkedIn,
  scheduleLinkedInPost,
  getLinkedInConnectionStatus,
} from '@/lib/linkedin-service'
import LinkedInPreview from './LinkedInPreview'
import { Linkedin, Calendar, Send, Sparkles, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface LinkedInAutoPostProps {
  blogPost: BlogPost
}

export default function LinkedInAutoPost({ blogPost }: LinkedInAutoPostProps) {
  const [postText, setPostText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const connectionStatus = getLinkedInConnectionStatus()
  const charCount = postText.length
  const charLimit = 3000
  const isOverLimit = charCount > charLimit

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      const generated = generateAutoPostText({
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        category: blogPost.category,
        tags: blogPost.tags,
      })
      setPostText(generated)
      setIsGenerating(false)
    }, 600)
  }, [blogPost])

  const handlePublish = useCallback(async () => {
    if (!postText.trim() || isOverLimit) return
    setIsPublishing(true)
    setFeedback(null)

    try {
      await publishToLinkedIn(blogPost.id, blogPost.title, postText)
      setFeedback({
        type: 'success',
        message: 'Publicacion exitosa en LinkedIn!',
      })
    } catch {
      setFeedback({
        type: 'error',
        message: 'Error al publicar. Intentalo de nuevo.',
      })
    } finally {
      setIsPublishing(false)
    }
  }, [postText, isOverLimit, blogPost])

  const handleSchedule = useCallback(() => {
    if (!postText.trim() || isOverLimit || !scheduledDate) return
    setIsScheduling(true)

    try {
      scheduleLinkedInPost(blogPost.id, blogPost.title, scheduledDate, postText)
      setFeedback({
        type: 'success',
        message: `Publicacion programada para ${new Date(scheduledDate).toLocaleString('es-CL')}`,
      })
      setShowSchedulePicker(false)
    } catch {
      setFeedback({
        type: 'error',
        message: 'Error al programar la publicacion.',
      })
    } finally {
      setIsScheduling(false)
    }
  }, [postText, isOverLimit, scheduledDate, blogPost])

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Connection status */}
      <div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg mb-4 text-sm ${
          connectionStatus === 'connected'
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : connectionStatus === 'pending'
              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}
      >
        {connectionStatus === 'connected' ? (
          <>
            <CheckCircle size={16} />
            <span>Conectado a LinkedIn</span>
          </>
        ) : connectionStatus === 'pending' ? (
          <>
            <Clock size={16} />
            <span>Conexion pendiente</span>
          </>
        ) : (
          <>
            <AlertCircle size={16} />
            <span>No conectado a LinkedIn (modo simulado)</span>
          </>
        )}
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={`flex items-center gap-2 px-4 py-3 rounded-lg mb-4 text-sm ${
            feedback.type === 'success'
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Text editor */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-[#b0b0b0] mb-2">
          Texto de la publicacion
        </label>
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Escribe o genera el texto para tu publicacion de LinkedIn..."
          rows={6}
          className="w-full bg-[rgba(255,255,255,0.03)] border border-white/[0.08] rounded-lg px-4 py-3 text-white text-sm placeholder:text-[#b0b0b0]/50 focus:outline-none focus:border-[#0077B5]/50 focus:ring-1 focus:ring-[#0077B5]/30 resize-none transition-all"
        />
        <div className="flex justify-between mt-2">
          <span
            className={`text-xs ${
              isOverLimit ? 'text-red-400' : 'text-[#b0b0b0]/60'
            }`}
          >
            {charCount} / {charLimit} caracteres
          </span>
          {isOverLimit && (
            <span className="text-xs text-red-400">
              Excedes el limite de LinkedIn
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-white/[0.08] text-[#b0b0b0] text-sm font-medium hover:border-[#0077B5]/30 hover:text-white transition-all disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          Generar del articulo
        </button>

        <button
          onClick={handlePublish}
          disabled={!postText.trim() || isOverLimit || isPublishing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 hover:brightness-110"
          style={{ backgroundColor: '#0077B5' }}
        >
          {isPublishing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send size={16} />
          )}
          Publicar ahora
        </button>

        <button
          onClick={() => setShowSchedulePicker(!showSchedulePicker)}
          disabled={!postText.trim() || isOverLimit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[rgba(255,255,255,0.05)] border border-white/[0.08] text-[#b0b0b0] text-sm font-medium hover:border-[#0077B5]/30 hover:text-white transition-all disabled:opacity-50"
        >
          <Calendar size={16} />
          Programar
        </button>
      </div>

      {/* Schedule picker */}
      {showSchedulePicker && (
        <div className="mb-6 p-4 rounded-lg bg-[rgba(255,255,255,0.03)] border border-white/[0.08]">
          <label className="block text-sm text-[#b0b0b0] mb-2">
            Fecha y hora de publicacion
          </label>
          <div className="flex gap-3">
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="flex-1 bg-[rgba(255,255,255,0.05)] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#0077B5]/50"
            />
            <button
              onClick={handleSchedule}
              disabled={!scheduledDate || isScheduling}
              className="px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 hover:brightness-110"
              style={{ backgroundColor: '#0077B5' }}
            >
              {isScheduling ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Confirmar'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {postText.trim() && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Linkedin size={18} style={{ color: '#0077B5' }} />
            <h3 className="text-sm font-semibold text-[#b0b0b0]">
              Vista previa en LinkedIn
            </h3>
          </div>
          <LinkedInPreview postText={postText} blogPost={blogPost} />
        </div>
      )}
    </div>
  )
}
