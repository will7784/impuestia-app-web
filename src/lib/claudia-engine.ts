// ClaudIA Conversation Engine — Simplificado: solo gestor de leads
// Flujo: Perfil rápido → Entrega guía → CTA reunión

export type Phase = 1 | 2
export type ConversationStep = number

export interface LeadProfile {
  name: string
  email: string
  companyType?: string
  taxRegime?: string
  meetingRequested?: boolean | null
}

export interface Message {
  id: string
  role: 'claudia' | 'user'
  text: string
  timestamp: number
  phase: Phase
  step: ConversationStep
  quickReplies?: string[]
}

export interface EngineState {
  phase: Phase
  step: ConversationStep
  profile: LeadProfile
  messages: Message[]
  isProcessing: boolean
  conversationActive: boolean
  mode: 'chat'
}

const COMPANY_TYPES: Record<string, string> = {
  'Empresario Individual': 'Empresa Individual',
  LTDA: 'Limitada (LTDA)',
  SPA: 'Sociedad por Acciones (SPA)',
  Comandita: 'Comandita',
  Cooperativa: 'Cooperativa',
  Otro: 'Otro tipo de empresa',
}

const TAX_REGIMES: Record<string, string> = {
  '14 ter': 'Régimen 14 ter',
  '14 bis': 'Régimen 14 bis',
  '14 quater': 'Régimen 14 quater',
  '14 sexies': 'Régimen 14 sexies',
  OTRO: 'Otro régimen',
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function createMessage(
  role: 'claudia' | 'user',
  text: string,
  phase: Phase,
  step: ConversationStep,
  quickReplies?: string[]
): Message {
  return {
    id: generateId(),
    role,
    text,
    timestamp: Date.now(),
    phase,
    step,
    quickReplies,
  }
}

function getTips(companyType?: string, taxRegime?: string): string {
  const tips: string[] = []

  if (companyType === 'Empresario Individual') {
    tips.push('Como empresario individual, revisa siempre que tus boletas de honorarios estén correctamente declaradas ante el SII.')
    tips.push('Evalúa si el régimen 14 ter te conviene para reducir tu carga fiscal.')
  } else if (companyType === 'LTDA') {
    tips.push('En una LTDA, es clave que las retiros de socios estén bien documentados para evitar problemas con el SII.')
    tips.push('Revisa que tus estados financieros estén presentados dentro de los plazos legales.')
  } else if (companyType === 'SPA') {
    tips.push('Las SPAs deben tener especial cuidado con la retención de impuestos a accionistas extranjeros.')
    tips.push('Asegúrate de cumplir con las normas de precios de transferencia si operas con empresas relacionadas.')
  } else {
    tips.push('Mantén al día tus declaraciones juradas mensuales para evitar multas por presentación extemporánea.')
    tips.push('Revisa periódicamente el estado de tu empresa en el SII (RUT, giro, deudas).')
  }

  if (taxRegime === '14 ter') {
    tips.push('En el 14 ter, recuerda que solo puedes deducir gastos con boletas de honorarios de hasta 12 UTA anuales.')
  } else if (taxRegime === '14 bis') {
    tips.push('El 14 bis te permite deducir más gastos; lleva un registro ordenado de todas tus facturas.')
  } else if (taxRegime === '14 quater') {
    tips.push('El 14 quater tiene reglas específicas para profesionales; verifica si tus ingresos superan los límites del régimen.')
  }

  // Tomar máximo 3 tips
  return tips.slice(0, 3).map((t, i) => `${i + 1}. ${t}`).join('\n')
}

// Mock DeepSeek response
async function mockDeepSeekResponse(
  _prompt: string,
  context: { phase: Phase; step: ConversationStep; profile: LeadProfile }
): Promise<{ text: string; quickReplies?: string[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { phase, step, profile } = context

      // Phase 1 — Perfil rápido
      if (phase === 1) {
        if (step === 0) {
          const greeting = profile.name
            ? `¡Hola ${profile.name}! Soy ClaudIA, tu asesora tributaria inteligente.`
            : `¡Hola! Soy ClaudIA, tu asesora tributaria inteligente.`
          resolve({
            text: `${greeting} Te ayudo a proteger tu negocio ante el SII. Para enviarte la guía con tips útiles, cuéntame: ¿qué tipo de empresa tienes?`,
            quickReplies: ['Empresario Individual', 'LTDA', 'SPA', 'Comandita', 'Cooperativa', 'Otro'],
          })
          return
        }
        if (step === 1) {
          resolve({
            text: `Perfecto. ¿Y qué régimen tributario utilizas actualmente?`,
            quickReplies: ['14 ter', '14 bis', '14 quater', '14 sexies', 'OTRO'],
          })
          return
        }
      }

      // Phase 2 — Entrega guía + CTA reunión
      if (phase === 2) {
        if (step === 0) {
          const companyLabel = COMPANY_TYPES[profile.companyType || ''] || profile.companyType || 'tu empresa'
          const regimeLabel = TAX_REGIMES[profile.taxRegime || ''] || profile.taxRegime || 'tu régimen'
          const tips = getTips(profile.companyType, profile.taxRegime)

          resolve({
            text: `¡Gracias! Tienes una ${companyLabel} bajo ${regimeLabel}. Aquí tienes tu guía **"Qué hacer si el SII te cita"** junto con algunos tips personalizados para ti:\n\n${tips}\n\n**📎 Guía adjunta:** *Pasos precisos ante una citación del SII*\n\nTe enviaré también un resumen a ${profile.email || 'tu correo'} en unos minutos.`,
          })
          return
        }
        if (step === 1) {
          resolve({
            text: `¿Te gustaría agendar una reunión gratuita con un asesor tributario para revisar tu caso en detalle?`,
            quickReplies: ['Sí, agendar reunión', 'No por ahora, gracias'],
          })
          return
        }
        if (step === 2) {
          if (profile.meetingRequested) {
            resolve({
              text: `¡Perfecto! Te estoy enviando un enlace para que agendes tu reunión. Nuestro equipo te contactará en menos de 24 horas.\n\n👉 [Agendar reunión](https://calendly.com/asesoriatributaria)\n\nGracias por confiar en ImpuestIA, ${profile.name || ''}. ¡Estamos aquí para lo que necesites!`,
            })
          } else {
            resolve({
              text: `Entendido, ${profile.name || ''}. Queda la puerta abierta cuando lo necesites. Revisa tu correo con la guía y los tips. ¡Éxito con tu negocio! 🚀`,
            })
          }
          return
        }
      }

      // Fallback
      resolve({
        text: `Entiendo. Cuéntame más para poder ayudarte de la mejor manera.`,
      })
    }, 600 + Math.random() * 800)
  })
}

