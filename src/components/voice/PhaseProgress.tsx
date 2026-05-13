import type { Phase } from '@/lib/claudia-engine'

interface PhaseProgressProps {
  currentPhase: Phase
}

const PHASES: { label: string; num: Phase }[] = [
  { label: 'Bienvenida', num: 1 },
  { label: 'Diagnostico', num: 2 },
  { label: 'Nutricion', num: 3 },
  { label: 'Venta', num: 4 },
]

export default function PhaseProgress({ currentPhase }: PhaseProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1 mb-2">
        {PHASES.map((phase, index) => {
          const isCompleted = phase.num < currentPhase
          const isCurrent = phase.num === currentPhase

          return (
            <div key={phase.num} className="flex-1 flex items-center">
              <div
                className="w-full h-2 rounded-full transition-all duration-500"
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: isCompleted
                    ? '#ff3366'
                    : isCurrent
                    ? 'transparent'
                    : 'rgba(255,255,255,0.1)',
                  border: isCurrent ? '2px solid #ff3366' : 'none',
                }}
              />
              {index < PHASES.length - 1 && (
                <div
                  className="w-2 h-px flex-shrink-0"
                  style={{
                    backgroundColor: isCompleted ? '#ff3366' : 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between">
        {PHASES.map((phase) => {
          const isCurrent = phase.num === currentPhase
          return (
            <span
              key={phase.num}
              className="text-[11px] font-medium transition-colors duration-300"
              style={{
                color: isCurrent ? '#ff3366' : '#b0b0b0',
              }}
            >
              {phase.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}
