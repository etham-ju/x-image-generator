import type { Metadata } from 'next'
import './globals.css'
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
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
        <main className="container mx-auto p-4 {notoSansKR.className}">
            {children}
        </main>
        </body>
        </html>
    )
}