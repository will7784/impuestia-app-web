import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

 gsap.registerPlugin(ScrollTrigger)

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;

    // Mouse parallax
    uv += uMouse * 0.02;

    // Scroll-linked sine wave distortion
    float distortion = sin(uv.y * 3.14159 * 3.0 + uTime * 0.5) * uProgress * 0.15;
    uv.x += distortion;

    // Additional vertical distortion
    float vDistortion = sin(uv.x * 3.14159 * 2.0) * uProgress * 0.05;
    uv.y += vDistortion;

    // Desaturation based on scroll progress
    vec4 texColor = texture2D(uTexture, uv);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    vec3 finalColor = mix(texColor.rgb, vec3(gray), uProgress * 0.8);

    gl_FragColor = vec4(finalColor, texColor.a);
  }
`

interface HeroSectionProps {
  onNavigateToClaudia: () => void
}

export default function HeroSection({ onNavigateToClaudia }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = canvasContainerRef.current
    if (!container) return

    // Three.js setup
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    // Load texture
    const textureLoader = new THREE.TextureLoader()
    const texture = textureLoader.load('/hero-bg.jpg')
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter

    // Shader material
    const uniforms = {
      uTexture: { value: texture },
      uProgress: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    })

    // Create plane that fills the viewport
    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse tracking
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // ScrollTrigger for progress
    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        uniforms.uProgress.value = self.progress
      },
    })

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      uniforms.uTime.value += 0.01
      uniforms.uMouse.value.x += (mouse.x - uniforms.uMouse.value.x) * 0.05
      uniforms.uMouse.value.y += (mouse.y - uniforms.uMouse.value.y) * 0.05
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Content entrance animations
    const ctx = gsap.context(() => {
      const label = contentRef.current?.querySelector('.hero-label')
      const title = contentRef.current?.querySelector('.hero-title')
      const subtitle = contentRef.current?.querySelector('.hero-subtitle')
      const cta = contentRef.current?.querySelector('.hero-cta')
      const cta2 = contentRef.current?.querySelector('.hero-cta-secondary')

      if (label) {
        gsap.to(label, { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'expo.out' })
      }
      if (title) {
        gsap.to(title, { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'expo.out' })
      }
      if (subtitle) {
        gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.6, delay: 0.6, ease: 'expo.out' })
      }
      if (cta) {
        gsap.to(cta, { opacity: 1, scale: 1, duration: 0.5, delay: 0.8, ease: 'back.out(1.7)' })
      }
      if (cta2) {
        gsap.to(cta2, { opacity: 1, y: 0, duration: 0.5, delay: 1.0, ease: 'power2.out' })
      }
    })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      scrollTriggerInstance.kill()
      ctx.revert()
      geometry.dispose()
      material.dispose()
      texture.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  const handleCTAClick = () => {
    onNavigateToClaudia()
  }

  const scrollToSchedule = () => {
    const el = document.getElementById('agendar')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0a0a0a' }}
    >
      {/* Dark radial gradient background */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)',
        }}
      />

      {/* WebGL Canvas container */}
      <div
        ref={canvasContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          opacity: 0.6,
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
        }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-[4] text-center px-[5vw] max-w-[760px] mx-auto pt-16"
      >
        <div
          className="hero-label opacity-0 translate-y-5 mb-5"
          style={{
            color: '#ff3366',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Guía Gratuita — Pasos ante una citación del SII
        </div>

        <h1
          className="hero-title opacity-0 translate-y-[30px] text-white font-extrabold leading-[0.95] tracking-[-0.02em] text-[36px] md:text-[64px]"
        >
          Habla con ClaudiA y recibe tu guía de regalo
        </h1>

        <p
          className="hero-subtitle opacity-0 translate-y-5 mt-6 text-[#c8c8c8] text-lg md:text-xl font-normal leading-relaxed max-w-[560px] mx-auto"
          style={{ textWrap: 'pretty' }}
        >
          ¿Te citó el SII y no sabes por dónde empezar? Conversa un minuto con ClaudiA, nuestra asesora virtual, y te entregamos de inmediato la guía que preparé como auditor tributario para que enfrentes la citación con claridad y tranquilidad.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <button
            onClick={handleCTAClick}
            className="hero-cta opacity-0 scale-90 bg-[#ff3366] text-white px-10 py-4 rounded-full font-bold uppercase tracking-wider text-base hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.4)] transition-all duration-300"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Chatear con ClaudiA
          </button>

          <button
            onClick={scrollToSchedule}
            className="hero-cta-secondary opacity-0 translate-y-3 text-white px-8 py-4 rounded-full font-semibold text-base hover:text-[#ff3366] transition-all duration-300 border border-white/20 hover:border-[#ff3366]/40"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            Agendar reunión directa
          </button>
        </div>
      </div>
    </section>
  )
}
