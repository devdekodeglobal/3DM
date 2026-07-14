import React from 'react'
import { HeadContent, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);root.setAttribute('data-theme',resolved);root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'kreatekaro — Professional Platform for 3D Spaces' },
      { name: 'description', content: 'Advanced software for designing professional 3D spaces. Seamless 2D floor planning and real-time immersive 3D visualization.' },
      { property: 'og:title', content: 'kreatekaro — Professional Platform for 3D Spaces' },
      { property: 'og:description', content: 'Advanced software for designing professional 3D spaces. Seamless 2D floor planning and real-time immersive 3D visualization.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/og-image.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'kreatekaro — Professional Platform for 3D Spaces' },
      { name: 'twitter:description', content: 'Advanced software for designing professional 3D spaces. Seamless 2D floor planning and real-time immersive 3D visualization.' },
      { name: 'twitter:image', content: '/og-image.png' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'stylesheet', href: appCss }
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <h1 className="text-2xl font-bold text-[var(--fg)] mb-4">404 - Page Not Found</h1>
        <p className="text-[var(--fg-soft)]">The page you are looking for does not exist.</p>
      </div>
    )
  }
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const isEditor = useRouterState({ select: (s) => s.location.pathname.startsWith('/editor') })

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body suppressHydrationWarning className="antialiased" style={{ overflowWrap: 'anywhere' }}>
        <Header />
        <main id="root">
          {children}
        </main>
        {!isEditor && <Footer />}
        <Scripts />
      </body>
    </html>
  )
}
