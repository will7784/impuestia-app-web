import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'Gracias a su asesoria pude resolver mi citacion del SII en tiempo record. Profesionales, claros y siempre disponibles. Los recomiendo al 100%.',
    name: 'Maria Gonzalez',
    role: 'Empresaria, Santiago',
  },
  {
    quote: 'Me defendieron de una multa injusta y lograron que se anulara. Su conocimiento del sistema tributario chileno es impresionante.',
    name: 'Carlos Mendez',
    role: 'Gerente General, Vina del Mar',
  },
  {
    quote: 'El recurso de proteccion que presentaron fue clave para detener un procedimiento abusivo. Excelente trabajo y comunicacion constante.',
    name: 'Ana Rodriguez',
    role: 'Contadora, Valparaiso',
  },
]

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.testimonials-header'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelectorAll('.testimonial-card'), {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: 'expo.out',
        scrollTrigger: { trigger: el.querySelector('.testimonials-grid'), start: 'top 80%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="testimonios"
      className="w-full py-16 md:py-[120px]"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw]">
        <div className="testimonials-header text-center">
          <h2 className="text-[#0a0a0a] text-[28px] md:text-[48px] font-extrabold leading-tight">
            Testimonios
          </h2>
          <p className="text-[#666] text-lg mt-3">
            Lo que dicen nuestros clientes sobre nuestro trabajo
          </p>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="testimonial-card rounded-2xl p-8"
              style={{ backgroundColor: '#f5f5f5' }}
            >
              <p className="text-[#333] text-lg italic leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div
                className="my-5"
                style={{ borderTop: '1px solid #ddd' }}
              />

              <div className="text-[#f5a623] text-base mb-3">
                {'★'.repeat(5)}
              </div>

              <div className="text-[#0a0a0a] text-base font-bold">
                {t.name}
              </div>
              <div className="text-[#666] text-sm mt-1">
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
