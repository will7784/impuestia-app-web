export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  tags: string[]
  author: string
  authorEmail: string
  date: string
  readTime: number
  imageUrl?: string
  status: 'published' | 'draft'
  linkedinShared?: boolean
  linkedinShareText?: string
}

const BLOG_POSTS_KEY = 'impuestia_blog_posts'

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post_1',
    title: 'Analisis articulo 21 de la LIR y como se aplica en la vida real',
    slug: 'analisis-articulo-21-lir',
    excerpt: 'Un analisis detallado del articulo 21 de la Ley sobre Impuesto a la Renta y su aplicacion practica en casos reales para contribuyentes chilenos.',
    content: `## Introduccion\n\nEl articulo 21 de la Ley sobre Impuesto a la Renta (LIR) establece las normas relativas a la determinacion de la renta liquida imponible de las empresas. En este articulo analizaremos su aplicacion practica.\n\n## Marco Legal\n\nEl articulo 21 de la LIR dispone:\n\n- La renta liquida imponible se determinara deduciendo del ingreso bruto los costos y gastos necesarios para producirla\n- Se deben considerar las normas especiales para ciertos sectores\n- La actualizacion monetaria aplica segun lo dispuesto por el SII\n\n## Casos Practicos\n\n### Caso 1: Empresa de Servicios\n\nUna empresa de servicios tecnologicos con ingresos por $500 millones anuales debe aplicar las siguientes consideraciones...\n\n### Caso 2: Comercio Minorista\n\nPara el comercio minorista, el articulo 21 tiene implicaciones especificas en...\n\n## Recomendaciones\n\n1. Mantener una contabilidad clara y ordenada\n2. Documentar todos los gastos deducibles\n3. Consultar con un asesor tributario ante dudas\n4. Mantenerse actualizado sobre las modificaciones normativas`,
    category: 'analisis normativo',
    tags: ['LIR', 'articulo 21', 'renta liquida', 'impuesto a la renta'],
    author: 'contacto@impuestia.cl',
    authorEmail: 'contacto@impuestia.cl',
    date: '2026-01-28T08:00:00.000Z',
    readTime: 8,
    status: 'published',
    linkedinShared: true,
    linkedinShareText: 'Nuevo analisis sobre el articulo 21 de la LIR y su impacto en las empresas chilenas.',
  },
  {
    id: 'post_2',
    title: 'Guia completa: Que hacer si el SII te cita',
    slug: 'guia-sii-citacion',
    excerpt: 'Pasos practicos y recomendaciones para manejar una citacion del SII de manera adecuada y proteger tus derechos como contribuyente.',
    content: `## Que hacer ante una citacion del SII?\n\nRecibir una citacion del Servicio de Impuestos Internos puede ser estresante. Esta guia te ayudara a manejar la situacion de manera calmada y efectiva.\n\n## Paso 1: Revisa el correo y buzon SII\n\nLa primera notificacion generalmente llega por correo electronico o a traves de tu buzon tributario en el sitio del SII.\n\n## Paso 2: Identifica el tipo de notificacion\n\n- **Citacion**: Reunion con el auditor\n- **Liquidacion**: Determinacion de impuestos adeudados\n- **Giro**: Notificacion de cambio de situacion tributaria\n\n## Paso 3: Consulta con un asesor\n\nAntes de responder al SII, es fundamental consultar con un asesor tributario que pueda guiarte en el proceso.`,
    category: 'defensa SII',
    tags: ['SII', 'citacion', 'defensa tributaria', 'guia practica'],
    author: 'contacto@impuestia.cl',
    authorEmail: 'contacto@impuestia.cl',
    date: '2026-02-10T14:00:00.000Z',
    readTime: 5,
    status: 'published',
    linkedinShared: false,
  },
  {
    id: 'post_3',
    title: 'Nuevas regulaciones para pymes 2026',
    slug: 'nuevas-regulaciones-pymes-2026',
    excerpt: 'Resumen de los cambios normativos que afectaran a las pymes chilenas durante el ano 2026 y como prepararse.',
    content: `## Cambios Normativos 2026\n\nEl gobierno ha anunciado una serie de modificaciones a la normativa tributaria que afectara directamente a las pymes...\n\n## Principales Modificaciones\n\n1. Nuevo regimen simplificado\n2. Cambios en la depreciacion acelerada\n3. Modificaciones al credito por capacitacion\n\n## Impacto por Sector\n\nCada sector de la economia se vera afectado de manera diferente...`,
    category: 'actualidad normativa',
    tags: ['pymes', 'regulaciones 2026', 'cambios normativos'],
    author: 'contacto@impuestia.cl',
    authorEmail: 'contacto@impuestia.cl',
    date: '2026-02-15T10:00:00.000Z',
    readTime: 6,
    status: 'draft',
    linkedinShared: false,
  },
]

