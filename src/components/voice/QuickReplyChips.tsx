interface QuickReplyChipsProps {
  options: string[]
  onSelect: (option: string) => void
  disabled?: boolean
}

export default function QuickReplyChips({
  options,
  onSelect,
  disabled = false,
}: QuickReplyChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4 px-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => !disabled && onSelect(option)}
          disabled={disabled}
          className="px-4 py-2 text-sm text-[#b0b0b0] border border-white/[0.2] rounded-full
                     hover:border-[#ff3366] hover:text-white hover:bg-[#ff3366]/10
                     transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:hover:border-white/[0.2] disabled:hover:text-[#b0b0b0] disabled:hover:bg-transparent"
          style={{ transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
