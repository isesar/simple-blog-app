import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import { z } from 'zod'
import type { PostMetadata as UnifiedPostMetadata } from '@/types/post'

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

        const files = fs.readdirSync(contentDir)
        const markdownPosts = files.filter((file) => file.endsWith('.md'))

        const posts = await Promise.all(
            markdownPosts.map(async (filename) => {
                try {
                    const filePath = path.join(contentDir, filename)
                    const fileContents = fs.readFileSync(filePath, 'utf8')
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
                    if (!raw.success)
                        throw new Error(
                            raw.error.message || 'Invalid frontmatter',
                        )

                    const mapped: PostMetadata = {
                        title: raw.data.title,
                        readTime: raw.data.read_time,
                        bio: raw.data.bio,
                        image: raw.data.image,
                        date: raw.data.date,
                        slug: filename.replace('.md', ''),
                        content: matterResult.content,
                    }

                    return mapped
                } catch (error) {
                    console.error(`Error processing file ${filename}:`, error)
                    return null
                }
            }),
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

export async function getPostBySlugSSG(
    slug: string,
    basePath?: string,
): Promise<PostMetadata | null> {
    try {
        const contentDir = path.join(process.cwd(), basePath || 'content')
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

        return mapped
    } catch (error) {
        console.error(`Error getting post by slug ${slug}:`, error)
        return null
    }
}
