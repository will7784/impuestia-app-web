import { useEffect, useRef } from 'react'

interface VoiceWaveformProps {
  isActive: boolean
  barCount?: number
  className?: string
}

export default function VoiceWaveform({
  isActive,
  barCount = 20,
  className = '',
}: VoiceWaveformProps) {
  const barsRef = useRef<HTMLDivElement[]>([])
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!isActive) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = 0
      }
      // Reset all bars
      barsRef.current.forEach((bar) => {
        if (bar) {
          bar.style.height = '4px'
        }
      })
      return
    }

    let running = true
    const animate = () => {
      if (!running) return
      barsRef.current.forEach((bar) => {
        if (bar) {
          const height = 4 + Math.random() * 20
          bar.style.height = `${height}px`
        }
      })
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      running = false
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <div
      className={`flex items-end gap-[3px] h-6 ${className}`}
      style={{ width: barCount * 7 }}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) barsRef.current[i] = el
          }}
          className="rounded-full bg-[#ff3366] transition-[height] duration-100 ease-out"
          style={{
            width: 3,
            height: 4,
            minHeight: 4,
            opacity: 0.6 + Math.random() * 0.4,
          }}
        />
      ))}
    </div>
  )
}
