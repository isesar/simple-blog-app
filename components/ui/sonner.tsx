'use client'

import React from 'react'

// Simple in-app toast system (no external dependency)
// Usage:
//   import { toast } from '@/components/ui/sonner'
//   toast({ title: 'Saved', description: 'Your post has been saved.' })

type ToastItem = {
    id: number
    title: string
    description?: string
    variant?: 'default' | 'success' | 'destructive'
}

type ToastOptions = Omit<ToastItem, 'id'>

let counter = 0
const subscribers = new Set<(t: ToastItem) => void>()

export function toast(opts: ToastOptions) {
    const item: ToastItem = { id: ++counter, variant: 'default', ...opts }
    subscribers.forEach((fn) => fn(item))
}

export function Toaster() {
    const [toasts, setToasts] = React.useState<ToastItem[]>([])

    React.useEffect(() => {
        const onToast = (t: ToastItem) => {
            setToasts((prev) => [...prev, t])
            // auto-dismiss after 3s
            setTimeout(() => {
                setToasts((prev) => prev.filter((x) => x.id !== t.id))
            }, 3000)
        }
        subscribers.add(onToast)
        return () => void subscribers.delete(onToast)
    }, [])

    return (
        <div className="pointer-events-none fixed inset-0 z-[100] flex flex-col items-end gap-2 p-4">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={[
                        'pointer-events-auto w-full max-w-sm rounded-md border p-4 shadow-md bg-background text-foreground',
                        t.variant === 'success' && 'border-green-500/30',
                        t.variant === 'destructive' && 'border-red-500/30',
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    role="status"
                    aria-live="polite"
                >
                    <div className="font-medium">{t.title}</div>
                    {t.description && (
                        <div className="text-sm text-muted-foreground mt-1">
                            {t.description}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}
