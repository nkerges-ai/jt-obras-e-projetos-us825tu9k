import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { CompanyProfile } from '@/components/sections/CompanyProfile'
import { Testimonials } from '@/components/sections/Testimonials'
import { Clients } from '@/components/sections/Clients'
import { Tips } from '@/components/sections/Tips'
import { Contact } from '@/components/sections/Contact'
import { FAQ } from '@/components/sections/FAQ'
import { useEffect } from 'react'
import { addVisitorLog } from '@/lib/storage'

export default function Index() {
  useEffect(() => {
    addVisitorLog({
      link: window.location.pathname,
      status: 'Visit',
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Clients />
      <Services />
      <CompanyProfile />
      <Tips />
      <Testimonials />
      <FAQ />
      <Contact />
    </div>
  )
}
