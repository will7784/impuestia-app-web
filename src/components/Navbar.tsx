import { useState, useEffect, useRef, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY
    setIsScrolled(currentY > 50)
    if (currentY > lastScrollY.current && currentY > 200) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
    lastScrollY.current = currentY
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const scrollToSection = (id: string) => {
    setMobileOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        el?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    } else {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navLinks = [
    { label: 'Nuestros Servicios', id: 'servicios' },
    { label: 'Por Qué Elegirnos', id: 'porque-elegirnos' },
    { label: 'Testimonios', id: 'testimonios' },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-all"
      style={{
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        transitionDuration: '0.4s',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        backgroundColor: isScrolled ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-[5vw] h-20 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            navigate('/')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="text-white text-xl font-bold tracking-tight"
        >
          ImpuestIA
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-sm font-medium text-[#b0b0b0] hover:text-white transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/claudia')}
            className="bg-[#ff3366] text-white text-sm font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.4)] transition-all duration-300"
            style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            Habla con ClaudIA
          </button>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden px-[5vw] pb-6 pt-2"
          style={{ backgroundColor: 'rgba(10, 10, 10, 0.95)', backdropFilter: 'blur(12px)' }}
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="block w-full text-left py-3 text-base font-medium text-[#b0b0b0] hover:text-white transition-colors border-b border-white/[0.08]"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false)
              navigate('/claudia')
            }}
            className="mt-4 w-full bg-[#ff3366] text-white text-sm font-bold uppercase tracking-wider px-6 py-3 rounded-full"
          >
            Habla con ClaudIA
          </button>
        </div>
      )}
    </nav>
  )
}
