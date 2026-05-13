import type { LeadProfile } from '@/lib/claudia-engine'

interface LeadProfileCardProps {
  profile: LeadProfile
  currentPhase: number
}

export default function LeadProfileCard({ profile }: LeadProfileCardProps) {
  const fields = [
    { label: 'Nombre', value: profile.name, collected: !!profile.name },
    { label: 'Email', value: profile.email, collected: !!profile.email },
    { label: 'Tipo de Empresa', value: profile.companyType, collected: !!profile.companyType },
    { label: 'Facturacion', value: profile.revenue, collected: !!profile.revenue },
    { label: 'Cargo', value: profile.role, collected: !!profile.role },
    { label: 'Rango de Edad', value: profile.ageRange, collected: !!profile.ageRange },
    { label: 'Preocupacion', value: profile.biggestWorry, collected: !!profile.biggestWorry },
    {
      label: 'Citacion SII',
      value: profile.hasSIICitation ? 'Si' : profile.hasSIICitation === false ? 'No' : undefined,
      collected: profile.hasSIICitation !== undefined,
    },
  ]

  const collectedCount = fields.filter((f) => f.collected).length

  return (
    <div
      className="rounded-2xl p-4 border border-white/[0.08]"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Perfil del Lead
        </h3>
        <span className="text-xs text-[#b0b0b0]">
          {collectedCount}/{fields.length}
        </span>
      </div>

      <div className="space-y-2">
        {fields.map((field) => (
          <div key={field.label} className="flex items-center justify-between">
            <span className="text-xs text-[#b0b0b0]">{field.label}</span>
            <div className="flex items-center gap-1.5">
              {field.value ? (
                <span className="text-xs text-white truncate max-w-[120px]">{field.value}</span>
              ) : (
                <span className="text-xs text-[#b0b0b0]/40">Pendiente</span>
              )}
              {field.collected && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="6" fill="#22c55e" />
                  <path d="M3 6L5 8L9 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {!field.collected && (
                <div className="w-3 h-3 rounded-full border border-white/[0.15]" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
