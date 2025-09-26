'use client'

import { useParams, useRouter } from 'next/navigation'
import { useBlog } from '@/context/BlogContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card'
import {
    PencilIcon,
    TrashIcon,
    CalendarIcon,
    MoreHorizontal,
    ArrowLeftIcon,
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export default function PostDetailPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { getPostById, deletePost } = useBlog()
    const id = params.id
    const post = getPostById(id)

    if (!post) {
        return (
            <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/">
                        <ArrowLeftIcon className="size-4" /> Back
                    </Link>
                </Button>
                <p>Post not found.</p>
            </main>
        )
    }

    const current = post as NonNullable<typeof post>

    function handleDelete() {
        if (confirm('Delete this post?')) {
            deletePost(current.id)
            router.push('/')
        }
    }

    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
            <div className="mb-6 flex items-center justify-end gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <MoreHorizontal className="size-4" /> Actions
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link
                                href={`/posts/${current.id}/edit`}
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <PencilIcon className="size-4" /> Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="text-destructive focus:text-destructive"
                        >
                            <TrashIcon className="size-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{current.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                        <CalendarIcon className="size-4" /> {current.date} • by{' '}
                        {current.author} ({current.email})
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-none whitespace-pre-wrap">
                        {current.content}
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
