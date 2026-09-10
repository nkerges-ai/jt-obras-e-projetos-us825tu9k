import { FadeIn } from '@/components/animations/FadeIn'
import { Droplets, ThermometerSnowflake, Wrench, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const tips = [
  {
    title: 'Limpeza de Calhas',
    description:
      'Evite infiltrações antes das chuvas. Limpeza rápida protege toda a estrutura do imóvel.',
    icon: Droplets,
  },
  {
    title: 'Filtros de Ar',
    description: 'Limpeza periódica garante ar saudável e reduz a conta de energia do equipamento.',
    icon: ThermometerSnowflake,
  },
  {
    title: 'Revisão Preventiva',
    description: 'Pequenos reparos programados evitam gastos emergenciais até 4x maiores.',
    icon: Wrench,
  },
  {
    title: 'Impermeabilização',
    description: 'Lajes e telhados vedados evitam goteiras e corrosão de ferragens estruturais.',
    icon: ShieldCheck,
  },
]

export function Tips() {
  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-brand-orange font-bold uppercase tracking-wider text-xs mb-1 block">
              Prevenção
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Dicas Rápidas de Manutenção
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Orientações práticas para economizar e conservar seu imóvel sempre seguro.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Card
                  key={index}
                  className="group overflow-hidden border-none bg-background shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardHeader className="pb-4 pt-8 text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <Icon className="h-10 w-10" />
                    </div>
                    <CardTitle className="text-xl font-bold">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground px-6 pb-8">
                    <p className="leading-relaxed">{tip.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
