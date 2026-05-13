import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface FinalCTASectionProps {
  onOpenLeadModal: () => void
}

export default function FinalCTASection({ onOpenLeadModal }: FinalCTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.cta-h2'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelector('.cta-subtitle'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelector('.cta-button'), {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        delay: 0.4,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelector('.cta-glow'), {
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-[120px] overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Radial glow background */}
      <div
        className="cta-glow absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 51, 102, 0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-[5vw] text-center">
        <h2 className="cta-h2 text-white text-[28px] md:text-[48px] font-extrabold leading-tight">
          Hablemos de tu Caso
        </h2>
        <p className="cta-subtitle text-[#b0b0b0] text-lg mt-6 max-w-[600px] mx-auto">
          No esperes a que el SII tome la iniciativa. Protege tu negocio ahora con asesores especializados.
        </p>

        <button
          onClick={() => onOpenLeadModal()}
          className="cta-button mt-10 bg-[#ff3366] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-base hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.4)] transition-all duration-300"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          Habla con Nosotros
        </button>

        <p className="mt-5">
          <a
            href="mailto:contacto@asesoriatributaria.cl"
            className="text-sm text-[#b0b0b0] underline hover:text-white transition-colors"
          >
            O escribenos a contacto@asesoriatributaria.cl
          </a>
        </p>
      </div>
    </section>
  )
}
