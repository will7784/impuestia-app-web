import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText } from 'lucide-react'
import { seedInitialData, getCategories, searchPosts, getPostsByCategory } from '@/lib/blog-service'
import { getCategoryColor } from '@/lib/blog-service'
import BlogCard from '@/components/blog/BlogCard'
import type { BlogPost, BlogCategory } from '@/lib/blog-service'

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Todas')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  useEffect(() => {
    seedInitialData()
    setCategories(getCategories())
    setPosts(getPostsByCategory('Todas'))
  }, [])

  const filteredPosts = useMemo(() => {
    if (searchQuery.trim()) {
      return searchPosts(searchQuery)
    }
    return getPostsByCategory(activeCategory)
  }, [searchQuery, activeCategory])

  useEffect(() => {
    setPosts(filteredPosts)
  }, [filteredPosts])

  const handleCategoryClick = useCallback((catName: string) => {
    setActiveCategory(catName)
    setSearchQuery('')
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <div className="min-h-[100dvh]">
      {/* Header Section */}
      <section
        className="relative pt-32 pb-16 md:pt-40 md:pb-20"
        style={{ backgroundColor: '#1e3a5f' }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ backgroundColor: '#0073aa' }}
          />
          <div
            className="absolute -bottom-1/4 -left-1/4 w-[400px] h-[400px] rounded-full opacity-8"
            style={{ backgroundColor: '#6b2d5c' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="max-w-[1200px] mx-auto px-[5vw] relative z-10 text-center"
        >
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#b0d4f0' }}
          >
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Blog ImpuestIA
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: '#b0d4f0' }}>
            Análisis, guías y consejos sobre el mundo tributario chileno
          </p>
        </motion.div>
      </section>

      {/* Search Bar */}
      <section className="py-8 md:py-10" style={{ backgroundColor: '#f0f2f5' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="max-w-[1200px] mx-auto px-[5vw]"
        >
          <div className="relative max-w-xl mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#4a4a5a' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Buscar artículos..."
              className="w-full pl-11 pr-4 py-3.5 rounded-full border border-gray-200 bg-white text-[#1a1a2e] text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0073aa40] focus:border-[#0073aa] transition-all duration-200 shadow-sm"
            />
          </div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="pb-8" style={{ backgroundColor: '#f0f2f5' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="max-w-[1200px] mx-auto px-[5vw]"
        >
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.name
              const catColor = cat.slug === 'todas' ? '#0073aa' : getCategoryColor(cat.name)
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: isActive ? catColor : 'white',
                    color: isActive ? 'white' : '#4a4a5a',
                    border: `1px solid ${isActive ? catColor : '#e0e0e0'}`,
                    boxShadow: isActive ? `0 2px 8px ${catColor}30` : '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  {cat.name}
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#f0f2f5',
                      color: isActive ? 'white' : '#4a4a5a',
                    }}
                  >
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Posts Grid */}
      <section className="pb-20" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="max-w-[1200px] mx-auto px-[5vw]">
          <AnimatePresence mode="wait">
            {posts.length > 0 ? (
              <motion.div
                key={`${activeCategory}-${searchQuery}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
              >
                {posts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: '#e8e8f0' }}
                >
                  <FileText size={32} style={{ color: '#4a4a5a' }} />
                </div>
                <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">
                  No se encontraron artículos
                </h3>
                <p className="text-sm" style={{ color: '#4a4a5a' }}>
                  {searchQuery
                    ? 'Intenta con otra búsqueda o cambia los filtros'
                    : 'No hay artículos en esta categoría todavía'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
