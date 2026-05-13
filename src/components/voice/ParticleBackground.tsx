import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 })
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0a0a, 1)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Particle count
    const PARTICLE_COUNT = 2000

    // Create positions and colors
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const colors = new Float32Array(PARTICLE_COUNT * 3)
    const originalPositions = new Float32Array(PARTICLE_COUNT * 3)
    const displacements = new Float32Array(PARTICLE_COUNT * 3)
    const driftSpeeds = new Float32Array(PARTICLE_COUNT)

    const crimsonColor = new THREE.Color('#ff3366')
    const whiteColor = new THREE.Color(0xffffff)
    const color = new THREE.Color()

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3

      // Random position in a wide area
      positions[i3] = (Math.random() - 0.5) * 20
      positions[i3 + 1] = (Math.random() - 0.5) * 20
      positions[i3 + 2] = (Math.random() - 0.5) * 10

      // Store original positions
      originalPositions[i3] = positions[i3]
      originalPositions[i3 + 1] = positions[i3 + 1]
      originalPositions[i3 + 2] = positions[i3 + 2]

      // Zero displacement initially
      displacements[i3] = 0
      displacements[i3 + 1] = 0
      displacements[i3 + 2] = 0

      // Individual drift speed
      driftSpeeds[i] = 0.2 + Math.random() * 0.5

      // 90% white, 10% crimson
      if (Math.random() < 0.1) {
        color.copy(crimsonColor)
      } else {
        color.copy(whiteColor)
      }
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
    }

    // Create geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    // Create material
    const material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    // Create points
    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth
      mouseRef.current.targetY = 1 - e.clientY / window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Clock
    const clock = new THREE.Clock()

    // Animation loop
    let animFrameId: number
    const animate = () => {
      animFrameId = requestAnimationFrame(animate)

      const elapsed = clock.getElapsedTime()
      const posArray = geometry.attributes.position.array as Float32Array

      // Lerp mouse position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      const mouseXNDC = (mouseRef.current.x - 0.5) * 2
      const mouseYNDC = (mouseRef.current.y - 0.5) * 2

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3

        // Upward drift
        posArray[i3 + 1] += driftSpeeds[i] * 0.003

        // Wrap around when too high
        if (posArray[i3 + 1] > 10) {
          posArray[i3 + 1] = -10
          originalPositions[i3 + 1] = -10
        }

        // Mouse repulsion
        const dx = posArray[i3] - mouseXNDC * 5
        const dy = posArray[i3 + 1] - mouseYNDC * 5
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 1.5 && dist > 0.01) {
          const force = (1.5 - dist) / 1.5 * 0.02
          displacements[i3] += (dx / dist) * force
          displacements[i3 + 1] += (dy / dist) * force
        }

        // Apply displacement with decay
        displacements[i3] *= 0.95
        displacements[i3 + 1] *= 0.95
        displacements[i3 + 2] *= 0.95

        // Final position
        posArray[i3] = originalPositions[i3] + displacements[i3]
        posArray[i3 + 1] += displacements[i3 + 1]
        posArray[i3 + 2] = originalPositions[i3 + 2] + displacements[i3 + 2]

        // Subtle sine wave
        posArray[i3] += Math.sin(elapsed * 0.5 + i * 0.1) * 0.002
      }

      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // Fade in
    renderer.domElement.style.opacity = '0'
    renderer.domElement.style.transition = 'opacity 1.5s ease'
    setTimeout(() => {
      renderer.domElement.style.opacity = '1'
    }, 100)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}
