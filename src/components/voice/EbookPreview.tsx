import { selectEbook } from '@/lib/airtable-service'
import { BookOpen } from 'lucide-react'

interface EbookPreviewProps {
  ageRange?: string
  companyType?: string
  hasSII?: boolean
}

export default function EbookPreview({
  ageRange = '18-30',
  companyType = 'Sole Proprietorship',
  hasSII = false,
}: EbookPreviewProps) {
  const ebook = selectEbook(ageRange, companyType, hasSII)

  if (!ebook) return null

  return (
    <div
      className="w-full rounded-xl border border-white/[0.08] p-4"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
        Ebook Seleccionado
      </h3>

      <div className="flex items-start gap-3">
        {/* Ebook icon */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-lg bg-[#ff3366]/10 border border-[#ff3366]/20
                      flex items-center justify-center"
        >
          <BookOpen size={24} className="text-[#ff3366]" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white leading-snug">
            {ebook.title}
          </h4>
          <p className="text-xs text-[#b0b0b0] mt-1 line-clamp-2">
            {ebook.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 text-[#ff3366]">
        <div className="w-1.5 h-1.5 rounded-full bg-[#ff3366] animate-pulse" />
        <span className="text-xs">Enviando a tu correo...</span>
      </div>
    </div>
  )
}
