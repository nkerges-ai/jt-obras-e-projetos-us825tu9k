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
    <section className="bg-secondary/40 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Clientes de Confiança
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temos orgulho em prestar serviços de excelência para grandes instituições que confiam
              em nosso trabalho.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
            {clients.map((client, index) => {
              const Icon = client.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-background p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-8 w-8" />
                  </div>
                  <span className="text-center font-bold text-foreground text-lg">
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
