import { useState, useEffect, useRef } from 'react'
import { Lock, CreditCard } from 'lucide-react'
import { PLANS, type Plan } from '@/lib/claudia-engine'

interface PaymentPanelProps {
  onSelectPlan: (planName: string) => void
  onPaymentComplete: (plan: Plan) => void
}

export default function PaymentPanel({ onSelectPlan, onPaymentComplete }: PaymentPanelProps) {
  const [processingPlan, setProcessingPlan] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  const handlePayment = async (plan: Plan) => {
    setProcessingPlan(plan.id)
    onSelectPlan(plan.name)

    // Mock WebPay flow
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setProcessingPlan(null)
    onPaymentComplete(plan)
  }

  return (
    <div
      ref={containerRef}
      className="w-full"
    >
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
        Planes de Asesoria
      </h3>

      <div className="space-y-3">
        {PLANS.map((plan, index) => (
          <div
            key={plan.id}
            className="rounded-xl border border-white/[0.08] p-4 transition-all duration-500 hover:border-[#ff3366]/30"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(30px)',
              transitionDelay: `${index * 100}ms`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-semibold text-white">{plan.name}</h4>
                <p className="text-xs text-[#b0b0b0] mt-0.5">{plan.description}</p>
              </div>
              <span className="text-lg font-bold text-[#ff3366] whitespace-nowrap">
                {plan.price}
              </span>
            </div>

            <ul className="space-y-1 mb-3">
              {plan.features.map((feature) => (
                <li key={feature} className="text-xs text-[#b0b0b0] flex items-center gap-1.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill="#ff3366" opacity="0.3" />
                    <path d="M3 5L4.5 6.5L7 4" stroke="#ff3366" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handlePayment(plan)}
              disabled={!!processingPlan}
              className="w-full py-2.5 rounded-full bg-[#ff3366] text-white text-sm font-semibold
                         flex items-center justify-center gap-2
                         hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,51,102,0.4)]
                         active:scale-[0.98]
                         disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed
                         transition-all duration-300"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              {processingPlan === plan.id ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <CreditCard size={14} />
                  Pagar Ahora
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Secure badge */}
      <div className="flex items-center justify-center gap-1.5 mt-3 text-[#b0b0b0]">
        <Lock size={12} />
        <span className="text-xs">Pago seguro por WebPay</span>
      </div>
    </div>
  )
}
