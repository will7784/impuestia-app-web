export interface LinkedInPost {
  id: string
  blogPostId: string
  blogPostTitle: string
  shareText: string
  shareUrl: string
  publishedAt: string
  status: 'published' | 'scheduled' | 'draft'
  impressions: number
  clicks: number
  reactions: number
  comments: number
}

export interface BlogPostForShare {
  title: string
  excerpt: string
  category: string
  tags: string[]
}

export interface LinkedInTemplate {
  id: string
  name: string
  content: string
  isDefault?: boolean
}

const STORAGE_KEY = 'impuestia_linkedin_posts'
const CONNECTION_KEY = 'impuestia_linkedin_connected'
const TEMPLATES_KEY = 'impuestia_linkedin_templates'

// Generate LinkedIn share URL (opens LinkedIn sharing dialog)
export function generateLinkedInShareUrl(
  postUrl: string,
  title?: string,
  summary?: string,
): string {
  const url = new URL('https://www.linkedin.com/sharing/share-offsite/')
  url.searchParams.set('url', postUrl)
  if (title) url.searchParams.set('title', title)
  if (summary) url.searchParams.set('summary', summary)
  return url.toString()
}

// Generate auto post text from blog post
export function generateAutoPostText(post: BlogPostForShare): string {
  const hashtags = post.tags
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`))
    .join(' ')
  const categoryTag = post.category
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '')

  const text = `Acabamos de publicar un nuevo articulo: "${post.title}"

${post.excerpt}

Lee el articulo completo aqui: ${generateBlogPostUrl(post.title)}

#${categoryTag} ${hashtags} #ImpuestIA #Chile #SII #Tributario`

  return text
}

// Helper: generate a blog post URL
function generateBlogPostUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
  return `https://impuestia.cl/blog/${slug}`
}

// Get stored posts from localStorage
function getStoredPosts(): LinkedInPost[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as LinkedInPost[]) : []
  } catch {
    return []
  }
}

// Save posts to localStorage
function savePosts(posts: LinkedInPost[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

// Generate mock analytics
function generateMockAnalytics(): {
  impressions: number
  clicks: number
  reactions: number
  comments: number
} {
  return {
    impressions: Math.floor(Math.random() * 2000) + 200,
    clicks: Math.floor(Math.random() * 150) + 10,
    reactions: Math.floor(Math.random() * 80) + 5,
    comments: Math.floor(Math.random() * 20) + 1,
  }
}

// Mock: Publish to LinkedIn (stores in localStorage)
export async function publishToLinkedIn(
  blogPostId: string,
  blogPostTitle: string,
  customText?: string,
): Promise<LinkedInPost> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const posts = getStoredPosts()
  const analytics = generateMockAnalytics()

  const post: LinkedInPost = {
    id: `li_${Date.now()}`,
    blogPostId,
    blogPostTitle,
    shareText:
      customText ||
      `Nuevo articulo: ${blogPostTitle}\n\nLee mas en impuestia.cl`,
    shareUrl: generateBlogPostUrl(blogPostTitle),
    publishedAt: new Date().toISOString(),
    status: 'published',
    ...analytics,
  }

  posts.unshift(post)
  savePosts(posts)

  return post
}

// Get all published LinkedIn posts
export function getLinkedInPosts(): LinkedInPost[] {
  return getStoredPosts()
}

// Get connection status
export function getLinkedInConnectionStatus(): 'connected' | 'disconnected' | 'pending' {
  const status = localStorage.getItem(CONNECTION_KEY)
  if (status === 'connected') return 'connected'
  if (status === 'pending') return 'pending'
  return 'disconnected'
}

// Set connection status
export function setLinkedInConnectionStatus(
  status: 'connected' | 'disconnected' | 'pending',
): void {
  localStorage.setItem(CONNECTION_KEY, status)
}

// Schedule a post
export function scheduleLinkedInPost(
  blogPostId: string,
  blogPostTitle: string,
  scheduledDate: string,
  text?: string,
): LinkedInPost {
  const posts = getStoredPosts()
  const analytics = generateMockAnalytics()

  const post: LinkedInPost = {
    id: `li_scheduled_${Date.now()}`,
    blogPostId,
    blogPostTitle,
    shareText:
      text ||
      `Nuevo articulo: ${blogPostTitle}\n\nLee mas en impuestia.cl`,
    shareUrl: generateBlogPostUrl(blogPostTitle),
    publishedAt: scheduledDate,
    status: 'scheduled',
    ...analytics,
  }

  posts.unshift(post)
  savePosts(posts)

  return post
}

// Get analytics for a post
export function getLinkedInAnalytics(
  postId: string,
): { impressions: number; clicks: number; reactions: number; comments: number } {
  const posts = getStoredPosts()
  const post = posts.find((p) => p.id === postId)
  if (post) {
    return {
      impressions: post.impressions,
      clicks: post.clicks,
      reactions: post.reactions,
      comments: post.comments,
    }
  }
  return { impressions: 0, clicks: 0, reactions: 0, comments: 0 }
}

// Delete a LinkedIn post
export function deleteLinkedInPost(postId: string): void {
  const posts = getStoredPosts().filter((p) => p.id !== postId)
  savePosts(posts)
}

// Get connection status
export function getConnectionStatus(): { connected: boolean; status: 'connected' | 'disconnected' | 'pending'; accountName?: string; lastSync?: string } {
  const status = localStorage.getItem(CONNECTION_KEY)
  const state: 'connected' | 'disconnected' | 'pending' = status === 'connected' ? 'connected' : status === 'pending' ? 'pending' : 'disconnected'
  return {
    connected: state === 'connected',
    status: state,
    accountName: state === 'connected' ? 'ImpuestIA' : undefined,
    lastSync: state === 'connected' ? new Date().toISOString() : undefined,
  }
}

// Get templates
export function getTemplates(): LinkedInTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_KEY)
    return stored ? (JSON.parse(stored) as LinkedInTemplate[]) : []
  } catch {
    return []
  }
}

// Save template
export function saveTemplate(template: LinkedInTemplate): void {
  const templates = getTemplates()
  const index = templates.findIndex((t) => t.id === template.id)
  if (index !== -1) {
    templates[index] = template
  } else {
    templates.push(template)
  }
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

// Delete template
export function deleteTemplate(id: string): void {
  const templates = getTemplates().filter((t) => t.id !== id)
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

// Set default template
export function setDefaultTemplate(id: string): void {
  const templates = getTemplates().map((t) => ({
    ...t,
    isDefault: t.id === id,
  }))
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}
