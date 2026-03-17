import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { WhatsAppFAB } from '@/components/layout/WhatsAppFAB'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      <Header />
      <main className="flex-grow flex flex-col pt-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFAB />
    </div>
  )
}
