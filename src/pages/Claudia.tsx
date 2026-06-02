import { useState, useEffect, useRef, useCallback } from 'react'
import ParticleBackground from '@/components/voice/ParticleBackground'
import VoiceAvatar from '@/components/voice/VoiceAvatar'
import MessageBubble from '@/components/voice/MessageBubble'
import QuickReplyChips from '@/components/voice/QuickReplyChips'
import ChatInput from '@/components/voice/ChatInput'
import { useConversation } from '@/hooks/use-conversation'

export default function Claudia() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [formVisible, setFormVisible] = useState(false)

  const {
    screen,
    messages,
    isProcessing,
    startConversation,
    sendMessage,
    getLatestQuickReplies,
    setMessagesEndRef,
  } = useConversation(name, email)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndDivRef = useRef<HTMLDivElement>(null)

  // Entrance animations
  useEffect(() => {
    const timer = setTimeout(() => setFormVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Set messages end ref for auto-scroll
  useEffect(() => {
    if (messagesEndDivRef.current) {
      setMessagesEndRef(messagesEndDivRef.current)
    }
  }, [messagesEndDivRef.current, setMessagesEndRef])

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (name.trim() && email.trim()) {
        await startConversation()
      }
    },
    [name, email, startConversation]
  )

  const handleQuickReply = useCallback(
    (option: string) => {
      sendMessage(option)
    },
    [sendMessage]
  )

  const handleSend = useCallback(
    (text: string) => {
      sendMessage(text)
    },
    [sendMessage]
  )

  const quickReplies = getLatestQuickReplies()

  // ---- HERO / FORM SCREEN ----
  if (screen === 'hero') {
    return (
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        <ParticleBackground />

        <div className="relative z-10 flex flex-col items-center text-center px-[5vw] max-w-xl mx-auto">
          {/* Avatar */}
          <div
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
            }}
          >
            <VoiceAvatar size={120} isActive={true} />
          </div>

          {/* H1 */}
          <h1
            className="mt-6 text-white text-[56px] font-extrabold leading-[0.95] tracking-tight"
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}
          >
            Hola, Soy{' '}
            <span className="text-[#ff3366]">ClaudIA</span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-3 text-[#b0b0b0] text-base leading-relaxed max-w-[460px]"
            style={{
              opacity: formVisible ? 1 : 0,
              transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
            }}
          >
            Tu asistente virtual. Te regalo una guía precisa con los pasos que recomendamos seguir ante un escenario de citación del SII.
          </p>

          {/* Form */}
          <form
            onSubmit={handleFormSubmit}
            className="mt-8 w-full max-w-md space-y-4"
            style={{
              opacity: formVisible ? 1 : 0,
              transition: 'opacity 0.5s ease 0.8s',
            }}
          >
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white text-base placeholder:text-[#666] focus:outline-none focus:border-[#ff3366]/50 transition-colors"
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-4 rounded-xl bg-[#0a0a0a] border border-white/[0.08] text-white text-base placeholder:text-[#666] focus:outline-none focus:border-[#ff3366]/50 transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-[#ff3366] text-white font-bold text-base py-4 rounded-xl hover:brightness-110 transition-all duration-300"
            >
              Obtener mi guía →
            </button>
          </form>

          <p
            className="text-[#b0b0b0] text-xs mt-4 text-center"
            style={{
              opacity: formVisible ? 1 : 0,
              transition: 'opacity 0.5s ease 1s',
            }}
          >
            Tus datos están protegidos. Nunca compartimos tu información.
          </p>
        </div>
      </div>
    )
  }

  // ---- CONVERSATION SCREEN ----
  return (
    <div className="relative min-h-[100dvh] flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="opacity-30">
        <ParticleBackground />
      </div>

      <div className="relative z-10 flex flex-1 h-[100dvh]">
        {/* Full width conversation */}
        <div className="flex-1 flex flex-col w-full">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
            <div className="flex-shrink-0">
              <VoiceAvatar size={36} isActive={true} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white">ClaudIA</h2>
              <p className="text-xs text-[#b0b0b0]">
                {isProcessing ? 'Escribiendo...' : 'Asesora Tributaria'}
              </p>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4"
            style={{ scrollBehavior: 'smooth' }}
          >
            {messages.map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isLatest={index === messages.length - 1 && msg.role === 'claudia'}
              />
            ))}

            {/* Quick Replies */}
            {quickReplies.length > 0 && !isProcessing && (
              <QuickReplyChips
                options={quickReplies}
                onSelect={handleQuickReply}
                disabled={isProcessing}
              />
            )}

            <div ref={messagesEndDivRef} />
          </div>

          {/* Input Bar */}
          <ChatInput
            onSend={handleSend}
            isProcessing={isProcessing}
            mode="chat"
          />
        </div>
      </div>
    </div>
  )
}
