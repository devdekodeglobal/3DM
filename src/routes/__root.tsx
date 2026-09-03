import { Outlet, createRootRoute, useRouterState } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'
import CookieConsent from '../components/CookieConsent'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <h1 className="text-2xl font-bold text-[var(--fg)] mb-4">404 - Page Not Found</h1>
        <p className="text-[var(--fg-soft)]">The page you are looking for does not exist.</p>
      </div>
    )
  }
})

function RootComponent() {
  const isEditor = useRouterState({ select: (s) => s.location.pathname.startsWith('/editor') })

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      {!isEditor && <Footer />}
      <CookieConsent />
    </>
  )
}
