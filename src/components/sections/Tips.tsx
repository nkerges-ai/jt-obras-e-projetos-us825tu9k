import { FadeIn } from '@/components/animations/FadeIn'
import { Droplets, ThermometerSnowflake, Wrench, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const tips = [
  {
    title: 'Calhas & Drenagem Industrial',
    description:
      'Dimensionamento e limpeza técnica evitam transbordamento e danos a estoques em galpões.',
    icon: Droplets,
  },
  {
    title: 'Exaustão & Qualidade do Ar',
    description:
      'Revisão periódica de dutos e motores industriais mantém o conforto térmico e conformidade legal.',
    icon: ThermometerSnowflake,
  },
  {
    title: 'Manutenção Preventiva Fabril',
    description:
      'Inspeções estruturais programadas evitam paradas na operação e custos emergenciais.',
    icon: Wrench,
  },
  {
    title: 'Impermeabilização de Lajes',
    description:
      'Vedação técnica de coberturas industriais previne corrosão em armaduras e infiltrações.',
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
              Boas Práticas de Engenharia e Manutenção
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Diretrizes técnicas para preservar instalações prediais, galpões e ativos
              corporativos.
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
