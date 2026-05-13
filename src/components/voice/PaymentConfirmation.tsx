import { useEffect, useState, useRef } from 'react'
import { Calendar, Download } from 'lucide-react'
import type { Plan } from '@/lib/claudia-engine'

interface PaymentConfirmationProps {
  plan: Plan
  email: string
  onScheduleConsultation: () => void
  onDownloadContract: () => void
  onClose: () => void
}

export default function PaymentConfirmation({
  plan,
  email,
  onScheduleConsultation,
  onDownloadContract,
}: PaymentConfirmationProps) {
  const [checkAnimated, setCheckAnimated] = useState(false)
  const [visible, setVisible] = useState(false)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setTimeout(() => {
      setCheckAnimated(true)
      setTimeout(() => setVisible(true), 300)
    }, 100)
  }, [])

  const transactionId = `WBP${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`
  const now = new Date().toLocaleString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-[5vw] py-12" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div className="mb-6 flex justify-center">
          <div
            className="w-16 h-16 rounded-full bg-[#ff3366]/10 border-2 border-[#ff3366] flex items-center justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <svg
              ref={svgRef}
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M8 16L14 22L24 10"
                stroke="#ff3366"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 30,
                  strokeDashoffset: checkAnimated ? 0 : 30,
                  transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-white text-3xl md:text-[40px] font-extrabold mb-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
          }}
        >
          Pago Exitoso
        </h2>

        {/* Message */}
        <p
          className="text-[#b0b0b0] text-lg mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
          }}
        >
          Bienvenido al <span className="text-white font-semibold">{plan.name}</span>. Ya eres parte de la familia de Asesoria Tributaria.
        </p>

        {/* Invoice card */}
        <div
          className="rounded-2xl border border-white/[0.08] p-6 mb-8 mx-auto"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(10px)',
            maxWidth: 400,
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.97)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <div className="text-left space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#b0b0b0]">Plan</span>
              <span className="text-sm text-white font-medium">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#b0b0b0]">Monto</span>
              <span className="text-sm text-white font-medium">{plan.price}</span>
            </div>
            <div className="h-px bg-white/[0.08]" />
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#b0b0b0]">Transaccion</span>
              <span className="text-xs text-white font-mono">{transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#b0b0b0]">Fecha</span>
              <span className="text-xs text-white">{now}</span>
            </div>
            <div className="h-px bg-white/[0.08]" />
            <div className="text-center">
              <span className="text-xs text-[#b0b0b0]">
                Comprobante enviado a {email}
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
          }}
        >
          <button
            onClick={onScheduleConsultation}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
                       border border-white/[0.3] text-white text-sm font-semibold
                       hover:border-[#ff3366] hover:bg-[#ff3366]/10
                       transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <Calendar size={16} />
            Programa tu primera consulta
          </button>

          <button
            onClick={onDownloadContract}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full
                       text-[#b0b0b0] text-sm font-medium
                       hover:text-white transition-colors duration-300"
          >
            <Download size={16} />
            Descarga tu contrato
          </button>
        </div>

        {/* Closing message */}
        <p
          className="text-[#b0b0b0] text-sm mt-8"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.8s ease 1s',
          }}
        >
          Fue un placer ayudarte! Tu asesor humano se pondra en contacto en menos de 24 horas. Cualquier duda, aqui estoy.
        </p>
      </div>
    </div>
  )
}
