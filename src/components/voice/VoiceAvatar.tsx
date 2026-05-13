import { useEffect, useRef } from 'react'

interface VoiceAvatarProps {
  size?: number
  isActive?: boolean
  className?: string
}

export default function VoiceAvatar({ size = 120, isActive = true, className = '' }: VoiceAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw avatar face on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 2

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.fillStyle = '#0a0a0a'
    ctx.fill()

    // Outer ring
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Inner concentric circle 1
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.75, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
    ctx.lineWidth = 1
    ctx.stroke()

    // Inner concentric circle 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.5, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 0.8
    ctx.stroke()

    // Simple smile
    ctx.beginPath()
    ctx.arc(centerX, centerY + size * 0.06, radius * 0.35, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Eyes (two small circles)
    const eyeOffset = size * 0.12
    const eyeY = centerY - size * 0.08
    const eyeRadius = size * 0.025

    // Left eye
    ctx.beginPath()
    ctx.arc(centerX - eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fill()

    // Right eye
    ctx.beginPath()
    ctx.arc(centerX + eyeOffset, eyeY, eyeRadius, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fill()
  }, [size])

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Pulsing ring */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            animation: 'avatarPulse 2s ease-in-out infinite',
          }}
        />
      )}
      <canvas
        ref={canvasRef}
        className="relative z-10"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
        }}
      />
      {/* Status dot */}
      {isActive && (
        <div
          className="absolute bottom-1 right-1 z-20 rounded-full border-2 border-[#0a0a0a]"
          style={{
            width: size * 0.16,
            height: size * 0.16,
            backgroundColor: '#ff3366',
            animation: 'statusPulse 2s ease-in-out infinite',
          }}
        />
      )}
      <style>{`
        @keyframes avatarPulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(255, 51, 102, 0.4);
          }
          50% {
            box-shadow: 0 0 0 ${size * 0.15}px rgba(255, 51, 102, 0);
          }
        }
        @keyframes statusPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}
