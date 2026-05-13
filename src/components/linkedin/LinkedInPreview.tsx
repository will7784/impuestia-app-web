import { useState } from 'react'
import type { BlogPost } from '@/lib/blog-data'
import { ThumbsUp, MessageCircle, Repeat, Send, MoreHorizontal, Globe } from 'lucide-react'

interface LinkedInPreviewProps {
  postText: string
  blogPost: BlogPost
  className?: string
}

export default function LinkedInPreview({
  postText,
  blogPost,
  className = '',
}: LinkedInPreviewProps) {
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const shouldTruncate = postText.length > 200
  const displayText = expanded || !shouldTruncate
    ? postText
    : postText.slice(0, 200) + '...'

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 max-w-[560px] mx-auto ${className}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0077B5] to-[#005885] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">I</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-[#1a1a1a] text-sm">ImpuestIA</span>
            <span className="text-gray-400 text-xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#0077B5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </span>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <span>Asesora Tributaria Inteligente</span>
          </div>
          <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <span>Ahora</span>
            <span>·</span>
            <Globe size={10} />
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post text */}
      <div className="px-4 pb-3">
        <p className="text-[#1a1a1a] text-sm whitespace-pre-wrap leading-relaxed">
          {displayText}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-gray-500 text-sm mt-1 hover:text-[#0077B5] transition-colors"
          >
            {expanded ? '...mostrar menos' : '...ver mas'}
          </button>
        )}
      </div>

      {/* Article preview card */}
      <div className="mx-4 mb-3 rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors">
        <div className={`h-40 w-full bg-gradient-to-br ${blogPost.imageGradient} flex items-center justify-center`}>
          <span className="text-white/60 text-sm font-medium">Imagen del articulo</span>
        </div>
        <div className="p-3">
          <h4 className="text-sm font-semibold text-[#1a1a1a] line-clamp-2">
            {blogPost.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{blogPost.excerpt}</p>
          <p className="text-xs text-gray-400 mt-1">impuestia.cl</p>
        </div>
      </div>

      {/* Reactions bar */}
      <div className="mx-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 rounded-full bg-[#0077B5] flex items-center justify-center">
              <ThumbsUp size={8} className="text-white" />
            </div>
            <div className="w-4 h-4 rounded-full bg-[#f4c23a] flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>
          <span>24</span>
        </div>
        <div className="flex items-center gap-3">
          <span>3 comentarios</span>
          <span>5 veces compartido</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mx-4 py-1 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
            liked
              ? 'text-[#0077B5] bg-[#0077B5]/10'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp size={18} className={liked ? 'fill-[#0077B5]' : ''} />
          <span>Recomendar</span>
        </button>
        <button className="flex items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
          <MessageCircle size={18} />
          <span>Comentar</span>
        </button>
        <button className="flex items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
          <Repeat size={18} />
          <span>Compartir</span>
        </button>
        <button className="flex items-center gap-2 py-2.5 px-4 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors">
          <Send size={18} />
          <span>Enviar</span>
        </button>
      </div>
    </div>
  )
}
