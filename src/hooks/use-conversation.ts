import { useState, useEffect, useRef, useCallback } from 'react'
import { createEngine, type EngineState, type Phase } from '@/lib/claudia-engine'
import type { LeadProfile } from '@/lib/claudia-engine'
import { sendNotification } from '@/lib/email-service'
import { saveLead } from '@/lib/airtable-service'

export type Screen = 'hero' | 'conversation'

export function useConversation(name: string, email: string) {
  const engineRef = useRef(createEngine(name, email))
  const [screen, setScreen] = useState<Screen>('hero')
  const [state, setState] = useState<EngineState>(engineRef.current.getState())
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const prevMsgCountRef = useRef(0)
  const setMessagesEndRef = useCallback((el: HTMLDivElement | null) => {
    messagesEndRef.current = el
  }, [])

  // Subscribe to engine state changes
  useEffect(() => {
    const engine = engineRef.current
    engine.subscribe((newState) => {
      setState({ ...newState, messages: [...newState.messages] })
      prevMsgCountRef.current = newState.messages.length
    })
  }, [])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && screen === 'conversation') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.messages.length, screen])

  // Persist conversation to localStorage
  useEffect(() => {
    if (state.messages.length > 0) {
      const data = {
        profile: state.profile,
        phase: state.phase,
        timestamp: Date.now(),
      }
      localStorage.setItem('claudia_conversation', JSON.stringify(data))
    }
  }, [state.profile, state.phase])

  const startConversation = useCallback(
    async () => {
      setScreen('conversation')
      const engine = engineRef.current

      // Save lead to Airtable
      await saveLead({
        name,
        email,
        phase: 1,
        paymentStatus: 'pending',
      })

      // Send email notification
      sendNotification('new_lead', { name, email }).catch(console.error)

      // Start the conversation
      await engine.startConversation()
    },
    [name, email]
  )

  const sendMessage = useCallback(
    async (text: string) => {
      const engine = engineRef.current
      await engine.sendUserMessage(text)

      // Send phase complete notification
      if (state.phase >= 1) {
        sendNotification('phase_complete', {
          name,
          email,
          phase: state.phase,
        }).catch(console.error)
      }
    },
    [name, email, state.phase]
  )

  const getLatestQuickReplies = useCallback((): string[] => {
    const msgs = state.messages
    for (let i = msgs.length - 1; i >= 0; i--) {
      const msg = msgs[i]
      if (msg.role === 'claudia' && msg.quickReplies && msg.quickReplies.length > 0) {
        return msg.quickReplies
      }
    }
    return []
  }, [state.messages])

  const getCurrentProfile = useCallback((): LeadProfile => {
    return state.profile
  }, [state.profile])

  const getCurrentPhase = useCallback((): Phase => {
    return state.phase
  }, [state.phase])

  return {
    screen,
    state,
    messages: state.messages,
    isProcessing: state.isProcessing,
    startConversation,
    sendMessage,
    getLatestQuickReplies,
    getCurrentProfile,
    getCurrentPhase,
    setMessagesEndRef,
    engine: engineRef.current,
  }
}
