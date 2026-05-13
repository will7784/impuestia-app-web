import { useEffect, useRef } from 'react'
import type { Message } from '@/lib/claudia-engine'

interface MessageBubbleProps {
  message: Message
  isLatest?: boolean
}

export default function MessageBubble({ message, isLatest = false }: MessageBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bubbleRef.current) {
      const el = bubbleRef.current
      el.style.opacity = '0'
      el.style.transform = 'translateY(10px)'
      requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
    }
  }, [])

  const isClaudia = message.role === 'claudia'

  return (
    <div
      ref={bubbleRef}
      className={`flex w-full ${isClaudia ? 'justify-start' : 'justify-end'} mb-4`}
    >
      <div className={`flex max-w-[70%] ${isClaudia ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
        {/* Avatar for ClaudIA */}
        {isClaudia && (
          <div
            className="flex-shrink-0 rounded-full bg-[#0a0a0a] border border-white/[0.15] flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              animation: 'avatarFloat 3s ease-in-out infinite',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="2" fill="rgba(255,255,255,0.4)" />
              <path
                d="M5 10C5 10 6.5 12 8 12C9.5 12 11 10 11 10"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-3 text-[15px] leading-relaxed ${
            isClaudia
              ? 'bg-white/[0.05] border border-white/[0.08] text-white rounded-t-2xl rounded-br-2xl rounded-bl-[4px]'
              : 'bg-[#ff3366]/[0.1] border border-[#ff3366]/[0.2] text-white rounded-t-2xl rounded-bl-2xl rounded-br-[4px]'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.text}</div>

          {/* Typing indicator (shown if processing latest ClaudIA message) */}
          {isClaudia && isLatest && message.text === '' && (
            <div className="flex items-center gap-1 py-1">
              <div
                className="w-2 h-2 rounded-full bg-white/40"
                style={{ animation: 'typingDot 1.2s infinite ease-in-out 0s' }}
              />
              <div
                className="w-2 h-2 rounded-full bg-white/40"
                style={{ animation: 'typingDot 1.2s infinite ease-in-out 0.2s' }}
              />
              <div
                className="w-2 h-2 rounded-full bg-white/40"
                style={{ animation: 'typingDot 1.2s infinite ease-in-out 0.4s' }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
      `}</style>
    </div>
  )
}
