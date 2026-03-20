import { Outlet } from 'react-router-dom'
import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { WhatsAppFAB } from './layout/WhatsAppFAB'
import { Toaster } from '@/components/ui/sonner'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <div className="print:hidden">
        <WhatsAppFAB />
      </div>
      <Toaster />
    </div>
  )
}
