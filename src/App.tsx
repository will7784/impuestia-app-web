import { Routes, Route, Navigate } from 'react-router'
import Layout from './components/Layout'
import Home from './pages/Home'
import Agent from './pages/Agent'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Admin from './pages/Admin'
import AdminLogin from './components/admin/AdminLogin'

// Route guard component for admin routes
function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem('impuestia_admin_token')
  return isAuth ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public routes with Layout (Navbar + Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Route>

      {/* ClaudIA agent (no Layout, fullscreen) */}
      <Route path="/agent" element={<Agent />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
    </Routes>
  )
}
