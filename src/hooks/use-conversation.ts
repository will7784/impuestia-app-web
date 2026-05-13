import { useState, useEffect, useRef, useCallback } from 'react'
import { createEngine, type EngineState, type Plan, type Phase } from '@/lib/claudia-engine'
import type { LeadProfile } from '@/lib/claudia-engine'
import { sendNotification } from '@/lib/email-service'
import { saveLead } from '@/lib/airtable-service'

export type Screen = 'hero' | 'conversation' | 'payment-success' | 'exit'

export function useConversation(
  name: string,
  email: string,
  onClaudiaMessage?: (text: string, mode: 'voice' | 'chat') => void
) {
  const engineRef = useRef(createEngine(name, email))
  const [screen, setScreen] = useState<Screen>('hero')
  const [state, setState] = useState<EngineState>(engineRef.current.getState())
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
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

      // Trigger TTS callback when ClaudIA generates a new message
      if (onClaudiaMessage && newState.messages.length > prevMsgCountRef.current) {
        const lastMsg = newState.messages[newState.messages.length - 1]
        if (lastMsg && lastMsg.role === 'claudia' && !newState.isProcessing) {
          // Small delay to let the message render first
          setTimeout(() => {
            onClaudiaMessage(lastMsg.text, newState.mode)
          }, 100)
        }
      }
      prevMsgCountRef.current = newState.messages.length
    })
  }, [onClaudiaMessage])

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
    async (mode: 'voice' | 'chat' = 'chat') => {
      setScreen('conversation')
      const engine = engineRef.current

      // Save lead to mock Airtable
      await saveLead({
        name,
        email,
        phase: 1,
        paymentStatus: 'pending',
      })

      // Send email notification
      sendNotification('new_lead', { name, email }).catch(console.error)

      // Start the conversation
      await engine.startConversation(mode)
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

  const selectPlan = useCallback(
    async (planName: string) => {
      const engine = engineRef.current
      await engine.selectPlan(planName)
      sendNotification('plan_shown', {
        name,
        email,
        planSelected: planName,
      }).catch(console.error)
    },
    [name, email]
  )

  const completePayment = useCallback(
    (plan: Plan) => {
      setSelectedPlan(plan)
      setScreen('payment-success')
      const engine = engineRef.current
      engine.setPaymentStatus('paid')
      sendNotification('payment', {
        name,
        email,
        planSelected: plan.name,
      }).catch(console.error)
    },
    [name, email]
  )

  const showExitModal = useCallback(() => {
    setScreen('exit')
  }, [])

  const closeExitModal = useCallback(() => {
    setScreen('conversation')
  }, [])

  const handleExitSubmit = useCallback(
    async (options: { ebooks: boolean; promotions: boolean; call: boolean; email: string }) => {
      sendNotification('no_sale', {
        name,
        email: options.email,
        exitReason: JSON.stringify(options),
      }).catch(console.error)
      setScreen('conversation')
    },
    [name]
  )

  const closePaymentSuccess = useCallback(() => {
    setScreen('conversation')
  }, [])

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
    engine: engineRef.current,
  }
}
