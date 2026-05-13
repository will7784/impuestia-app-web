import { Linkedin, Twitter, Facebook, MessageCircle } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  excerpt?: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0a66c2',
      bgColor: '#0a66c215',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#1da1f2',
      bgColor: '#1da1f215',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877f2',
      bgColor: '#1877f215',
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`,
      color: '#25d366',
      bgColor: '#25d36615',
    },
  ]

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {shareLinks.map((link) => {
        const Icon = link.icon
        return (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartir en ${link.name}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
            style={{
              backgroundColor: link.bgColor,
              color: link.color,
            }}
          >
            <Icon size={16} />
            <span className="hidden sm:inline">{link.name}</span>
          </a>
        )
      })}
    </div>
  )
}
