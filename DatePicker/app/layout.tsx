import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'date picker application',
  description: 'created for the pearl thoughts',
  generator: 'satya',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
