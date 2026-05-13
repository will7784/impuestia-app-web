import { sendNotification } from './email-service'
import type { EmailNotificationType } from './email-service'

export interface Ebook {
  id: string
  title: string
  description: string
  targetAgeRange: string
  targetCompanyType: string
  requiresSII: boolean
}

export interface LeadRecord {
  id: string
  name: string
  email: string
  companyType?: string
  revenue?: string
  role?: string
  ageRange?: string
  hasSIICitation?: boolean
  biggestWorry?: string
  phase: number
  ebookSelected?: string
  planSelected?: string
  paymentStatus: 'pending' | 'paid' | 'no_sale'
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = 'claudia_leads'
const LEADS_PREFIX = 'lead_'

function getStorageKey(): string {
  return `${STORAGE_KEY}_${LEADS_PREFIX}list`
}

export function saveLead(leadData: Omit<LeadRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ id: string; success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const record: LeadRecord = {
        ...leadData,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const existingLeads = getLeads()
      existingLeads.push(record)
      localStorage.setItem(getStorageKey(), JSON.stringify(existingLeads))

      console.log('[AirtableService] Lead saved:', record)
      resolve({ id, success: true })
    }, 400)
  })
}

export function getLeads(): LeadRecord[] {
  try {
    const stored = localStorage.getItem(getStorageKey())
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getLeadByEmail(email: string): LeadRecord | null {
  const leads = getLeads()
  return leads.find((l) => l.email === email) || null
}

export function updateLeadStatus(
  id: string,
  status: LeadRecord['paymentStatus']
): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const leads = getLeads()
      const index = leads.findIndex((l) => l.id === id)
      if (index !== -1) {
        leads[index].paymentStatus = status
        leads[index].updatedAt = new Date().toISOString()
        localStorage.setItem(getStorageKey(), JSON.stringify(leads))
      }
      console.log('[AirtableService] Lead status updated:', { id, status })
      resolve({ success: true })
    }, 300)
  })
}

export function getEbooks(): Ebook[] {
  return [
    {
      id: 'ebook_1',
      title: 'Guia del Emprendedor Tributario',
      description:
        'Todo lo que necesitas saber para manejar tus impuestos como emprendedor. Desde la inscripcion en el SII hasta las declaraciones mensuales.',
      targetAgeRange: '18-30',
      targetCompanyType: 'sole_proprietorship',
      requiresSII: false,
    },
    {
      id: 'ebook_2',
      title: 'Como Escalar sin Problemas con el SII',
      description:
        'Estrategias tributarias para empresas en crecimiento. Aprende a optimizar tu carga fiscal mientras expands tu negocio.',
      targetAgeRange: '31-45',
      targetCompanyType: 'growing',
      requiresSII: false,
    },
    {
      id: 'ebook_3',
      title: 'Planificacion Tributaria para Empresarios Consolidados',
      description:
        'Tecnicas avanzadas de planificacion fiscal para empresas establecidas. Maximiza tus beneficios legales.',
      targetAgeRange: '46-60',
      targetCompanyType: 'established',
      requiresSII: false,
    },
    {
      id: 'ebook_4',
      title: 'Sucesion Empresarial y Tributacion',
      description:
        'Guia completa sobre la transicion de negocios familiares y las implicaciones tributarias del proceso.',
      targetAgeRange: '60+',
      targetCompanyType: 'legacy',
      requiresSII: false,
    },
    {
      id: 'ebook_5',
      title: 'Defensa Efectiva Ante el SII',
      description:
        'Protocolo paso a paso para enfrentar citaciones y requerimientos del SII. Conoce tus derechos y como defenderte.',
      targetAgeRange: 'all',
      targetCompanyType: 'all',
      requiresSII: true,
    },
  ]
}

export function selectEbook(
  ageRange: string,
  _companyType: string,
  hasSII: boolean
): Ebook | null {
  const ebooks = getEbooks()

  // Priority: SII citation
  if (hasSII) {
    const siiEbook = ebooks.find((e) => e.requiresSII)
    if (siiEbook) return siiEbook
  }

  // Age-based selection
  const ageMap: Record<string, string> = {
    '18-30': '18-30',
    '31-45': '31-45',
    '46-60': '46-60',
    '60+': '60+',
  }

  const mappedAge = ageMap[ageRange] || '18-30'
  const matched = ebooks.find(
    (e) => e.targetAgeRange === mappedAge && !e.requiresSII
  )

  return matched || ebooks[0]
}

export function trackEvent(
  type: EmailNotificationType,
  data: Record<string, unknown>
): void {
  console.log('[AirtableService] Event tracked:', { type, data })
  sendNotification(type, data as Record<string, unknown> & { name?: string }).catch(console.error)
}
