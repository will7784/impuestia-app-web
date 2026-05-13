export type EmailNotificationType =
  | 'new_lead'
  | 'phase_complete'
  | 'ebook_delivered'
  | 'plan_shown'
  | 'payment'
  | 'no_sale'

interface LeadData {
  name?: string
  email?: string
  companyType?: string
  revenue?: string
  role?: string
  ageRange?: string
  phase?: number
  ebook?: string
  planSelected?: string
  paymentStatus?: string
  exitReason?: string
}

export function sendNotification(
  type: EmailNotificationType,
  leadData: LeadData
): Promise<{ success: boolean; messageId: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const notificationMessages: Record<EmailNotificationType, string> = {
        new_lead: `[EMAIL] New lead captured: ${leadData.name} (${leadData.email}) - ${leadData.companyType || 'N/A'}`,
        phase_complete: `[EMAIL] Phase ${leadData.phase || '?'} completed by ${leadData.name || 'lead'}`,
        ebook_delivered: `[EMAIL] Ebook "${leadData.ebook}" delivered to ${leadData.email || 'lead'}`,
        plan_shown: `[EMAIL] Plans shown to ${leadData.name || 'lead'}`,
        payment: `[EMAIL] Payment received from ${leadData.name || 'lead'} for ${leadData.planSelected || 'plan'}`,
        no_sale: `[EMAIL] No-sale exit: ${leadData.name || 'lead'} - Reason: ${leadData.exitReason || 'N/A'}`,
      }

      console.log(`[EmailService] ${notificationMessages[type]}`)
      console.log(`[EmailService] Message ID: ${messageId}`)
      console.log(`[EmailService] Lead data:`, JSON.stringify(leadData, null, 2))

      resolve({ success: true, messageId })
    }, 300)
  })
}
