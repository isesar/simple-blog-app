export type Post = {
    id: string
    title: string
    summary: string
    content: string
    author: string
    email: string
    date: string
    readTime: string
}

// Metadata for markdown-backed posts. Reuses fields from Post for consistency.
export type PostMetadata = Pick<Post, 'title' | 'content' | 'readTime'> & {
    date?: string
    slug: string
    bio: string
}
