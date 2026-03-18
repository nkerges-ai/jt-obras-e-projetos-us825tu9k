import { FadeIn } from '@/components/animations/FadeIn'
import { Droplets, ThermometerSnowflake, Wrench, ShieldCheck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const tips = [
  {
    title: 'Limpeza de Calhas',
    description:
      'É fundamental limpar as calhas antes do período de chuvas. O acúmulo de folhas e detritos pode causar transbordamento, resultando em infiltrações e danos estruturais graves ao imóvel.',
    icon: Droplets,
  },
  {
    title: 'Filtros de Ar Condicionado',
    description:
      'A manutenção e limpeza regular dos filtros não apenas garante a qualidade do ar que você respira, mas também otimiza o funcionamento do aparelho, gerando considerável economia de energia.',
    icon: ThermometerSnowflake,
  },
  {
    title: 'Manutenção Preventiva',
    description:
      'Realizar pequenos reparos e inspeções constantes evita que problemas simples se tornem grandes reformas emergenciais, poupando tempo e reduzindo drasticamente os custos no futuro.',
    icon: Wrench,
  },
  {
    title: 'Impermeabilização',
    description:
      'Manter a impermeabilização de lajes e paredes em dia protege as armaduras de concreto contra oxidação, aumentando a vida útil da edificação e a segurança dos frequentadores.',
    icon: ShieldCheck,
  },
]

export function Tips() {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Dicas de Obras e Reparos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Curiosidades e informações educativas essenciais para ajudar a manter o seu patrimônio
              sempre seguro, bem conservado e valorizado.
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
