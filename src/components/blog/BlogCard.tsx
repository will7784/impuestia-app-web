import { motion } from 'framer-motion'
import { Clock, User, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import type { BlogPost } from '@/lib/blog-service'
import { getCategoryColor, formatDate } from '@/lib/blog-service'

interface BlogCardProps {
  post: BlogPost
  index?: number
  variant?: 'default' | 'compact'
}

export default function BlogCard({ post, index = 0, variant = 'default' }: BlogCardProps) {
  const categoryColor = getCategoryColor(post.category)

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
      >
        <Link
          to={`/blog/${post.slug}`}
          className="group block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <div
            className="h-32 flex items-center justify-center relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}22, ${categoryColor}44)`,
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: `radial-gradient(circle at 30% 70%, ${categoryColor}, transparent)`,
              }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full relative z-10"
              style={{
                backgroundColor: `${categoryColor}18`,
                color: categoryColor,
              }}
            >
              {post.category}
            </span>
          </div>
          <div className="p-4">
            <h3 className="text-sm font-bold text-[#1a1a2e] leading-snug group-hover:text-[#0073aa] transition-colors duration-200 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#4a4a5a]">
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {post.readTime} min
              </span>
              <span>{formatDate(post.date)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="group"
    >
      <Link
        to={`/blog/${post.slug}`}
        className="block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        {/* Featured image placeholder */}
        <div
          className="h-48 flex items-center justify-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${categoryColor}18, ${categoryColor}35)`,
          }}
        >
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: `radial-gradient(circle at 20% 80%, ${categoryColor}, transparent 70%)`,
            }}
          />
          <span
            className="text-xs font-semibold uppercase tracking-wider px-4 py-1.5 rounded-full relative z-10"
            style={{
              backgroundColor: `${categoryColor}15`,
              color: categoryColor,
              border: `1px solid ${categoryColor}30`,
            }}
          >
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-lg font-bold text-[#1a1a2e] leading-tight group-hover:text-[#0073aa] transition-colors duration-200 mb-2">
            {post.title}
          </h2>

          <p className="text-sm text-[#4a4a5a] leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between text-xs text-[#4a4a5a]">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <User size={12} />
                {post.author}
              </span>
              <span>{formatDate(post.date)}</span>
            </div>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime} min
            </span>
          </div>

          <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: '#0073aa' }}>
            Leer más
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
