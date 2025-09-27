'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RootError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Root error boundary:', error)
    }, [error])

    return (
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
            <h1 className="text-2xl font-semibold mb-2">
                Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
                An unexpected error occurred while loading this page.
            </p>
            <div className="flex gap-2">
                <Button onClick={reset}>Try again</Button>
                <Button asChild variant="outline">
                    <Link href="/">Go home</Link>
                </Button>
            </div>
            {error?.digest && (
                <p className="mt-4 text-xs text-muted-foreground">
                    Error id: {error.digest}
                </p>
            )}
        </main>
    )
}
