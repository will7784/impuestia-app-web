import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface LeadCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, email: string) => void
}

export default function LeadCaptureModal({ isOpen, onClose, onSubmit }: LeadCaptureModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [visible, setVisible] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10)
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.trim()) {
      onSubmit(name.trim(), email.trim())
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{ backgroundColor: 'rgba(0,0,0,0.8)', opacity: visible ? 1 : 0 }}
      />
      <div
        ref={modalRef}
        className="relative w-full max-w-md transition-all duration-400"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="rounded-2xl p-8 border border-white/[0.08]" style={{ backgroundColor: '#0a0a0a' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#b0b0b0] hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          <h3 className="text-white text-2xl md:text-[32px] font-extrabold leading-tight mb-4">
            Obten tu Guia: Pasos Precisos Ante una Citacion del SII
          </h3>
          <p className="text-[#b0b0b0] text-base mb-6">
            Ingresa tu nombre y correo para recibir la guia gratuita y comenzar tu asesoria tributaria.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white text-base placeholder:text-[#666] focus:outline-none focus:border-[#ff3366]/50 transition-colors"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 0.5s ease 0.3s',
                }}
              />
              <input
                type="email"
                placeholder="Correo electronico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white text-base placeholder:text-[#666] focus:outline-none focus:border-[#ff3366]/50 transition-colors"
                style={{
                  opacity: visible ? 1 : 0,
                  transition: 'opacity 0.5s ease 0.4s',
                }}
              />
              <button
                type="submit"
                className="w-full bg-[#ff3366] text-white font-bold text-base py-4 rounded-xl hover:brightness-110 transition-all duration-300"
              >
                Siguiente &rarr;
              </button>
            </div>
          </form>

          <p className="text-[#b0b0b0] text-xs mt-4 text-center">
            Tus datos estan protegidos. Nunca compartimos tu informacion.
          </p>
        </div>
      </div>
    </div>
  )
}
