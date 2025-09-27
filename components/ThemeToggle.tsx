'use client'

import React from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <button
            onClick={toggleTheme}
            className="inline-flex items-center justify-center rounded-md border px-2.5 py-2 text-sm hover:bg-accent"
            aria-label="Toggle theme"
            title="Toggle theme"
        >
            {theme === 'dark' ? (
                <SunIcon className="size-4" />
            ) : (
                <MoonIcon className="size-4" />
            )}
        </button>
    )
}