function getPosts(): BlogPost[] {
  try {
    const stored = localStorage.getItem(BLOG_POSTS_KEY)
    return stored ? JSON.parse(stored) : [...DEFAULT_POSTS]
  } catch {
    return [...DEFAULT_POSTS]
  }
}

export function getAllPosts(): BlogPost[] {
  const posts = getPosts()
  localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts))
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPosts().find((p) => p.slug === slug)
}

export function getPostById(id: string): BlogPost | undefined {
  return getPosts().find((p) => p.id === id)
}

export function savePost(post: Omit<BlogPost, 'id' | 'date'> & { id?: string }): Promise<BlogPost> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts()
      const now = new Date().toISOString()

      if (post.id) {
        const index = posts.findIndex((p) => p.id === post.id)
        if (index !== -1) {
          const updated: BlogPost = {
            ...posts[index],
            ...post,
            date: now,
          }
          posts[index] = updated
          localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts))
          resolve(updated)
          return
        }
      }

      const newPost: BlogPost = {
        ...post as Omit<BlogPost, 'id' | 'date'>,
        id: `post_${Date.now()}`,
        date: now,
      }
      posts.push(newPost)
      localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts))
      resolve(newPost)
    }, 300)
  })
}

export function deletePost(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts().filter((p) => p.id !== id)
      localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts))
      resolve(true)
    }, 200)
  })
}

export function bulkDeletePosts(ids: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts().filter((p) => !ids.includes(p.id))
      localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts))
      resolve(true)
    }, 300)
  })
}

export function markPostAsSharedOnLinkedIn(id: string, shareText: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getPosts()
      const index = posts.findIndex((p) => p.id === id)
      if (index !== -1) {
        posts[index] = {
          ...posts[index],
          linkedinShared: true,
          linkedinShareText: shareText,
        }
        localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts))
      }
      resolve(true)
    }, 200)
  })
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getPosts().filter((p) => p.category === category)
}

export function getCategories(): BlogCategory[] {
  const posts = getPosts()
  const allCategories = [...new Set(posts.map((p) => p.category))]
  return [
    { id: 'all', name: 'Todas', slug: 'todas', count: posts.length },
    ...allCategories.map((name) => ({
      id: generateSlug(name),
      name,
      slug: generateSlug(name),
      count: posts.filter((p) => p.category === name).length,
    })),
  ]
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 80)
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  count: number
}

const CATEGORY_COLORS: Record<string, string> = {
  'analisis normativo': '#0073aa',
  'defensa sii': '#1e3a5f',
  'actualidad normativa': '#6b2d5c',
  'planificacion tributaria': '#22c55e',
  'guia practica': '#f59e0b',
  'default': '#0073aa',
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS['default']
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function seedInitialData(): void {
  const stored = localStorage.getItem(BLOG_POSTS_KEY)
  if (!stored) {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(DEFAULT_POSTS))
  }
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.toLowerCase()
  return getPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  )
}

export function getRelatedPosts(slug: string, category: string, limit: number = 3): BlogPost[] {
  return getPosts()
    .filter((p) => p.slug !== slug && p.category === category && p.status === 'published')
    .slice(0, limit)
}
