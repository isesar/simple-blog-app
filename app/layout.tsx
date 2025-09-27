import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Topbar from '@/components/Topbar'
import Footer from '@/components/Footer'
import { BlogProvider } from '@/context/BlogContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'Simple Blog',
        template: '%s | Simple Blog',
    },
    description:
        'A simple blog built with Next.js, React, TypeScript, and Tailwind CSS. Create, edit, and delete posts with a responsive UI.',
    keywords: [
        'Next.js',
        'React',
        'TypeScript',
        'Tailwind CSS',
        'Blog',
        'Frontend',
    ],
    authors: [{ name: 'Simple Blog' }],
    creator: 'Simple Blog',
    openGraph: {
        type: 'website',
        siteName: 'Simple Blog',
        title: 'Simple Blog',
        description:
            'A simple blog built with Next.js, React, TypeScript, and Tailwind CSS.',
        url: '/',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Simple Blog',
        description:
            'A simple blog built with Next.js, React, TypeScript, and Tailwind CSS.',
        creator: '@simpleblog',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/',
    },
}

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ffffff' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
    width: 'device-width',
    initialScale: 1,
    colorScheme: 'light dark',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <ThemeProvider>
                    <BlogProvider>
                        <Topbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <Toaster />
                    </BlogProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
