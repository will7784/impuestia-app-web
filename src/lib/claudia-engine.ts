// ClaudIA Conversation Engine
// Simulates DeepSeek API responses with realistic Chilean Spanish

export type Phase = 1 | 2 | 3 | 4
export type ConversationStep = number

export interface LeadProfile {
  name: string
  email: string
  companyType?: string
  revenue?: string
  role?: string
  ageRange?: string
  hasSIICitation?: boolean
  biggestWorry?: string
  ebookSelected?: string
  planSelected?: string
  paymentStatus?: 'pending' | 'paid' | 'no_sale'
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
  mode: 'voice' | 'chat'
}

export interface Plan {
  id: string
  name: string
  price: string
  priceNumber: number
  features: string[]
  description: string
}

export const PLANS: Plan[] = [
  {
    id: 'basic',
    name: 'Plan Basico',
    price: '$29.900/mes',
    priceNumber: 29900,
    description: 'Para emprendedores y empresas pequenas',
    features: ['Consulta mensual', 'Revision de declaraciones', 'Soporte por email'],
  },
  {
    id: 'professional',
    name: 'Plan Profesional',
    price: '$59.900/mes',
    priceNumber: 59900,
    description: 'Para empresas en crecimiento',
    features: [
      'Todo lo anterior',
      'Representacion ante el SII',
      '2 consultas extra al mes',
      'Alertas preventivas',
    ],
  },
  {
    id: 'enterprise',
    name: 'Plan Empresarial',
    price: '$99.900/mes',
    priceNumber: 99900,
    description: 'Para empresas consolidadas',
    features: [
      'Todo lo anterior',
      'Recurso de proteccion',
      'Defensa penal tributaria',
      'Asesoramiento continuo',
    ],
  },
]

const TESTIMONIALS: Record<string, string> = {
  entrepreneur:
    '"Cuando empece mi pyme, el SII me tenia perdidisimo. Con la asesoria de Asesoria Tributaria, pude regularizar todo en menos de un mes. Ahora duermo tranquilo." — Camilo R., Santiago',
  growing:
    '"Recibi una citacion del SII y estaba temblando. El equipo me represento, prepararon toda la documentacion y salio todo bien. Vale cada peso." — Fernanda M., Providencia',
  established:
    '"Llevabamos anos pagando de mas en impuestos sin saberlo. Nos encontraron ahorros significativos y nos protegieron de posibles multas." — Roberto S., Las Condes',
  citation:
    '"Pense que me iban a multar con todo. La defensa fue impecable, presentaron todos los antecedentes y el SII cerro el caso. Increible trabajo." — Daniela P., Nunoa',
}

const COMPANY_TYPES: Record<string, string> = {
  'Empresario Individual': 'Empresa Individual',
  LTDA: 'Limitada (LTDA)',
  SPA: 'Sociedad por Acciones (SPA)',
  'Comandita': 'Comandita',
  Cooperativa: 'Cooperativa',
  'Otro': 'Otro tipo de empresa',
}

