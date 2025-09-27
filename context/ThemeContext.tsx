'use client'

import React from 'react'

type Theme = 'light' | 'dark'

export type ThemeContextValue = {
    theme: Theme
    setTheme: (t: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
    undefined,
)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = React.useState<Theme>('light')

    const applyTheme = React.useCallback((t: Theme) => {
        const root = document.documentElement
        if (t === 'dark') root.classList.add('dark')
        else root.classList.remove('dark')
    }, [])

    React.useEffect(() => {
        try {
            const prefersDark =
                typeof window !== 'undefined' &&
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
            setTheme(prefersDark ? 'dark' : 'light')
        } catch {}
    }, [])

    React.useEffect(() => {
        if (typeof document === 'undefined') return
        applyTheme(theme)
    }, [theme, applyTheme])

    const toggleTheme = React.useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
    }, [])

    const value = React.useMemo(
        () => ({ theme, setTheme, toggleTheme }),
        [theme, toggleTheme],
    )

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    )
}

export function useTheme(): ThemeContextValue {
    const ctx = React.useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
    return ctx
}
