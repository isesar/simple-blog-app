'use client'

import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardAction,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    CalendarIcon,
    MoreHorizontal,
    PencilIcon,
    TrashIcon,
} from 'lucide-react'
import { Post } from '@/types/post'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export default function PostCard({
    post,
    onDelete,
}: {
    post: Post
    onDelete?: (id: string) => void
}) {
    const router = useRouter()

    function openDetails() {
        router.push(`/posts/${post.id}`)
    }

    return (
        <Card
            onClick={openDetails}
            className="h-full flex hover:shadow-sm transition cursor-pointer"
        >
            <CardHeader>
                <CardTitle className="text-base sm:text-lg line-clamp-1">
                    {post.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
                    <CalendarIcon className="size-3" /> {post.date}
                </CardDescription>
                <CardAction>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                aria-label="Open actions"
                            >
                                <MoreHorizontal className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onClick={(e) => {
                                e.stopPropagation()
                            }}
                        >
                            <DropdownMenuItem
                                onClick={() =>
                                    router.push(`/posts/${post.id}/edit`)
                                }
                                className="cursor-pointer flex items-center gap-2"
                            >
                                <PencilIcon className="size-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete?.(post.id)
                                }}
                            >
                                <TrashIcon className="size-4" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.summary}
                </p>
            </CardContent>
        </Card>
    )
}
