import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'

interface LeadCaptureFABProps {
  onOpen: () => void
}

export default function LeadCaptureFAB({ onOpen }: LeadCaptureFABProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-40 bg-[#ff3366] text-white px-6 py-4 rounded-full font-bold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(255,51,102,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'fadeInUp 0.4s ease-out',
      }}
    >
      <MessageCircle size={18} />
      Descargar Guia
    </button>
  )
}
