import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { VideoSection } from '@/components/sections/VideoSection'
import { CompanyProfile } from '@/components/sections/CompanyProfile'
import { Clients } from '@/components/sections/Clients'
import { Testimonials } from '@/components/sections/Testimonials'
import { Tips } from '@/components/sections/Tips'
import { FAQ } from '@/components/sections/FAQ'
import { Contact } from '@/components/sections/Contact'

export default function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Clients />
      <Services />
      <VideoSection />
      <CompanyProfile />
      <Tips />
      <Testimonials />
      <FAQ />
      <Contact />
    </div>
  )
}
