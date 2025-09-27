import { notFound } from 'next/navigation'
import { getAllSlugsSSG, getPostBySlugSSG } from '@/lib/blog'
import ClientPostReader from '@/components/ClientPostReader'
import PostArticle from '@/components/PostArticle'

export async function generateStaticParams() {
    const slugs = await getAllSlugsSSG('content')
    return slugs.map((handle) => ({ handle }))
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ handle: string }>
}) {
    const { handle } = await params
    const post = await getPostBySlugSSG(handle, 'content')
    if (!post) return { title: 'Post' }
    return {
        title: post.title,
        description: post.bio,
        alternates: { canonical: `/blog/${post.slug}` },
    }
}

export default async function UnifiedPostPage({
    params,
}: {
    params: { handle: string }
}) {
    const { handle } = await params

    const post = await getPostBySlugSSG(handle, 'content')
    if (post) {
        return (
            <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
                <PostArticle
                    title={post.title}
                    content={post.content}
                    date={post.date}
                    readTime={post.readTime}
                    bio={post.bio}
                    image={post.image}
                />
            </main>
        )
    }

    // Fallback to client post reader (CSR), which can access BlogContext
    if (!handle) return notFound()
    return <ClientPostReader handle={handle} />
}
