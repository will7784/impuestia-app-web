import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Circle, Square, Triangle, Hexagon, Star, Diamond } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const logos = [
  { icon: Circle, name: 'Cliente 1' },
  { icon: Square, name: 'Cliente 2' },
  { icon: Triangle, name: 'Cliente 3' },
  { icon: Hexagon, name: 'Cliente 4' },
  { icon: Star, name: 'Cliente 5' },
  { icon: Diamond, name: 'Cliente 6' },
]

export default function ClientLogosSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.logos-header'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 80%', once: true },
      })

      gsap.from(el.querySelectorAll('.logo-item'), {
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: el.querySelector('.logos-row'), start: 'top 80%', once: true },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full py-20"
      style={{ backgroundColor: '#f5f5f5' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw]">
        <div className="logos-header text-center">
          <h2 className="text-[#0a0a0a] text-[28px] md:text-[48px] font-extrabold leading-tight">
            Nuestros Clientes y Colaboradores
          </h2>
          <p className="text-[#666] text-lg mt-3">
            Confian en nosotros empresas y profesionales de diversos sectores
          </p>
        </div>

        <div className="logos-row flex flex-wrap items-center justify-center gap-10 md:gap-[60px] mt-12">
          {logos.map((logo, index) => {
            const Icon = logo.icon
            return (
              <div
                key={index}
                className="logo-item opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <Icon size={40} strokeWidth={1} className="text-[#999]" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
