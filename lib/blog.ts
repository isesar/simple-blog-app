import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import { z } from 'zod'
import type { PostMetadata as UnifiedPostMetadata } from '@/types/post'

// Simple in-memory cache to avoid re-reading/parsing the same files repeatedly
// Note: Next.js may run some functions in separate processes; caching is best-effort.
const isProd = process.env.NODE_ENV === 'production'
const postBySlugCache = new Map<string, UnifiedPostMetadata>()
const slugsCache = new Map<string, string[]>() // key: contentDir

// Frontmatter schema (raw), later mapped to unified PostMetadata
const FrontmatterSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    read_time: z.string().min(1, 'Read time is required'),
    bio: z.string().min(1, 'Bio is required'),
    image: z.string().url('Invalid image URL').optional(),
    date: z.string().optional(),
})

export type PostMetadata = UnifiedPostMetadata

export async function getPostMetadataSSG(
    basePath?: string,
): Promise<PostMetadata[]> {
    try {
        const contentDir = path.join(process.cwd(), basePath || 'content')

        // Check if directory exists
        if (!fs.existsSync(contentDir)) {
            console.warn(`Content directory not found: ${contentDir}`)
            return []
        }

        const slugs = await getAllSlugsSSG(basePath)

        const posts = await Promise.all(
            slugs.map(async (slug) => getPostBySlugSSG(slug, basePath)),
        )

        // Filter out null values
        const validPosts = posts.filter(
            (post): post is PostMetadata => post !== null,
        )

        // Sort posts by date (newest first)
        const sortedPosts = validPosts.sort((a, b) => {
            if (a.date && b.date) {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            }
            return 0
        })

        return sortedPosts
    } catch (error) {
        console.error('Error getting post metadata:', error)
        return []
    }
}

// Lightweight function to list all markdown slugs without parsing file contents
export async function getAllSlugsSSG(basePath?: string): Promise<string[]> {
    const contentDir = path.join(process.cwd(), basePath || 'content')
    if (!fs.existsSync(contentDir)) return []
    const cacheKey = contentDir
    if (isProd && slugsCache.has(cacheKey)) return slugsCache.get(cacheKey)!

    const files = fs.readdirSync(contentDir)
    const slugs = files
        .filter((file) => file.endsWith('.md'))
        .map((filename) => filename.replace('.md', ''))

    if (isProd) slugsCache.set(cacheKey, slugs)
    return slugs
}

export async function getPostBySlugSSG(
    slug: string,
    basePath?: string,
): Promise<PostMetadata | null> {
    try {
        const contentDir = path.join(process.cwd(), basePath || 'content')
        const cacheKey = path.join(contentDir, slug)
        if (isProd && postBySlugCache.has(cacheKey)) {
            return postBySlugCache.get(cacheKey)!
        }
        const fullPath = path.join(contentDir, `${slug}.md`)

        if (!fs.existsSync(fullPath)) {
            return null
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        const raw = FrontmatterSchema.safeParse({
            title: matterResult.data.title,
            read_time: matterResult.data.read_time || '5 min read',
            bio:
                matterResult.data.description ||
                matterResult.data.bio ||
                'No description available',
            image: matterResult.data.image,
            date: matterResult.data.date,
        })
        if (!raw.success) return null

        const mapped: PostMetadata = {
            title: raw.data.title,
            readTime: raw.data.read_time,
            bio: raw.data.bio,
            image: raw.data.image,
            date: raw.data.date,
            slug,
            content: matterResult.content,
        }

        if (isProd) postBySlugCache.set(cacheKey, mapped)
        return mapped
    } catch (error) {
        console.error(`Error getting post by slug ${slug}:`, error)
        return null
    }
}
