import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  FileText,
  Eye,
  FileClock,
  Users,
  Linkedin,
  TrendingUp,
  Plus,
  ArrowRight,
  Share2,
  FileCheck,
} from 'lucide-react'
import { getAllPosts } from '@/lib/blog-service'
import { getLinkedInPosts } from '@/lib/linkedin-service'
import { getLeads } from '@/lib/airtable-service'
import type { BlogPost } from '@/lib/blog-service'
import type { LinkedInPost } from '@/lib/linkedin-service'
import type { LeadRecord } from '@/lib/airtable-service'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: string
  color: string
  bgColor: string
}

function StatCard({ title, value, icon: Icon, trend, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <TrendingUp size={12} />
              {trend}
            </p>
          )}
        </div>
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  )
}

function MiniChart() {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
  const data = [120, 190, 150, 280, 220, 342]
  const max = Math.max(...data)

  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Eye size={16} className="text-[#0073aa]" />
        Vistas del Blog
      </h3>
      <div className="flex items-end gap-2 h-32">
        {data.map((value, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-md transition-all duration-300"
              style={{
                height: `${(value / max) * 100}%`,
                backgroundColor: i === data.length - 1 ? '#0073aa' : '#0073aa33',
                minHeight: '8px',
              }}
            />
            <span className="text-xs text-gray-500">{months[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CategoryChart() {
  const categories = [
    { name: 'Analisis Normativo', count: 12, color: '#0073aa' },
    { name: 'Defensa SII', count: 8, color: '#1e3a5f' },
    { name: 'Actualidad', count: 5, color: '#6b2d5c' },
    { name: 'Planificacion', count: 3, color: '#22c55e' },
  ]
  const max = Math.max(...categories.map((c) => c.count))

  return (
    <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <FileText size={16} className="text-[#0073aa]" />
        Posts por Categoria
      </h3>
      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">{cat.name}</span>
              <span className="font-medium text-gray-900">{cat.count}</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(cat.count / max) * 100}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ActivityItem({ icon: Icon, text, time, color }: { icon: React.ElementType; text: string; time: string; color: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: '#f0f2f5' }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={14} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 truncate">{text}</p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPost[]>([])
  const [leads, setLeads] = useState<LeadRecord[]>([])

  useEffect(() => {
    setPosts(getAllPosts())
    setLinkedInPosts(getLinkedInPosts())
    setLeads(getLeads())
  }, [])

  const totalPosts = posts.length
  const publishedPosts = posts.filter((p) => p.status === 'published').length
  const draftPosts = posts.filter((p) => p.status === 'draft').length
  const totalLeads = leads.length
  const linkedInShares = posts.filter((p) => p.linkedinShared).length

  const recentPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 3)
  const recentShares = [...linkedInPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Bienvenido al panel de administracion de ImpuestIA</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Posts"
          value={totalPosts}
          icon={FileText}
          color="#0073aa"
          bgColor="#0073aa15"
          trend="+2 este mes"
        />
        <StatCard
          title="Publicados"
          value={publishedPosts}
          icon={FileCheck}
          color="#22c55e"
          bgColor="#22c55e15"
        />
        <StatCard
          title="Borradores"
          value={draftPosts}
          icon={FileClock}
          color="#f59e0b"
          bgColor="#f59e0b15"
        />
        <StatCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          color="#6b2d5c"
          bgColor="#6b2d5c15"
          trend="+12%"
        />
        <StatCard
          title="LinkedIn Shares"
          value={linkedInShares}
          icon={Linkedin}
          color="#0077b5"
          bgColor="#0077b515"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MiniChart />
        <CategoryChart />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Acciones Rapidas</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/posts/new')}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white',
              'hover:opacity-90 transition-opacity duration-200'
            )}
            style={{ backgroundColor: '#0073aa' }}
          >
            <Plus size={16} />
            Nuevo Post
          </button>
          <button
            onClick={() => navigate('/admin/leads')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          >
            <Users size={16} />
            Ver Leads
          </button>
          <button
            onClick={() => navigate('/admin/linkedin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#e5e7eb', color: '#374151' }}
          >
            <Share2 size={16} />
            Compartir en LinkedIn
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-[#0073aa]" />
              Posts Recientes
            </h3>
            <button
              onClick={() => navigate('/admin/posts')}
              className="text-xs text-[#0073aa] hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recentPosts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No hay posts aun</p>
            ) : (
              recentPosts.map((post) => (
                <ActivityItem
                  key={post.id}
                  icon={post.status === 'published' ? FileCheck : FileClock}
                  text={post.title}
                  time={new Date(post.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })}
                  color={post.status === 'published' ? '#22c55e' : '#f59e0b'}
                />
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users size={16} className="text-[#6b2d5c]" />
              Leads Recientes
            </h3>
            <button
              onClick={() => navigate('/admin/leads')}
              className="text-xs text-[#0073aa] hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recentLeads.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No hay leads aun</p>
            ) : (
              recentLeads.map((lead) => (
                <ActivityItem
                  key={lead.id}
                  icon={Users}
                  text={`${lead.name} - ${lead.email}`}
                  time={new Date(lead.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  color="#6b2d5c"
                />
              ))
            )}
          </div>
        </div>

        {/* LinkedIn Shares */}
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Linkedin size={16} className="text-[#0077b5]" />
              LinkedIn Shares
            </h3>
            <button
              onClick={() => navigate('/admin/linkedin')}
              className="text-xs text-[#0073aa] hover:underline flex items-center gap-1"
            >
              Ver todos
              <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recentShares.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No hay shares aun</p>
            ) : (
              recentShares.map((share) => (
                <ActivityItem
                  key={share.id}
                  icon={Share2}
                  text={share.blogPostTitle}
                  time={new Date(share.publishedAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                  color="#0077b5"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
