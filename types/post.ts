export type Post = {
    id: string
    title: string // max 50
    summary: string // max 250
    content: string
    author: string // max 40
    email: string // valid email
    date: string // ISO or YYYY-MM-DD
    readTime: string // e.g. "5 min read"
}

// Metadata for markdown-backed posts. Reuses fields from Post for consistency.
export type PostMetadata = Pick<Post, 'title' | 'content' | 'readTime'> & {
    date?: string
    slug: string
    bio: string
    image?: string
}
