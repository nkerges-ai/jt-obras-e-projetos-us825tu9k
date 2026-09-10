import { FadeIn } from '@/components/animations/FadeIn'
import { Building2, GraduationCap, Landmark, Briefcase } from 'lucide-react'

const clients = [
  { name: 'ETEC', icon: GraduationCap },
  { name: 'SENAI', icon: Briefcase },
  { name: 'SESI', icon: Building2 },
  { name: 'Prefeitura de São Bernardo', icon: Landmark },
]

export function Clients() {
  return (
    <section id="clientes" className="bg-secondary/30 py-10 md:py-14 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-6 md:mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Instituições e Empresas que Confiam na JT Obras
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
            {clients.map((client, index) => {
              const Icon = client.icon
              return (
                <div
                  key={index}
                  className="flex items-center justify-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-slate-200/60 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy/5 text-brand-navy shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-bold text-slate-800 text-sm sm:text-base">
                    {client.name}
                  </span>
                </div>
              )
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
