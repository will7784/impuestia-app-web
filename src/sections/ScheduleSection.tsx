import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CalendarCheck } from 'lucide-react'

 gsap.registerPlugin(ScrollTrigger)

export default function ScheduleSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.sched-label'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelector('.sched-title'), {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelector('.sched-text'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.25,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelector('.sched-btn'), {
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        delay: 0.4,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="agendar"
      className="relative w-full py-20 md:py-[140px] overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 51, 102, 0.06) 0%, transparent 55%)',
        }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto px-[5vw] text-center">
        <div
          className="sched-label mb-5"
          style={{
            color: '#ff3366',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Reunión gratuita
        </div>

        <h2 className="sched-title text-white text-[28px] md:text-[44px] font-extrabold leading-tight">
          ¿Prefieres hablar con un especialista de carne y hueso?
        </h2>

        <p className="sched-text text-[#b0b0b0] text-lg mt-6 leading-relaxed">
          Agenda una reunión de 15 minutos con nuestro equipo tributario. Analizamos tu situación particular,
          respondemos tus dudas urgentes y te mostramos cómo podemos defenderte ante el SII.
          Sin compromiso, sin letra chica.
        </p>

        <div className="sched-btn mt-10 flex flex-col items-center gap-3">
          <a
            href="https://calendly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#0a0a0a] px-10 py-4 rounded-full font-bold text-base hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            <CalendarCheck size={20} />
            Agendar reunión gratuita
          </a>
          <span className="text-sm text-[#666]">
            Chile · Colombia · 15 minutos · Sin compromiso
          </span>
        </div>
      </div>
    </section>
  )
}
