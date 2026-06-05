import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.footer-item'), {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={footerRef}
      className="w-full border-t border-white/[0.08]"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw] py-8 flex items-center justify-between flex-wrap gap-4">
        <div className="footer-item text-white text-xl font-bold tracking-tight">
          ImpuestIA
        </div>

        <div className="footer-item text-sm text-[#b0b0b0]">
          contacto@impuestia.cl
        </div>

        <div className="footer-item flex items-center gap-3">
          <span className="text-sm text-[#b0b0b0]">Chile</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-60"
          >
            <rect x="4" y="4" width="32" height="32" rx="4" fill="white" />
            <text x="20" y="25" textAnchor="middle" fill="#0a0a0a" fontSize="14" fontWeight="700">
              IA
            </text>
          </svg>
        </div>
      </div>
    </footer>
  )
}
