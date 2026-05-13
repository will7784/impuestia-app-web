import { useSearchParams } from 'react-router'
import { useEffect, useState, useRef, useCallback } from 'react'
import ParticleBackground from '@/components/voice/ParticleBackground'
import VoiceAvatar from '@/components/voice/VoiceAvatar'
import VoiceWaveform from '@/components/voice/VoiceWaveform'
import MessageBubble from '@/components/voice/MessageBubble'
import QuickReplyChips from '@/components/voice/QuickReplyChips'
import ChatInput from '@/components/voice/ChatInput'
import PhaseProgress from '@/components/voice/PhaseProgress'
import LeadProfileCard from '@/components/voice/LeadProfileCard'
import PaymentPanel from '@/components/voice/PaymentPanel'
import EbookPreview from '@/components/voice/EbookPreview'
import PaymentConfirmation from '@/components/voice/PaymentConfirmation'
import ExitModal from '@/components/voice/ExitModal'
import { useConversation } from '@/hooks/use-conversation'
import { useVoiceService } from '@/lib/voice-service'
import type { Plan } from '@/lib/claudia-engine'
import { Mic, MessageSquare, Volume2, VolumeX } from 'lucide-react'

export default function Agent() {
  const [searchParams] = useSearchParams()
  const name = searchParams.get('name') || ''
  const email = searchParams.get('email') || ''

  const defaultName = name || 'Invitado'
  const defaultEmail = email || 'sin-correo@ejemplo.cl'

  // Voice service integration
  const {
    mode: voiceMode,
    isMuted,
    transcript,
    error: _voiceError,
    micPermission,
    speak,
    cancelSpeech,
    startListening,
    stopListening,
    toggleMute,
    requestMicPermission,
    resetTranscript,
    isVoiceSupported,
  } = useVoiceService()

  // Track if we're in voice mode (separate from chat)
  const [conversationMode, setConversationMode] = useState<'voice' | 'chat'>('chat')
  // Track if mic permission is being requested
  const [requestingMic, setRequestingMic] = useState(false)
  // Voice permission denied message
  const [showPermissionDenied, setShowPermissionDenied] = useState(false)

  // Callback when ClaudIA generates a message — triggers TTS in voice mode
  const handleClaudiaMessage = useCallback(
    (text: string, mode: 'voice' | 'chat') => {
      if (mode === 'voice' && conversationMode === 'voice') {
        // Strip markdown and emojis for cleaner speech
        const cleanText = text
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
          .replace(/\n/g, ' ')
          .trim()
        // Only speak first 200 chars to keep it snappy
        speak(cleanText.slice(0, 200)).then(() => {
          // After speaking, start listening for user's response
          if (conversationMode === 'voice') {
            setTimeout(() => startListening(), 300)
          }
        })
      }
    },
    [speak, startListening, conversationMode]
  )

  const {
    screen,
    messages,
    isProcessing,
    selectedPlan,
    startConversation,
    sendMessage,
    selectPlan,
    completePayment,
    showExitModal,
    closeExitModal,
    handleExitSubmit,
    closePaymentSuccess,
    getLatestQuickReplies,
    getCurrentProfile,
    getCurrentPhase,
    setMessagesEndRef,
  } = useConversation(defaultName, defaultEmail, handleClaudiaMessage)

  const [heroVisible, setHeroVisible] = useState(false)
  const [waveformActive, setWaveformActive] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndDivRef = useRef<HTMLDivElement>(null)

  // Hero entrance animations
  useEffect(() => {
    const timers = [setTimeout(() => setHeroVisible(true), 100)]
    return () => timers.forEach(clearTimeout)
  }, [])

  // Set messages end ref for auto-scroll
  useEffect(() => {
    if (messagesEndDivRef.current) {
      setMessagesEndRef(messagesEndDivRef.current)
    }
  }, [messagesEndDivRef.current, setMessagesEndRef])

  // Handle transcript from voice recognition — auto-send when final
  const transcriptRef = useRef(transcript)
  transcriptRef.current = transcript

  useEffect(() => {
    if (transcript && conversationMode === 'voice' && screen === 'conversation') {
      // Debounce: wait 1.5s of silence before sending
      const timer = setTimeout(() => {
        if (transcriptRef.current.trim()) {
          const text = transcriptRef.current.trim()
          resetTranscript()
          stopListening()
          sendMessage(text)
        }
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [transcript, conversationMode, screen, resetTranscript, stopListening, sendMessage])

  // Handle quick reply selection
  const handleQuickReply = useCallback(
    (option: string) => {
      // Cancel listening if active
      if (voiceMode === 'listening') {
        stopListening()
      }
      cancelSpeech()
      sendMessage(option)
    },
    [sendMessage, voiceMode, stopListening, cancelSpeech]
  )

  // Handle text send
  const handleSend = useCallback(
    (text: string) => {
      cancelSpeech()
      if (voiceMode === 'listening') {
        stopListening()
      }
      sendMessage(text)
    },
    [sendMessage, cancelSpeech, voiceMode, stopListening]
  )

  // Handle voice start — request mic permission first
  const handleVoiceStart = useCallback(async () => {
    if (!isVoiceSupported) {
      // Browser doesn't support voice APIs, fallback to chat
      setConversationMode('chat')
      setWaveformActive(false)
      await startConversation('chat')
      return
    }

    setRequestingMic(true)
    setShowPermissionDenied(false)

    const granted = await requestMicPermission()

    setRequestingMic(false)

    if (granted) {
      setConversationMode('voice')
      setWaveformActive(true)
      await startConversation('voice')
      // Start listening for user's voice immediately
      setTimeout(() => startListening(), 500)
    } else {
      setShowPermissionDenied(true)
      // Fallback to chat mode
      setConversationMode('chat')
      setWaveformActive(false)
      setTimeout(() => {
        startConversation('chat')
      }, 1500)
    }
  }, [isVoiceSupported, requestMicPermission, startConversation, startListening])

  // Handle chat start
  const handleChatStart = useCallback(async () => {
    cancelSpeech()
    stopListening()
    setConversationMode('chat')
    setWaveformActive(false)
    setShowPermissionDenied(false)
    await startConversation('chat')
  }, [startConversation, cancelSpeech, stopListening])

  // Handle mic toggle (for chat input in voice mode)
  const handleMicToggle = useCallback(() => {
    if (voiceMode === 'listening') {
      stopListening()
      setWaveformActive(false)
    } else {
      startListening()
      setWaveformActive(true)
    }
  }, [voiceMode, startListening, stopListening])

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    toggleMute()
  }, [toggleMute])

  // Handle plan selection from payment panel
  const handlePlanSelect = useCallback(
    (planName: string) => {
      cancelSpeech()
      selectPlan(planName)
    },
    [selectPlan, cancelSpeech]
  )

  // Handle payment completion
  const handlePaymentComplete = useCallback(
    (plan: Plan) => {
      cancelSpeech()
      completePayment(plan)
    },
    [completePayment, cancelSpeech]
  )

  // Handle schedule consultation
  const handleScheduleConsultation = useCallback(() => {
    window.open('https://calendly.com/asesoriatributaria', '_blank')
  }, [])

  // Handle download contract
  const handleDownloadContract = useCallback(() => {
    console.log('[Agent] Downloading contract...')
  }, [])

  // Get latest quick replies
  const quickReplies = getLatestQuickReplies()
  const profile = getCurrentProfile()
  const currentPhase = getCurrentPhase()

  // Show payment panel in phase 4
  const showPaymentPanel = currentPhase >= 4
  // Show ebook preview in phase 3
  const showEbookPreview = currentPhase >= 3 && currentPhase < 4

  // ---- HERO SCREEN ----
  if (screen === 'hero') {
    return (
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        {/* Particle Background */}
        <ParticleBackground />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-[5vw] max-w-xl mx-auto">
          {/* Avatar */}
          <div
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'scale(1)' : 'scale(0.8)',
              transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
            }}
          >
            <VoiceAvatar size={120} isActive={true} />
          </div>

          {/* H1 */}
          <h1
            className="mt-6 text-white text-[56px] font-extrabold leading-[0.95] tracking-tight"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}
          >
            Hola, Soy{' '}
            <span className="text-[#ff3366]">ClaudIA</span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-4 text-[#b0b0b0] text-xl leading-relaxed max-w-[500px]"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s',
            }}
          >
            {name ? `Hola ${name}! ` : ''}
            Tu asesora tributaria inteligente. Estoy aqui para ayudarte a proteger tu negocio y resolver tus dudas con el SII.
          </p>

          {/* Voice not supported warning */}
          {!isVoiceSupported && (
            <p
              className="mt-3 text-amber-400 text-sm"
              style={{
                opacity: heroVisible ? 1 : 0,
                transition: 'opacity 0.5s ease 0.7s',
              }}
            >
              Tu navegador no soporta voz. Usaremos modo chat.
            </p>
          )}

          {/* Buttons */}
          <div
            className="mt-8 flex flex-row gap-4 flex-wrap justify-center"
            style={{
              opacity: heroVisible ? 1 : 0,
              transition: 'opacity 0.5s ease 0.8s',
            }}
          >
            <button
              onClick={handleVoiceStart}
              disabled={requestingMic}
              className="flex items-center gap-2 bg-[#ff3366] text-white text-base font-bold uppercase tracking-wider
                         px-10 py-4 rounded-full
                         hover:scale-105 hover:shadow-[0_0_30px_rgba(255,51,102,0.4)]
                         active:scale-[0.98] transition-all duration-300
                         disabled:opacity-60 disabled:cursor-wait"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              {requestingMic ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Solicitando micrófono...
                </>
              ) : (
                <>
                  <Mic size={18} />
                  Hablar conmigo
                </>
              )}
            </button>

            <button
              onClick={handleChatStart}
              disabled={requestingMic}
              className="flex items-center gap-2 text-white text-base font-bold uppercase tracking-wider
                         px-10 py-4 rounded-full border border-white/[0.3]
                         hover:border-[#ff3366] hover:bg-[#ff3366]/10
                         active:scale-[0.98] transition-all duration-300
                         disabled:opacity-40"
              style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
            >
              <MessageSquare size={18} />
              Chatear
            </button>
          </div>

          {/* Permission denied message */}
          {showPermissionDenied && (
            <div
              className="mt-4 px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl max-w-[400px]"
              style={{
                animation: 'fadeInScale 0.4s ease-out',
              }}
            >
              <p className="text-amber-300 text-sm">
                No se pudo acceder al micrófono. Continuaremos en modo chat.
              </p>
              <p className="text-amber-400/60 text-xs mt-1">
                Tip: Permite el acceso al micrófono en la barra de direcciones y recarga la página para usar voz.
              </p>
            </div>
          )}

          {/* Voice wave indicator (only during active voice) */}
          <div className="mt-6 h-6 flex items-center justify-center">
            {waveformActive && <VoiceWaveform isActive={true} barCount={20} />}
          </div>
        </div>

        <style>{`
          @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  // ---- PAYMENT SUCCESS SCREEN ----
  if (screen === 'payment-success' && selectedPlan) {
    return (
      <PaymentConfirmation
        plan={selectedPlan}
        email={defaultEmail}
        onScheduleConsultation={handleScheduleConsultation}
        onDownloadContract={handleDownloadContract}
        onClose={closePaymentSuccess}
      />
    )
  }

  // ---- CONVERSATION SCREEN ----
  return (
    <div className="relative min-h-[100dvh] flex flex-col" style={{ backgroundColor: '#0a0a0a' }}>
      {/* Particle Background (subtle, lower opacity) */}
      <div className="opacity-30">
        <ParticleBackground />
      </div>

      {/* Exit Modal */}
      {screen === 'exit' && (
        <ExitModal
          isOpen={true}
          email={defaultEmail}
          onSubmit={handleExitSubmit}
          onClose={closeExitModal}
        />
      )}

      {/* Main Content - Two Column Layout */}
      <div className="relative z-10 flex flex-1 h-[100dvh]">
        {/* Left Panel - Conversation Log (60% desktop) */}
        <div className="flex-1 flex flex-col w-full lg:w-[60%] lg:max-w-[60%]">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-md">
            <VoiceAvatar size={36} isActive={true} />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white">ClaudIA</h2>
              <p className="text-xs text-[#b0b0b0]">
                {isProcessing
                  ? 'Escribiendo...'
                  : voiceMode === 'listening'
                    ? 'Escuchando...'
                    : voiceMode === 'speaking'
                      ? 'Hablando...'
                      : 'Asesora Tributaria'}
              </p>
            </div>

            {/* Voice controls (only in voice mode) */}
            {conversationMode === 'voice' && (
              <div className="flex items-center gap-2 mr-2">
                <button
                  onClick={handleMuteToggle}
                  className="p-2 rounded-full border border-white/[0.15] hover:border-[#ff3366]/50 hover:bg-[#ff3366]/10 transition-all"
                  title={isMuted ? 'Activar voz' : 'Silenciar'}
                >
                  {isMuted ? (
                    <VolumeX size={16} className="text-[#b0b0b0]" />
                  ) : (
                    <Volume2 size={16} className="text-[#ff3366]" />
                  )}
                </button>
                <span
                  className={`w-2 h-2 rounded-full ${
                    micPermission === 'granted'
                      ? 'bg-green-500'
                      : micPermission === 'denied'
                        ? 'bg-red-500'
                        : 'bg-[#b0b0b0]'
                  }`}
                  title={
                    micPermission === 'granted'
                      ? 'Micrófono activo'
                      : micPermission === 'denied'
                        ? 'Micrófono bloqueado'
                        : 'Micrófono no solicitado'
                  }
                />
              </div>
            )}

            <button
              onClick={showExitModal}
              className="text-[#b0b0b0] hover:text-white text-xs transition-colors"
            >
              Salir
            </button>
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

            {/* Messages end ref for auto-scroll */}
            <div ref={messagesEndDivRef} />
          </div>

          {/* Voice waveform in voice mode */}
          {conversationMode === 'voice' && (
            <div className="px-4 pt-2 flex items-center gap-3">
              <div className="flex-1">
                <VoiceWaveform isActive={voiceMode === 'listening' || voiceMode === 'speaking'} barCount={30} />
              </div>
              {transcript && (
                <span className="text-xs text-[#b0b0b0] truncate max-w-[200px]">
                  {transcript}
                </span>
              )}
            </div>
          )}

          {/* Input Bar */}
          <ChatInput
            onSend={handleSend}
            onMicToggle={handleMicToggle}
            isListening={voiceMode === 'listening'}
            isProcessing={isProcessing}
            mode={conversationMode}
          />
        </div>

        {/* Right Panel - Context & Tools (40% desktop, hidden on mobile) */}
        <div
          className="hidden lg:flex lg:w-[40%] lg:max-w-[40%] flex-col border-l border-white/[0.08]
                       bg-[#0a0a0a]/60 backdrop-blur-md overflow-y-auto"
        >
          <div className="p-4 space-y-4">
            {/* Lead Profile Card */}
            <LeadProfileCard profile={profile} currentPhase={currentPhase} />

            {/* Phase Progress */}
            <div
              className="rounded-2xl p-4 border border-white/[0.08]"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <PhaseProgress currentPhase={currentPhase} />
            </div>

            {/* Ebook Preview (Phase 3) */}
            {showEbookPreview && (
              <EbookPreview
                ageRange={profile.ageRange}
                companyType={profile.companyType}
                hasSII={profile.hasSIICitation}
              />
            )}

            {/* Payment Panel (Phase 4) */}
            {showPaymentPanel && (
              <PaymentPanel
                onSelectPlan={handlePlanSelect}
                onPaymentComplete={handlePaymentComplete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
