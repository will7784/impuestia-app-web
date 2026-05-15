import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield, Scale, FileText, Lock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: Shield,
    title: 'Representacion Ante el SII',
    description: 'Te representamos ante el Servicio de Impuestos Internos en inspecciones, citaciones y requerimientos fiscales. Protegemos tus derechos y gestionamos tus obligaciones tributarias.',
  },
  {
    icon: Scale,
    title: 'Defensa en Multas Tributarias',
    description: 'Impugnamos multas y sanciones tributarias. Analizamos la legalidad de las resoluciones y construimos la mejor estrategia de defensa para tu caso.',
  },
  {
    icon: FileText,
    title: 'Recurso de Proteccion',
    description: 'Presentamos recursos de proteccion contra actos arbitrarios del fisco. Defendemos tus garantias constitucionales frente a procedimientos abusivos.',
  },
  {
    icon: Lock,
    title: 'Fraude Tributario',
    description: 'Asesoria especializada en prevencion y defensa por delitos tributarios. Analisis de riesgo penal y estrategias legales para protegerte.',
  },
]

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.services-header'), {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      })

      gsap.from(el.querySelectorAll('.service-card'), {
        opacity: 0,
        y: 40,
        scale: 0.97,
        stagger: 0.12,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el.querySelector('.services-grid'),
          start: 'top 80%',
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="servicios"
      className="w-full py-16 md:py-[120px]"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw]">
        <div className="services-header">
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
            ESPECIALIDAD
          </div>
          <h2 className="text-white text-[28px] md:text-[48px] font-extrabold leading-tight">
            Especialistas en Impuestos
          </h2>
          <p className="text-[#b0b0b0] text-lg mt-4 max-w-[600px]">
            Nos dedicamos a resolver problemas tributarios complejos. Como parte de nuestra práctica integral, también acompañamos a PYMEs en supervisión contable y cash management.
          </p>
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="service-card group bg-white/[0.03] border border-white/[0.08] backdrop-blur-md rounded-2xl p-8 hover:border-[#ff3366]/30 hover:shadow-[0_0_20px_rgba(255,51,102,0.1)] transition-all duration-300 hover:-translate-y-1"
                style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
                <div className="mb-6">
                  <Icon size={48} strokeWidth={1.5} className="text-white" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-3">
                  {service.title}
                </h3>
                <p className="text-[#b0b0b0] text-base leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
