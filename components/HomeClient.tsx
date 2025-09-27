'use client'

import React from 'react'
import { useBlog } from '@/context/BlogContext'
import type { Post } from '@/types/post'
import type { PostMetadata } from '@/lib/blog'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MoreHorizontal } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type HomeClientProps = {
    ssgPosts: PostMetadata[]
}

type CombinedItem =
    | { source: 'client'; post: Post }
    | { source: 'content'; post: PostMetadata }

function isClient(
    item: CombinedItem,
): item is { source: 'client'; post: Post } {
    return item.source === 'client'
}

export default function HomeClient({ ssgPosts }: HomeClientProps) {
    const { posts: clientPosts, deletePost } = useBlog()
    const router = useRouter()

    // Merge client-created posts and content posts, then sort by date (newest first)
    const combined: CombinedItem[] = [
        ...clientPosts.map(
            (p) => ({ source: 'client', post: p }) as CombinedItem,
        ),
        ...ssgPosts.map(
            (p) => ({ source: 'content', post: p }) as CombinedItem,
        ),
    ].sort((a, b) => {
        const getDateTs = (x: CombinedItem): number => {
            const d: string | undefined = isClient(x)
                ? x.post.date
                : x.post.date
            if (!d) return 0
            const t = Date.parse(d)
            return Number.isNaN(t) ? 0 : t
        }
        const diff = getDateTs(b) - getDateTs(a)
        if (diff !== 0) return diff
        // Tie-breaker: prioritize client posts
        if (isClient(a) && !isClient(b)) return -1
        if (!isClient(a) && isClient(b)) return 1
        return 0
    })

    if (combined.length === 0) {
        return (
            <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
                <div className="border rounded-2xl p-8 text-center text-muted-foreground">
                    <p className="mb-4">
                        No posts yet. Create your first blog post.
                    </p>
                    <Button asChild>
                        <Link href="/posts/new">Create Post</Link>
                    </Button>
                </div>
            </main>
        )
    }

    const [first, ...rest] = combined

    return (
        <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">Latest Posts</h1>
                <Button asChild>
                    <Link href="/posts/new">New Post</Link>
                </Button>
            </div>

            {/* Hero / main post */}
            <HeroCard
                item={first}
                onDelete={deletePost}
                routerPush={router.push}
            />

            {/* Rest of posts */}
            {rest.length > 0 && (
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rest.map((item, idx) => (
                        <PostListItem
                            key={idx}
                            item={item}
                            onDelete={deletePost}
                            routerPush={router.push}
                        />
                    ))}
                </div>
            )}
        </main>
    )
}

function HeroCard({
    item,
    onDelete,
    routerPush,
}: {
    item: CombinedItem
    onDelete: (id: string) => void
    routerPush: (href: string) => void
}) {
    if (isClient(item)) {
        const p = item.post
        return (
            <Card
                className="rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => routerPush(`/blog/${p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        routerPush(`/blog/${p.id}`)
                    }
                }}
            >
                <CardHeader className="px-6">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">
                                {p.title}
                            </CardTitle>
                            <CardDescription>
                                {p.summary ||
                                    p.content?.slice(0, 140) +
                                        (p.content.length > 140 ? '…' : '')}
                            </CardDescription>
                        </div>
                        <CardMenu
                            onOpen={(e) => e.stopPropagation()}
                            items={[
                                {
                                    label: 'Open',
                                    action: () => routerPush(`/blog/${p.id}`),
                                },
                                {
                                    label: 'Edit',
                                    action: () =>
                                        routerPush(`/posts/${p.id}/edit`),
                                },
                                {
                                    label: 'Delete',
                                    action: () => onDelete(p.id),
                                    variant: 'destructive' as const,
                                },
                            ]}
                        />
                    </div>
                </CardHeader>
            </Card>
        )
    }

    const p = item.post
    return (
        <Card
            className="rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => routerPush(`/blog/${p.slug}`)}
            role="button"
            tabIndex={0}
        >
            <CardHeader className="px-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl">{p.title}</CardTitle>
                        <CardDescription>{p.bio}</CardDescription>
                    </div>
                    <CardMenu
                        onOpen={(e) => e.stopPropagation()}
                        items={[
                            {
                                label: 'Open',
                                action: () => routerPush(`/blog/${p.slug}`),
                            },
                        ]}
                    />
                </div>
            </CardHeader>
        </Card>
    )
}

function PostListItem({
    item,
    onDelete,
    routerPush,
}: {
    item: CombinedItem
    onDelete: (id: string) => void
    routerPush: (href: string) => void
}) {
    if (isClient(item)) {
        const p = item.post
        return (
            <Card
                className="cursor-pointer"
                onClick={() => routerPush(`/blog/${p.id}`)}
                role="button"
                tabIndex={0}
            >
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <CardTitle className="line-clamp-1">
                                {p.title}
                            </CardTitle>
                            {p.summary && (
                                <CardDescription className="line-clamp-2">
                                    {p.summary}
                                </CardDescription>
                            )}
                        </div>
                        <CardMenu
                            onOpen={(e) => e.stopPropagation()}
                            items={[
                                {
                                    label: 'Open',
                                    action: () => routerPush(`/posts/${p.id}`),
                                },
                                {
                                    label: 'Edit',
                                    action: () =>
                                        routerPush(`/posts/${p.id}/edit`),
                                },
                                {
                                    label: 'Delete',
                                    action: () => onDelete(p.id),
                                    variant: 'destructive' as const,
                                },
                            ]}
                        />
                    </div>
                </CardHeader>
            </Card>
        )
    }

    const p = item.post
    return (
        <Card
            className="cursor-pointer"
            onClick={() => routerPush(`/blog/${p.slug}`)}
            role="button"
            tabIndex={0}
        >
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="line-clamp-1">
                            {p.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                            {p.bio}
                        </CardDescription>
                    </div>
                    <CardMenu
                        onOpen={(e) => e.stopPropagation()}
                        items={[
                            {
                                label: 'Open',
                                action: () => routerPush(`/blog/${p.slug}`),
                            },
                        ]}
                    />
                </div>
            </CardHeader>
        </Card>
    )
}

function CardMenu({
    items,
    onOpen,
}: {
    items: {
        label: string
        action: () => void
        variant?: 'default' | 'destructive'
    }[]
    onOpen?: (e: React.MouseEvent) => void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    aria-label="Card actions"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-accent"
                    onClick={onOpen}
                >
                    <MoreHorizontal className="size-4" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {items.map((it, i) => (
                    <DropdownMenuItem
                        key={i}
                        variant={it.variant}
                        onClick={(e) => {
                            e.stopPropagation()
                            it.action()
                        }}
                    >
                        {it.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
