import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import { z } from 'zod'

const blogDir = path.join(process.cwd(), 'content/blog')

const frontmatterSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  date: z.string().trim().min(1),
  /** Path under `public/`, e.g. `/images/305doors/hero-1.jpg` */
  image: z.string().trim().min(1).optional(),
  imageAlt: z.string().trim().min(1).optional(),
})

export type BlogPostListItem = {
  slug: string
  title: string
  description: string
  date: string
  image?: string
  imageAlt?: string
}

export type BlogPost = BlogPostListItem & {
  content: string
}

function readSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return []
  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/i, ''))
}

export function allBlogSlugs(): string[] {
  return readSlugs()
}

export function getBlogPost(slug: string): BlogPost | null {
  const filePath = path.join(blogDir, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const parsed = frontmatterSchema.safeParse(data)
  if (!parsed.success) {
    console.error(`[blog] Invalid frontmatter for ${slug}:`, parsed.error.flatten())
    return null
  }

  return {
    slug,
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    ...(parsed.data.image ? { image: parsed.data.image } : {}),
    ...(parsed.data.imageAlt ? { imageAlt: parsed.data.imageAlt } : {}),
    content: content.trim(),
  }
}

export function getAllBlogPostsForArchive(): BlogPostListItem[] {
  return readSlugs()
    .map((slug) => getBlogPost(slug))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => {
      const ta = Date.parse(a.date)
      const tb = Date.parse(b.date)
      if (Number.isNaN(ta) || Number.isNaN(tb)) return 0
      return tb - ta
    })
    .map(({ slug, title, description, date, image, imageAlt }) => ({
      slug,
      title,
      description,
      date,
      ...(image ? { image } : {}),
      ...(imageAlt ? { imageAlt } : {}),
    }))
}

export function formatBlogDate(iso: string): string {
  const t = Date.parse(iso)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