// Main conversation engine class
export class ClaudiaEngine {
  private state: EngineState
  private listeners: Set<(state: EngineState) => void>

  constructor(name: string, email: string) {
    this.listeners = new Set()
    this.state = {
      phase: 1,
      step: 0,
      profile: {
        name,
        email,
      },
      messages: [],
      isProcessing: false,
      conversationActive: false,
      mode: 'chat',
    }
  }

  private notify() {
    const currentState = this.getState()
    this.listeners.forEach((listener) => listener(currentState))
  }

  getState(): EngineState {
    return { ...this.state, messages: [...this.state.messages] }
  }

  subscribe(listener: (state: EngineState) => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  async startConversation() {
    this.state = {
      ...this.state,
      conversationActive: true,
      isProcessing: true,
    }
    this.notify()

    const response = await mockDeepSeekResponse('', {
      phase: this.state.phase,
      step: this.state.step,
      profile: this.state.profile,
    })

    const msg = createMessage('claudia', response.text, this.state.phase, this.state.step, response.quickReplies)
    this.state.messages.push(msg)
    this.state.isProcessing = false
    this.notify()
  }

  async sendUserMessage(text: string) {
    const userMsg = createMessage('user', text, this.state.phase, this.state.step)
    this.state.messages.push(userMsg)
    this.state.isProcessing = true
    this.notify()

    this.updateProfile(text)

    const currentPhase = this.state.phase
    const currentStep = this.state.step

    // Advance logic
    let shouldAdvancePhase = false
    if (currentPhase === 1 && currentStep >= 1) {
      shouldAdvancePhase = true
    } else if (currentPhase === 2 && currentStep >= 2) {
      // End of conversation
    }

    if (shouldAdvancePhase && currentPhase < 2) {
      this.state.phase = (currentPhase + 1) as Phase
      this.state.step = 0
    } else if (!shouldAdvancePhase) {
      this.state.step = currentStep + 1
    }

    const response = await mockDeepSeekResponse(text, {
      phase: this.state.phase,
      step: this.state.step,
      profile: this.state.profile,
    })

    const claudiaMsg = createMessage(
      'claudia',
      response.text,
      this.state.phase,
      this.state.step,
      response.quickReplies
    )
    this.state.messages.push(claudiaMsg)
    this.state.isProcessing = false
    this.notify()
  }

  private updateProfile(text: string) {
    const { phase, step } = this.state

    if (phase === 1) {
      if (step === 0) {
        this.state.profile.companyType = text
      } else if (step === 1) {
        this.state.profile.taxRegime = text
      }
    } else if (phase === 2) {
      if (step === 1) {
        const lower = text.toLowerCase()
        this.state.profile.meetingRequested = lower.includes('sí') || lower.includes('si') || lower.includes('agendar')
      }
    }
  }

  getMessages(): Message[] {
    return [...this.state.messages]
  }

  getProfile(): LeadProfile {
    return { ...this.state.profile }
  }
}

// Factory function
export function createEngine(name: string, email: string): ClaudiaEngine {
  return new ClaudiaEngine(name, email)
}
