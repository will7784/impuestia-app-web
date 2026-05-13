import { useState, useCallback, useRef, useEffect } from 'react'

export type VoiceMode = 'idle' | 'listening' | 'speaking' | 'chat-only'

interface VoiceServiceState {
  mode: VoiceMode
  isMuted: boolean
  transcript: string
  interimTranscript: string
  error: string | null
  micPermission: 'unknown' | 'granted' | 'denied'
}

interface VoiceServiceReturn extends VoiceServiceState {
  startListening: () => void
  stopListening: () => void
  speak: (text: string) => Promise<void>
  cancelSpeech: () => void
  toggleMute: () => void
  requestMicPermission: () => Promise<boolean>
  resetTranscript: () => void
  isVoiceSupported: boolean
}

// Speech recognition types
interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  isFinal: boolean
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: Event & { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

// Check if voice APIs are supported
const isSpeechRecognitionSupported = !!(typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition))
const isSpeechSynthesisSupported = !!(typeof window !== 'undefined' && window.speechSynthesis)

// Helper: ensure voices are loaded (they load async)
function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    const voices = synth.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }
    const handler = () => {
      resolve(synth.getVoices())
      synth.removeEventListener('voiceschanged', handler)
    }
    synth.addEventListener('voiceschanged', handler)
    // Fallback timeout in case voices never load
    setTimeout(() => resolve(synth.getVoices()), 2000)
  })
}

export function useVoiceService(): VoiceServiceReturn {
  const [mode, setMode] = useState<VoiceMode>('idle')
  const [isMuted, setIsMuted] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown')

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const synthRef = useRef<typeof window.speechSynthesis | null>(null)

  useEffect(() => {
    synthRef.current = window.speechSynthesis

    return () => {
      cancelSpeech()
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  const requestMicPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop())
      setMicPermission('granted')
      setError(null)
      return true
    } catch {
      setMicPermission('denied')
      setError('Microphone permission denied')
      setMode('chat-only')
      return false
    }
  }, [])

  const startListening = useCallback(() => {
    if (mode === 'chat-only') return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setError('Speech recognition not supported')
      setMode('chat-only')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'es-CL'

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interim = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interim += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + finalTranscript)
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: Event & { error: string }) => {
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        setError(`Speech recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setMode('idle')
    }

    recognitionRef.current = recognition
    recognition.start()
    setMode('listening')
    setError(null)
  }, [mode])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (mode !== 'chat-only') {
      setMode('idle')
    }
  }, [mode])

  const speak = useCallback(
    async (text: string): Promise<void> => {
      if (isMuted) return

      return new Promise((resolve) => {
        const synth = synthRef.current
        if (!synth) {
          resolve()
          return
        }

        // Cancel any ongoing speech
        synth.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'es-CL'
        utterance.rate = 0.95
        utterance.pitch = 1.15

        // Wait for voices to load then speak
        getVoicesAsync().then((voices) => {
          // Try to find a Spanish female voice
          const spanishVoice =
            voices.find(
              (v) =>
                v.lang.startsWith('es') &&
                (v.name.toLowerCase().includes('female') ||
                  v.name.toLowerCase().includes('mujer') ||
                  v.name.toLowerCase().includes('monica') ||
                  v.name.toLowerCase().includes('paulina') ||
                  v.name.toLowerCase().includes('fernanda') ||
                  v.name.toLowerCase().includes('ines') ||
                  v.name.toLowerCase().includes('helena') ||
                  v.name.toLowerCase().includes('catalina') ||
                  v.name.toLowerCase().includes('ximena') ||
                  v.name.toLowerCase().includes('soledad'))
            ) ||
            voices.find((v) => v.lang.startsWith('es')) ||
            voices.find((v) => v.lang.startsWith('es-')) ||
            null

          if (spanishVoice) {
            utterance.voice = spanishVoice
          }

          utterance.onstart = () => {
            if (mode !== 'chat-only') {
              setMode('speaking')
            }
          }
          utterance.onend = () => {
            if (mode !== 'chat-only') {
              setMode('idle')
            }
            resolve()
          }
          utterance.onerror = () => {
            if (mode !== 'chat-only') {
              setMode('idle')
            }
            resolve()
          }

          synth.speak(utterance)
        }).catch(() => {
          // Fallback: speak without setting voice
          synth.speak(utterance)
          resolve()
        })
      })
    },
    [isMuted, mode]
  )

  const cancelSpeech = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
    }
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
    if (!isMuted) {
      cancelSpeech()
    }
  }, [isMuted, cancelSpeech])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    mode,
    isMuted,
    transcript,
    interimTranscript,
    error,
    micPermission,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    toggleMute,
    requestMicPermission,
    resetTranscript,
    isVoiceSupported: isSpeechRecognitionSupported && isSpeechSynthesisSupported,
  }
}

// Standalone functions for non-hook usage
export function speakText(text: string): Promise<void> {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis
    if (!synth) {
      resolve()
      return
    }

    synth.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-CL'
    utterance.rate = 0.95
    utterance.pitch = 1.15

    getVoicesAsync().then((voices) => {
      const spanishVoice =
        voices.find((v) => v.lang.startsWith('es')) ||
        voices.find((v) => v.lang.startsWith('es-')) ||
        null
      if (spanishVoice) {
        utterance.voice = spanishVoice
      }
      utterance.onend = () => resolve()
      utterance.onerror = () => resolve()
      synth.speak(utterance)
    }).catch(() => {
      synth.speak(utterance)
      resolve()
    })
  })
}
