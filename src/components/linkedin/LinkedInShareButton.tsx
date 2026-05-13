import { useState, useCallback } from 'react'

interface LinkedInShareButtonProps {
  url: string
  title?: string
  summary?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LinkedInShareButton({
  url,
  title,
  summary,
  size = 'md',
}: LinkedInShareButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }

  const handleClick = useCallback(() => {
    const shareUrl = new URL('https://www.linkedin.com/sharing/share-offsite/')
    shareUrl.searchParams.set('url', url)
    if (title) shareUrl.searchParams.set('title', title)
    if (summary) shareUrl.searchParams.set('summary', summary)

    const width = 600
    const height = 500
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    window.open(
      shareUrl.toString(),
      'linkedin-share',
      `width=${width},height=${height},left=${left},top=${top},noopener,noreferrer`,
    )
  }, [url, title, summary])

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      title="Compartir en LinkedIn"
      className={`
        ${sizeClasses[size]}
        rounded-lg flex items-center justify-center
        transition-all duration-200
        hover:brightness-110 hover:shadow-lg
        active:scale-95
      `}
      style={{
        backgroundColor: '#0077B5',
        transform: isPressed ? 'scale(0.92)' : 'scale(1)',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      aria-label="Compartir en LinkedIn"
    >
      <svg
        width={iconSizes[size]}
        height={iconSizes[size]}
        viewBox="0 0 24 24"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </button>
  )
}
