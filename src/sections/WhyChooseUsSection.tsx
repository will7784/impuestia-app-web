import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 15, suffix: '+', label: 'Anos de Experiencia' },
  { value: 500, suffix: '+', label: 'Casos Exitosos' },
  { value: 98, suffix: '%', label: 'Tasa de Satisfaccion' },
  { value: 24, suffix: 'h', label: 'Respuesta Garantizada' },
]

function CountUp({ end, suffix, trigger }: { end: number; suffix: string; trigger: boolean }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!trigger) return

    const duration = 1200
    const startTime = performance.now()
    const startValue = 0

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (end - startValue) * easedProgress)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [trigger, end])

  return (
    <span ref={countRef}>
      {count}{suffix}
    </span>
  )
}

export default function WhyChooseUsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [triggerCount, setTriggerCount] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.why-left'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      ScrollTrigger.create({
        trigger: el.querySelector('.stats-grid'),
        start: 'top 80%',
        once: true,
        onEnter: () => setTriggerCount(true),
      })

      gsap.from(el.querySelectorAll('.stat-item'), {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: el.querySelector('.stats-grid'), start: 'top 80%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const scrollToServices = () => {
    const el = document.getElementById('servicios')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={sectionRef}
      id="porque-elegirnos"
      className="w-full py-16 md:py-[120px]"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="why-left">
            <div
              className="mb-4"
              style={{
                color: '#ff3366',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              VENTAJAS
            </div>
            <h2 className="text-white text-[28px] md:text-[48px] font-extrabold leading-tight">
              Por Que Elegirnos
            </h2>
            <p className="text-[#b0b0b0] text-lg mt-4">
              Somos especialistas en materia tributaria con años de experiencia defendiendo a contribuyentes chilenos. Nuestro trabajo se complementa con servicios de supervisión contable y cash management para PYMEs que buscan una visión integral.
            </p>
            <button
              onClick={scrollToServices}
              className="mt-8 bg-[#ff3366] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-base hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.4)] transition-all duration-300"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              Conoce Nuestros Servicios
            </button>
          </div>

          <div className="stats-grid grid grid-cols-2 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center lg:text-left">
                <div className="text-[#ff3366] text-[48px] font-extrabold leading-none">
                  <CountUp end={stat.value} suffix={stat.suffix} trigger={triggerCount} />
                </div>
                <div className="text-[#b0b0b0] text-base font-medium mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
