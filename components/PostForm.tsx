'use client'

import React from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Post } from '@/types/post'
import { Input } from '@/components/ui/input'

const schema = z.object({
    title: z.string().min(1, 'Title is required').max(50, 'Max 50 characters'),
    summary: z
        .string()
        .min(1, 'Summary is required')
        .max(250, 'Max 250 characters'),
    content: z.string().min(1, 'Content is required'),
    author: z
        .string()
        .min(1, 'Author is required')
        .max(40, 'Max 40 characters'),
    email: z.string().email('Invalid email address'),
    date: z.string().min(1, 'Date is required'),
})

// Estimate read time based on word count (default 200 words per minute)
function computeReadTime(text: string, wpm = 200): string {
    const words = text.trim().split(/\s+/).filter(Boolean).length
    const minutes = Math.max(1, Math.ceil(words / wpm))
    return `${minutes} min read`
}

export default function PostForm({
    initial,
    onSubmit,
    submitLabel = 'Save',
    onCancel,
}: {
    initial?: Partial<Post>
    onSubmit: (data: Omit<Post, 'id'>) => void
    submitLabel?: string
    onCancel?: () => void
}) {
    const [values, setValues] = React.useState({
        title: initial?.title ?? '',
        summary: initial?.summary ?? '',
        content: initial?.content ?? '',
        author: initial?.author ?? '',
        email: initial?.email ?? '',
        date: initial?.date ?? new Date().toISOString().slice(0, 10),
    })
    const [errors, setErrors] = React.useState<Record<string, string>>({})

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) {
        const { name, value } = e.target
        setValues((v) => ({ ...v, [name]: value }))
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const parsed = schema.safeParse(values)
        if (!parsed.success) {
            const errs: Record<string, string> = {}
            for (const issue of parsed.error.issues) {
                if (issue.path[0]) errs[issue.path[0] as string] = issue.message
            }
            setErrors(errs)
            return
        }
        setErrors({})
        const readTime = computeReadTime(parsed.data.content)
        onSubmit({ ...parsed.data, readTime })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="title"
                >
                    Title
                </label>
                <Input
                    id="title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                    placeholder="Post title"
                />
                {errors.title && (
                    <p className="text-destructive text-sm mt-1">
                        {errors.title}
                    </p>
                )}
            </div>

            <div>
                <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="summary"
                >
                    Summary
                </label>
                <Textarea
                    id="summary"
                    name="summary"
                    value={values.summary}
                    onChange={handleChange}
                    placeholder="Short summary"
                />
                {errors.summary && (
                    <p className="text-destructive text-sm mt-1">
                        {errors.summary}
                    </p>
                )}
            </div>

            <div>
                <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="content"
                >
                    Content
                </label>
                <Textarea
                    id="content"
                    name="content"
                    value={values.content}
                    onChange={handleChange}
                    placeholder="Write your post..."
                    className="min-h-40"
                />
                {errors.content && (
                    <p className="text-destructive text-sm mt-1">
                        {errors.content}
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="author"
                    >
                        Author
                    </label>
                    <Input
                        id="author"
                        name="author"
                        value={values.author}
                        onChange={handleChange}
                        placeholder="Your name"
                    />
                    {errors.author && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.author}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <Input
                        id="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                    />
                    {errors.email && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div>
                    <label
                        className="block text-sm font-medium mb-1"
                        htmlFor="date"
                    >
                        Date
                    </label>
                    <Input
                        id="date"
                        type="date"
                        name="date"
                        value={values.date}
                        onChange={handleChange}
                    />
                    {errors.date && (
                        <p className="text-destructive text-sm mt-1">
                            {errors.date}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex gap-2">
                <Button type="submit">{submitLabel}</Button>
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    )
}
