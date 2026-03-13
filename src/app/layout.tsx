import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LocalizeIQ — AI-Powered Global Content Localization',
  description: 'Transform hero assets into localized variants across markets, specs, and channels — powered by AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
