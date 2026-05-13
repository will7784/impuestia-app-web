import { useState, useCallback } from 'react'
import { Outlet, useNavigate } from 'react-router'
import Navbar from './Navbar'
import Footer from './Footer'
import LeadCaptureModal from './LeadCaptureModal'

export default function Layout() {
  const [leadModalOpen, setLeadModalOpen] = useState(false)
  const navigate = useNavigate()

  const openLeadModal = useCallback(() => {
    setLeadModalOpen(true)
  }, [])

  const closeLeadModal = useCallback(() => {
    setLeadModalOpen(false)
  }, [])

  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navbar onOpenLeadModal={openLeadModal} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LeadCaptureModal
        isOpen={leadModalOpen}
        onClose={closeLeadModal}
        onSubmit={(name: string, email: string) => {
          navigate(`/agent?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`)
        }}
      />
    </div>
  )
}
