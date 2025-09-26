import matter from 'gray-matter'
import path from 'path'
import fs from 'fs'
import { z } from 'zod'

// Blog Post Schema
export const PostMetadataSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    read_time: z.string().min(1, 'Read time is required'),
    bio: z.string().min(1, 'Bio is required'),
    slug: z.string().min(1, 'Slug is required'),
    image: z.string().url('Invalid image URL').optional(),
    date: z.string().datetime('Invalid date format').optional(),
    content: z.string().min(1, 'Content is required'),
})
export type PostMetadata = z.infer<typeof PostMetadataSchema>

export const PostMetadataArraySchema = z.array(PostMetadataSchema)
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

                    const postData = {
                        title: matterResult.data.title || 'Untitled',
                        read_time: matterResult.data.read_time || '5 min read',
                        bio:
                            matterResult.data.description ||
                            matterResult.data.bio ||
                            'No description available',
                        image: matterResult.data.image,
                        date: matterResult.data.date,
                        slug: filename.replace('.md', ''),
                        content: matterResult.content,
                    }

                    // Validate with Zod
                    return PostMetadataSchema.parse(postData)
                } catch (error) {
                    console.error(`Error processing file ${filename}:`, error)
                    return null
                }
            }),
        )

        // Filter out null values and validate array
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

        return PostMetadataArraySchema.parse(sortedPosts)
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

        const postData = {
            title: matterResult.data.title || 'Untitled',
            read_time: matterResult.data.read_time || '5 min read',
            bio:
                matterResult.data.description ||
                matterResult.data.bio ||
                'No description available',
            image: matterResult.data.image,
            date: matterResult.data.date,
            slug: slug,
            content: matterResult.content,
        }

        return PostMetadataSchema.parse(postData)
    } catch (error) {
        console.error(`Error getting post by slug ${slug}:`, error)
        return null
    }
}
