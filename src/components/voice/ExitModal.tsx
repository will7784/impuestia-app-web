import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface ExitModalProps {
  isOpen: boolean
  email: string
  onSubmit: (options: { ebooks: boolean; promotions: boolean; call: boolean; email: string }) => void
  onClose: () => void
}

export default function ExitModal({ isOpen, email, onSubmit, onClose }: ExitModalProps) {
  const [ebooks, setEbooks] = useState(true)
  const [promotions, setPromotions] = useState(true)
  const [call, setCall] = useState(false)
  const [emailValue, setEmailValue] = useState(email)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setVisible(true), 10)
      setEmailValue(email)
    } else {
      setVisible(false)
    }
  }, [isOpen, email])

  const handleSubmit = () => {
    onSubmit({ ebooks, promotions, call, email: emailValue })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          opacity: visible ? 1 : 0,
        }}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/[0.08] p-6 md:p-8"
        style={{
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          backdropFilter: 'blur(20px)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#b0b0b0] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <h3 className="text-white text-2xl md:text-[32px] font-bold mb-2">
          No te vayas todavia!
        </h3>
        <p className="text-[#b0b0b0] text-base mb-6">
          Te puedo enviar mas informacion y recursos utiles directo a tu correo. Sin compromiso.
        </p>

        {/* Checkboxes */}
        <div className="space-y-3 mb-6">
          <label
            className="flex items-center gap-3 cursor-pointer group"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
            }}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                ebooks
                  ? 'bg-[#ff3366] border-[#ff3366]'
                  : 'border-white/[0.3] group-hover:border-white/[0.5]'
              }`}
              onClick={() => setEbooks(!ebooks)}
            >
              {ebooks && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#b0b0b0] group-hover:text-white transition-colors">
              Recibir ebooks gratuitos sobre tributacion
            </span>
          </label>

          <label
            className="flex items-center gap-3 cursor-pointer group"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                promotions
                  ? 'bg-[#ff3366] border-[#ff3366]'
                  : 'border-white/[0.3] group-hover:border-white/[0.5]'
              }`}
              onClick={() => setPromotions(!promotions)}
            >
              {promotions && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#b0b0b0] group-hover:text-white transition-colors">
              Conocer promociones y descuentos
            </span>
          </label>

          <label
            className="flex items-center gap-3 cursor-pointer group"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
            }}
          >
            <div
              className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-200 ${
                call
                  ? 'bg-[#ff3366] border-[#ff3366]'
                  : 'border-white/[0.3] group-hover:border-white/[0.5]'
              }`}
              onClick={() => setCall(!call)}
            >
              {call && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span className="text-sm text-[#b0b0b0] group-hover:text-white transition-colors">
              Agendar una llamada gratuita
            </span>
          </label>
        </div>

        {/* Email */}
        <div className="mb-6">
          <input
            type="email"
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            placeholder="Tu correo electronico"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3
                       text-white text-sm placeholder:text-[#b0b0b0]/50
                       focus:outline-none focus:border-[#ff3366]/40 transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-full bg-[#ff3366] text-white text-sm font-bold uppercase tracking-wider
                     hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,51,102,0.4)]
                     active:scale-[0.98] transition-all duration-300 mb-3"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          Enviarme Recursos
        </button>

        {/* Close text */}
        <button
          onClick={onClose}
          className="w-full text-[#b0b0b0] text-sm hover:text-white transition-colors"
        >
          No gracias, prefiero salir
        </button>
      </div>
    </div>
  )
}