const AGE_RANGES: Record<string, string> = {
  '18-30': '18-30 anos',
  '31-45': '31-45 anos',
  '46-60': '46-60 anos',
  '60+': 'Mas de 60 anos',
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

// DeepSeek mock — simulates API call with realistic Chilean Spanish responses
async function mockDeepSeekResponse(
  _prompt: string,
  context: { phase: Phase; step: ConversationStep; profile: LeadProfile }
): Promise<{ text: string; quickReplies?: string[] }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { phase, step, profile } = context

      // Phase 1 — Welcome & Qualification
      if (phase === 1) {
        if (step === 0) {
          const greeting = profile.name
            ? `Hola ${profile.name}! Soy ClaudIA, tu asesora tributaria inteligente. Me da mucho gusto conocerte.`
            : `Hola! Soy ClaudIA, tu asesora tributaria inteligente. Me da mucho gusto conocerte.`
          resolve({
            text: `${greeting} Estoy aqui para ayudarte a proteger tu negocio y resolver cualquier duda que tengas con el SII. Voy a hacerte unas preguntas rapidas para entender mejor tu situacion y poder asesorarte de la mejor manera. Primero: cuentame, que tipo de empresa tienes?`,
            quickReplies: ['Empresario Individual', 'LTDA', 'SPA', 'Comandita', 'Cooperativa', 'Otro'],
          })
          return
        }
        if (step === 1) {
          const companyType = COMPANY_TYPES[profile.companyType || ''] || profile.companyType || 'tu empresa'
          resolve({
            text: `Perfecto, ${companyType}. Entendido. Ahora cuentame: cuantos anos tiene tu empresa y aproximadamente cuantos millones de pesos factura al ano?`,
          })
          return
        }
        if (step === 2) {
          resolve({
            text: `Bacan, gracias por compartir eso. Cual es tu cargo en la empresa?`,
            quickReplies: ['Dueño', 'Gerente', 'Contador', 'Administrativo', 'Otro'],
          })
          return
        }
        if (step === 3) {
          resolve({
            text: `Perfecto. Ultima pregunta de esta parte: en que rango de edad te encuentras?`,
            quickReplies: ['18-30', '31-45', '46-60', '60+'],
          })
          return
        }
        if (step === 4) {
          resolve({
            text: `Excelente, muchas gracias por la informacion ${profile.name || ''}! Ya tengo un panorama claro de tu situacion. Vamos ahora a lo importante: que te preocupa mas de tu situacion tributaria actual?`,
            quickReplies: [
              'Citaciones del SII',
              'Multas y sanciones',
              'No se que declarar',
              'Quiero pagar menos impuestos legalmente',
              'Necesito regularizar mi empresa',
            ],
          })
          return
        }
      }

      // Phase 2 — Pain Point & Diagnosis
      if (phase === 2) {
        if (step === 0) {
          const worry = profile.biggestWorry || 'tu situacion tributaria'
          const companyType = COMPANY_TYPES[profile.companyType || ''] || 'tu tipo de empresa'
          const ageLabel = AGE_RANGES[profile.ageRange || ''] || ''

          let diagnosis = `Entiendo tu preocupacion sobre "${worry}".`
          if (worry === 'Citaciones del SII') {
            diagnosis = `Entiendo perfectamente tu preocupacion sobre las citaciones del SII. Es una situacion estresante, pero quiero que sepas que hay solucion.`
          } else if (worry === 'Multas y sanciones') {
            diagnosis = `Las multas del SII son una pesadilla para cualquier empresario. La buena noticia es que muchas veces se pueden revertir o reducir con la estrategia correcta.`
          } else if (worry === 'No se que declarar') {
            diagnosis = `Es super comun sentirse perdido con las declaraciones. El sistema tributario chileno es complejo, pero con orientacion clara todo se simplifica.`
          } else if (worry === 'Quiero pagar menos impuestos legalmente') {
            diagnosis = `Eso es totalmente posible! Existen muchas herramientas legales de planificacion tributaria que la mayoria de los empresarios no conoce.`
          } else if (worry === 'Necesito regularizar mi empresa') {
            diagnosis = `La regularizacion es el primer paso para tranquilidad tributaria. Te felicito por tomar esta decision.`
          }

          resolve({
            text: `${diagnosis} Como tienes una ${companyType}${ageLabel ? ` y tienes ${ageLabel}` : ''}, hay aspectos especificos que debemos considerar. Has recibido alguna citacion o requerimiento del SII recientemente?`,
            quickReplies: ['Si, recibi una citacion', 'No, aun no', 'Recibi un requerimiento', 'No estoy seguro'],
          })
          return
        }
        if (step === 1) {
          const hasCitation = profile.hasSIICitation
          let response = ''

          if (hasCitation) {
            response = `Entiendo, eso debe ser muy estresante. Pero no te preocupes, tenemos mucha experiencia defendiendo empresarios ante el SII. Nuestro equipo ha gestionado mas de 500 casos exitosamente.`
          } else {
            response = `Que bueno saber eso! Pero es importante que estes preparado. Muchos empresarios reciben citaciones cuando menos lo esperan, especialmente cuando la empresa esta creciendo.`
          }

          // Share relevant testimonial
          const testimonialKey = hasCitation ? 'citation' : (profile.companyType === 'Empresario Individual' ? 'entrepreneur' : (profile.ageRange === '31-45' ? 'growing' : 'established'))
          const testimonial = TESTIMONIALS[testimonialKey]

          resolve({
            text: `${response}\n\n${testimonial}\n\nTe queria comentar que tengo una guia gratuita que te puede ser super util: "Guia Precisa: 7 Errores Tributarios que Costaron Millones a Empresarios Chilenos". Te la envio a tu correo?`,
            quickReplies: ['Si, enviame la guia', 'No por ahora', 'Cuentame mas'],
          })
          return
        }
        if (step === 2) {
          resolve({
            text: `Perfecto! Ahora voy a seleccionar un ebook que sea perfecto para tu perfil. Dame un momento...`,
          })
          return
        }
      }

      // Phase 3 — Ebook Nurturing
      if (phase === 3) {
        if (step === 0) {
          // Select ebook based on profile
          const age = profile.ageRange || '18-30'
          const hasSii = profile.hasSIICitation || false
          const companyType = profile.companyType || ''

          let ebookTitle = 'Guia del Emprendedor Tributario'
          let ebookDescription = 'Todo lo que necesitas saber para manejar tus impuestos como emprendedor.'

          if (hasSii) {
            ebookTitle = 'Defensa Efectiva Ante el SII'
            ebookDescription = 'Protocolo paso a paso para enfrentar citaciones y requerimientos del SII. Conoce tus derechos.'
          } else if (age === '18-30' || companyType === 'Empresario Individual') {
            ebookTitle = 'Guia del Emprendedor Tributario'
            ebookDescription = 'Todo lo que necesitas saber para manejar tus impuestos como emprendedor. Desde la inscripcion en el SII hasta las declaraciones mensuales.'
          } else if (age === '31-45') {
            ebookTitle = 'Como Escalar sin Problemas con el SII'
            ebookDescription = 'Estrategias tributarias para empresas en crecimiento. Aprende a optimizar tu carga fiscal mientras expands tu negocio.'
          } else if (age === '46-60') {
            ebookTitle = 'Planificacion Tributaria para Empresarios Consolidados'
            ebookDescription = 'Tecnicas avanzadas de planificacion fiscal para empresas establecidas. Maximiza tus beneficios legales.'
          } else if (age === '60+') {
            ebookTitle = 'Sucesion Empresarial y Tributacion'
            ebookDescription = 'Guia completa sobre la transicion de negocios familiares y las implicaciones tributarias del proceso.'
          }

          resolve({
            text: `Listo! Encontre el recurso perfecto para ti: "${ebookTitle}". ${ebookDescription}\n\nTe lo estoy enviando ahora a ${profile.email || 'tu correo'} junto con la Guia Precisa que te mencione antes.`,
          })
          return
        }
        if (step === 1) {
          resolve({
            text: `Ya te envie los recursos! Revisa tu correo en unos minutos.\n\nAhora, quisieras que te explique nuestros planes de asesoria tributaria? Tenemos opciones para todo tipo de empresa y presupuesto.`,
            quickReplies: ['Si, cuentame los planes', 'Mas tarde', 'Cual es el mas popular?'],
          })
          return
        }
      }

      // Phase 4 — Sale & Payment
      if (phase === 4) {
        if (step === 0) {
          resolve({
            text: `Perfecto! Te cuento nuestras opciones. Tenemos tres planes diseñados para diferentes necesidades:\n\n**Plan Basico** — $29.900/mes\nConsulta mensual + revision de declaraciones\n\n**Plan Profesional** — $59.900/mes\nTodo lo anterior + representacion ante el SII + 2 consultas extra\n\n**Plan Empresarial** — $99.900/mes\nTodo lo anterior + recurso de proteccion + defensa penal tributaria\n\nCual te interesa mas?`,
            quickReplies: ['Plan Basico', 'Plan Profesional', 'Plan Empresarial', 'Necesito mas informacion'],
          })
          return
        }
        if (step === 1) {
          const plan = PLANS.find((p) => p.name === profile.planSelected)
          if (plan) {
            resolve({
              text: `Excelente eleccion, ${profile.name || ''}! El ${plan.name} es ideal para tu perfil. A continuacion te muestro los detalles y el boton de pago seguro por WebPay.`,
            })
          } else {
            resolve({
              text: `Dime cual plan te interesa y te doy todos los detalles para que puedas pagar de forma segura.`,
            })
          }
          return
        }
        if (step === 2) {
          resolve({
            text: `El pago ha sido procesado correctamente! Bienvenido a Asesoria Tributaria. Fue un placer ayudarte ${profile.name || ''}! Tu asesor humano se pondra en contacto en menos de 24 horas. Mientras tanto, puedes programar tu primera consulta o descargar tu contrato.`,
          })
          return
        }
        if (step === 3) {
          resolve({
            text: `Perfecto, ya tienes todo listo. Te envie un resumen a tu correo con los proximos pasos. Gracias por confiar en nosotros, ${profile.name || ''}! Estamos aqui para lo que necesites.`,
          })
          return
        }
      }

      // Fallback
      resolve({
        text: `Entiendo perfectamente. Cuéntame mas para poder ayudarte de la mejor manera.`,
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

  async startConversation(mode: 'voice' | 'chat' = 'chat') {
    this.state = {
      ...this.state,
      conversationActive: true,
      mode,
      isProcessing: true,
    }
    this.notify()

    // Initial greeting
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

    // Update profile based on current phase/step
    this.updateProfile(text)

    // Advance step
    const currentPhase = this.state.phase
    const currentStep = this.state.step

    // Phase 1: steps 0-4 (5 steps)
    // Phase 2: steps 0-2 (3 steps)
    // Phase 3: steps 0-1 (2 steps)
    // Phase 4: steps 0-3 (4 steps)

    let shouldAdvancePhase = false

    if (currentPhase === 1 && currentStep >= 4) {
      shouldAdvancePhase = true
    } else if (currentPhase === 2 && currentStep >= 2) {
      shouldAdvancePhase = true
    } else if (currentPhase === 3 && currentStep >= 1) {
      shouldAdvancePhase = true
    } else if (currentPhase === 4 && currentStep >= 3) {
      // End of conversation
    }

    if (shouldAdvancePhase && currentPhase < 4) {
      this.state.phase = (currentPhase + 1) as Phase
      this.state.step = 0
    } else if (!shouldAdvancePhase) {
      this.state.step = currentStep + 1
    }

    // Get response from mock DeepSeek
    const response = await mockDeepSeekResponse(text, {
      phase: this.state.phase,
      step: this.state.step,
      profile: this.state.profile,
    })

    // After advancing, if we're in phase 3, auto-advance after showing ebook
    if (this.state.phase === 3 && this.state.step === 0) {
      const claudiaMsg = createMessage(
        'claudia',
        response.text,
        this.state.phase,
        this.state.step,
        response.quickReplies
      )
      this.state.messages.push(claudiaMsg)

      // Small delay then auto-send next phase message
      await new Promise((resolve) => setTimeout(resolve, 500))
      await this.advancePhaseAutomatically()
      return
    }

    // Phase 4, step 1: Show payment buttons
    if (this.state.phase === 4 && this.state.step === 1) {
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
      return
    }

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

  private async advancePhaseAutomatically() {
    const currentPhase = this.state.phase
    const currentStep = this.state.step

    // Get next phase response
    const response = await mockDeepSeekResponse('', {
      phase: currentPhase,
      step: currentStep,
      profile: this.state.profile,
    })

    const msg = createMessage('claudia', response.text, currentPhase, currentStep, response.quickReplies)
    this.state.messages.push(msg)
    this.state.isProcessing = false
    this.notify()
  }

  private updateProfile(text: string) {
    const { phase, step } = this.state

    if (phase === 1) {
      if (step === 0) {
        this.state.profile.companyType = text
      } else if (step === 1) {
        this.state.profile.revenue = text
      } else if (step === 2) {
        this.state.profile.role = text
      } else if (step === 3) {
        this.state.profile.ageRange = text
      } else if (step === 4) {
        this.state.profile.biggestWorry = text
      }
    } else if (phase === 2) {
      if (step === 0) {
        this.state.profile.biggestWorry = text
      } else if (step === 1) {
        this.state.profile.hasSIICitation =
          text.toLowerCase().includes('si') ||
          text.toLowerCase().includes('citacion') ||
          text.toLowerCase().includes('requerimiento')
      }
    } else if (phase === 3) {
      if (step === 0) {
        // Ebook was selected
      }
    } else if (phase === 4) {
      if (step === 0) {
        this.state.profile.planSelected = text
      }
    }
  }

  async selectPlan(planName: string) {
    this.state.profile.planSelected = planName
    await this.sendUserMessage(planName)
  }

  setPaymentStatus(status: 'pending' | 'paid' | 'no_sale') {
    this.state.profile.paymentStatus = status
    this.notify()
  }

  setMode(mode: 'voice' | 'chat') {
    this.state.mode = mode
    this.notify()
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
