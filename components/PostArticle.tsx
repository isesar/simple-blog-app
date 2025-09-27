import React from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export type PostArticleProps = {
    title: string
    content: string
    date?: string
    readTime?: string
    bio?: string
    image?: string
}

export default function PostArticle({
    title,
    content,
    date,
    readTime,
    bio,
    image,
}: PostArticleProps) {
    return (
        <article className="prose-blog">
            <header className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                {(date || readTime) && (
                    <p className="text-muted-foreground text-sm">
                        {date ? new Date(date).toLocaleDateString() : null}
                        {readTime ? (date ? ' • ' : '') + readTime : null}
                    </p>
                )}
                {bio ? (
                    <p className="mt-2 text-muted-foreground">{bio}</p>
                ) : null}
                <hr className="mt-4 border-border" />
            </header>

            {image ? (
                <div className="mb-6">
                    <Image
                        src={image}
                        alt={title}
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
                {content}
            </ReactMarkdown>
        </article>
    )
}
