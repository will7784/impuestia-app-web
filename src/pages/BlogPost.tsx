import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, Calendar, Tag, FileText } from 'lucide-react'
import { seedInitialData, getPostBySlug, getRelatedPosts, getCategoryColor, formatDate } from '@/lib/blog-service'
import type { BlogPost } from '@/lib/blog-service'
import MarkdownRenderer from '@/components/blog/MarkdownRenderer'
import ShareButtons from '@/components/blog/ShareButtons'
import BlogCard from '@/components/blog/BlogCard'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    seedInitialData()
    window.scrollTo({ top: 0, behavior: 'instant' })
    // Small delay to allow seeding
    setTimeout(() => setIsLoaded(true), 50)
  }, [slug])

  const post = useMemo(() => {
    if (!slug) return undefined
    return getPostBySlug(slug)
  }, [slug, isLoaded])

  const relatedPosts = useMemo(() => {
    if (!post) return []
    return getRelatedPosts(post.slug, post.category, 3)
  }, [post])

  const categoryColor = post ? getCategoryColor(post.category) : '#0073aa'

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="w-8 h-8 border-2 border-[#0073aa] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="text-center">
          <FileText size={48} className="mx-auto mb-4" style={{ color: '#4a4a5a' }} />
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Artículo no encontrado</h1>
          <p className="text-sm mb-6" style={{ color: '#4a4a5a' }}>
            El artículo que buscas no existe o ha sido movido.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#0073aa' }}
          >
            <ArrowLeft size={16} />
            Volver al blog
          </Link>
        </div>
      </div>
    )
  }

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/blog/${post.slug}` : `https://impuestia.cl/blog/${post.slug}`

  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Hero Banner */}
      <section
        className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${categoryColor}18, ${categoryColor}30)`,
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${categoryColor}30, transparent 70%)`,
              transform: 'translate(30%, -30%)',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full"
            style={{
              background: `radial-gradient(circle, ${categoryColor}20, transparent 70%)`,
              transform: 'translate(-30%, 30%)',
            }}
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-[5vw] relative z-10">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors duration-200 hover:opacity-80"
              style={{ color: '#0073aa' }}
            >
              <ArrowLeft size={16} />
              Volver al blog
            </Link>
          </motion.div>

          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span
              className="inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4"
              style={{
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
                border: `1px solid ${categoryColor}30`,
              }}
            >
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#1a1a2e] max-w-3xl leading-tight tracking-tight mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap items-center gap-4 md:gap-6 text-sm"
            style={{ color: '#4a4a5a' }}
          >
            <span className="flex items-center gap-1.5">
              <User size={14} style={{ color: '#0073aa' }} />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} style={{ color: '#0073aa' }} />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} style={{ color: '#0073aa' }} />
              {post.readTime} min de lectura
            </span>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-10 md:py-16">
        <div className="max-w-[1200px] mx-auto px-[5vw]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12"
          >
            <MarkdownRenderer content={post.content} />
          </motion.div>
        </div>
      </section>

      {/* Tags Section */}
      <section className="pb-10 md:pb-14">
        <div className="max-w-[1200px] mx-auto px-[5vw]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag size={16} style={{ color: '#0073aa' }} />
              <span className="text-sm font-semibold text-[#1a1a2e]">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: '#f0f2f5',
                    color: '#4a4a5a',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Share Section */}
      <section className="pb-14 md:pb-20">
        <div className="max-w-[1200px] mx-auto px-[5vw]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <h3 className="text-lg font-bold text-[#1a1a2e] mb-4">
                Compartir artículo
              </h3>
              <ShareButtons url={currentUrl} title={post.title} excerpt={post.excerpt} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="pb-16 md:pb-24">
          <div className="max-w-[1200px] mx-auto px-[5vw]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">
                Artículos relacionados
              </h2>
              <p className="text-sm mb-8" style={{ color: '#4a4a5a' }}>
                Más contenido sobre {post.category}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((related: BlogPost, index: number) => (
                  <BlogCard key={related.id} post={related} index={index} variant="compact" />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="pb-16">
        <div className="max-w-[1200px] mx-auto px-[5vw] text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: '#0073aa' }}
            >
              <ArrowLeft size={16} />
              Ver todos los artículos
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
