import { Hero } from '@/components/sections/Hero'
import { Safety } from '@/components/sections/Safety'
import { Services } from '@/components/sections/Services'
import { Clients } from '@/components/sections/Clients'
import { CompanyProfile } from '@/components/sections/CompanyProfile'
import { Contact } from '@/components/sections/Contact'

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Hero />
      <Safety />
      <Services />
      <Clients />
      <CompanyProfile />
      <Contact />
    </div>
  )
}

export default Index
