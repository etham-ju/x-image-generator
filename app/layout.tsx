import type { Metadata } from 'next'
import './globals.css'
import { Roboto } from '@next/font/google';

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
});


export const metadata: Metadata = {
    title: 'X.com Image Generator',
    description: 'Generate images from X.com posts',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className="bg-gray-100 min-h-screen">
        <main className="container mx-auto p-4 {roboto.className}">
            {children}
        </main>
        </body>
        </html>
    )
}