import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { getPostBySlugSSG, getPostMetadataSSG } from '@/lib/blog'

export async function generateStaticParams() {
    const posts = await getPostMetadataSSG('content')
    return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string }
}) {
    const post = await getPostBySlugSSG(params.slug, 'content')
    if (!post) return { title: 'Post not found' }
    return {
        title: post.title,
        description: post.bio,
        alternates: { canonical: `/blog/${post.slug}` },
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string }
}) {
    const post = await getPostBySlugSSG(params.slug, 'content')
    if (!post) return notFound()

    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
            <article className="prose-blog">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                    <p className="text-muted-foreground text-sm">
                        {post.date
                            ? new Date(post.date).toLocaleDateString()
                            : null}
                        {post.readTime
                            ? (post.date ? ' • ' : '') + post.readTime
                            : null}
                    </p>
                    {post.bio && (
                        <p className="mt-2 text-muted-foreground">{post.bio}</p>
                    )}
                    <hr className="mt-4 border-border" />
                </header>

                {post.image ? (
                    <div className="mb-6">
                        <Image
                            src={post.image}
                            alt={post.title}
                            width={1200}
                            height={630}
                            className="rounded-xl border"
                        />
                    </div>
                ) : null}

                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {post.content}
                </ReactMarkdown>
            </article>
        </main>
    )
}
