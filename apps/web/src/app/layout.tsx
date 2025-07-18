import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Navigation } from '@/components/navigation'
import { Providers } from '@/components/providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'full-stack-example-app',
  description: 'A modern, enterprise-grade implementation of the RealWorld Conduit spec',
  keywords: ['blog', 'articles', 'social', 'platform', 'portfolio'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'full-stack-example-app',
    description: 'A modern, enterprise-grade implementation of the RealWorld Conduit spec',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navigation />
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
      </body>
    </html>
  )
} 