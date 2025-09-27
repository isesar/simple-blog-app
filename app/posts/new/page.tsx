'use client'

import { useRouter } from 'next/navigation'
import PostForm from '@/components/PostForm'
import { useBlog } from '@/context/BlogContext'
import { toast } from '@/components/ui/sonner'

export default function NewPostPage() {
    const router = useRouter()
    const { createPost } = useBlog()

    function handleSubmit(data: Parameters<typeof createPost>[0]) {
        const post = createPost(data)
        toast({
            title: 'Post created',
            description: `“${post.title}” was created.`,
            variant: 'success',
        })
        router.push(`/`)
    }

    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-semibold mb-4">New Post</h1>
            <PostForm
                onSubmit={handleSubmit}
                submitLabel="Create"
                onCancel={() => router.back()}
            />
        </main>
    )
}
