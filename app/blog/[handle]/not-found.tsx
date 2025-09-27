import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function BlogPostNotFound() {
    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
            <h1 className="text-2xl font-semibold mb-2">Post not found</h1>
            <p className="text-muted-foreground mb-6">
                The blog post you are looking for does not exist or was removed.
            </p>
            <Button asChild>
                <Link href="/">Go home</Link>
            </Button>
        </main>
    )
}
