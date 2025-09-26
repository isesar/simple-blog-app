import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Get in touch with Simple Blog via the contact form or email.',
    alternates: { canonical: '/contact' },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
