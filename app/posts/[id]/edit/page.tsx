'use client'

import { useParams, useRouter } from 'next/navigation'
import PostForm from '@/components/PostForm'
import { useBlog } from '@/context/BlogContext'
import { type Post } from '@/types/post'

export default function EditPostPage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const { getPostById, updatePost } = useBlog()
    const id = params.id
    const post = getPostById(id)

    if (!post) {
        return (
            <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
                <p>Post not found.</p>
            </main>
        )
    }

    const current = post as NonNullable<Post>

    function handleSubmit(data: Omit<Post, 'id'>) {
        updatePost({ ...current, ...data })
        router.push(`/posts/${current.id}`)
    }

    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
            <h1 className="text-2xl font-semibold mb-4">Edit Post</h1>
            <PostForm
                initial={current}
                onSubmit={handleSubmit}
                submitLabel="Update"
                onCancel={() => router.back()}
            />
        </main>
    )
}
