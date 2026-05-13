import { useState, useRef } from 'react'
import { Send, Mic, MicOff } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  onMicToggle?: () => void
  isListening?: boolean
  isProcessing?: boolean
  mode?: 'voice' | 'chat'
}

export default function ChatInput({
  onSend,
  onMicToggle,
  isListening = false,
  isProcessing = false,
  mode = 'chat',
}: ChatInputProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (text.trim() && !isProcessing) {
      onSend(text.trim())
      setText('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-t border-white/[0.08] bg-[#0a0a0a]">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu mensaje..."
        disabled={isProcessing}
        className="flex-1 bg-white/[0.05] border border-white/[0.1] rounded-2xl px-4 py-3
                   text-white text-[15px] placeholder:text-[#b0b0b0]/50
                   focus:outline-none focus:border-[#ff3366]/40
                   disabled:opacity-50 transition-colors duration-200"
      />

      {/* Mic button */}
      {onMicToggle && mode === 'voice' && (
        <button
          onClick={onMicToggle}
          className={`flex-shrink-0 w-12 h-12 rounded-full border flex items-center justify-center
                      transition-all duration-300 ${
                        isListening
                          ? 'bg-[#ff3366] border-[#ff3366] animate-micPulse'
                          : 'border-white/[0.2] hover:border-[#ff3366] hover:bg-[#ff3366]/10'
                      }`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          title={isListening ? 'Dejar de escuchar' : 'Hablar'}
        >
          {isListening ? (
            <MicOff size={20} className="text-white" />
          ) : (
            <Mic size={20} className="text-white" />
          )}
        </button>
      )}

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!text.trim() || isProcessing}
        className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ff3366] flex items-center justify-center
                   hover:scale-110 hover:shadow-[0_0_20px_rgba(255,51,102,0.4)]
                   active:scale-[0.95]
                   disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none
                   disabled:cursor-not-allowed transition-all duration-300"
        style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <Send size={20} className="text-white -rotate-45 translate-x-0.5" />
      </button>

      <style>{`
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0.5); }
          50% { box-shadow: 0 0 0 8px rgba(255, 51, 102, 0); }
        }
        .animate-micPulse {
          animation: micPulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
