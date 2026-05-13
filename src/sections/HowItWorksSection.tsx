import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageSquare, ClipboardCheck, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Contactanos',
    description: 'Escribenos por WhatsApp o llena el formulario. Estamos disponibles 24/7 para atenderte.',
  },
  {
    number: '02',
    icon: ClipboardCheck,
    title: 'Evaluamos tu Caso',
    description: 'Analizamos tu situacion tributaria y te presentamos la mejor estrategia de defensa personalizada.',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Protegemos tu Negocio',
    description: 'Ejecutamos la estrategia defendiendo tus intereses ante el SII para que tu sigas operando tranquilo.',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.how-header'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelectorAll('.step-card'), {
        opacity: 0,
        y: 60,
        stagger: 0.2,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: el.querySelector('.steps-grid'), start: 'top 80%', once: true },
      })

      gsap.from(el.querySelectorAll('.step-number'), {
        scale: 0,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el.querySelector('.steps-grid'), start: 'top 80%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-[120px]"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw]">
        <div className="how-header text-center">
          <h2 className="text-white text-[28px] md:text-[48px] font-extrabold leading-tight">
            Comienza tu Tranquilidad Tributaria en Minutos
          </h2>
        </div>

        <div className="steps-grid grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={index}
                className="step-card relative bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-8 h-[320px] flex flex-col"
              >
                <span
                  className="step-number absolute top-[-10px] left-[-10px] text-[64px] font-extrabold leading-none select-none pointer-events-none"
                  style={{ color: 'rgba(255, 51, 102, 0.2)' }}
                >
                  {step.number}
                </span>

                <div className="mt-8 mb-4">
                  <Icon size={48} strokeWidth={1.5} className="text-white" />
                </div>

                <h3 className="text-white text-2xl font-bold mb-3">
                  {step.title}
                </h3>
                <p className="text-[#b0b0b0] text-base leading-relaxed flex-1">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
