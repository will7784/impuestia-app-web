import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router'
import { isAuthenticated } from '@/lib/auth-service'
import AdminLayout from '@/components/admin/AdminLayout'
import AdminLogin from '@/components/admin/AdminLogin'
import AdminDashboard from '@/components/admin/AdminDashboard'
import PostList from '@/components/admin/PostList'
import PostEditor from '@/components/admin/PostEditor'
import LeadList from '@/components/admin/LeadList'
import LinkedInPanel from '@/components/admin/LinkedInPanel'
import AdminSettings from '@/components/admin/AdminSettings'

function AdminRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authChecked, setAuthChecked] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthenticated(authed)
    setAuthChecked(true)

    if (!authed && !location.pathname.includes('/admin/login')) {
      navigate('/admin/login')
    }
  }, [location.pathname, navigate])

  if (!authChecked) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="w-8 h-8 border-2 border-[#0073aa] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="*" element={<AdminLogin />} />
      </Routes>
    )
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/new" element={<PostEditor />} />
        <Route path="/posts/edit/:id" element={<PostEditor />} />
        <Route path="/leads" element={<LeadList />} />
        <Route path="/linkedin" element={<LinkedInPanel />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="*" element={<AdminDashboard />} />
      </Routes>
    </AdminLayout>
  )
}

export default function Admin() {
  return (
    <div className="min-h-[100dvh]" style={{ backgroundColor: '#f0f2f5' }}>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route path="*" element={<AdminRoutes />} />
      </Routes>
    </div>
  )
}
