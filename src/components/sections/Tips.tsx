import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Wrench, Droplets, PenTool } from 'lucide-react'

const tips = [
  {
    title: 'Limpeza Regular de Calhas',
    description:
      'A importância da limpeza regular de calhas para evitar infiltrações que podem comprometer a estrutura do seu imóvel e gerar altos custos de reparo.',
    icon: Droplets,
  },
  {
    title: 'Manutenção de Ar-Condicionado',
    description:
      'Realize a manutenção preventiva de ar-condicionado periodicamente. Isso garante a qualidade do ar que você respira e aumenta a eficiência energética do aparelho.',
    icon: Wrench,
  },
  {
    title: 'Prevenção Elétrica (NR 10)',
    description:
      'Evite curtos-circuitos fazendo a revisão do quadro de força a cada 5 anos. Instalações antigas podem não suportar os equipamentos modernos de alta potência.',
    icon: Lightbulb,
  },
  {
    title: 'Inspeção de Telhados',
    description:
      'Após fortes tempestades, sempre verifique o estado das telhas. Uma pequena fresta pode causar danos severos ao forro e aos móveis ao longo do tempo.',
    icon: PenTool,
  },
]

export function Tips() {
  return (
    <section id="dicas" className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2">
              Dicas de Obras e Reparos
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Aprenda com Nossos Especialistas
            </h3>
            <p className="text-gray-600 text-lg">
              Confira curiosidades e dicas essenciais de manutenção preventiva para manter seu
              imóvel seguro e sempre valorizado.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tips.map((tip, index) => (
            <FadeIn key={index} delay={index * 0.1} direction="up">
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-light/10 flex items-center justify-center mb-4 group-hover:bg-brand-orange transition-colors duration-300">
                    <tip.icon className="h-6 w-6 text-brand-light group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl font-bold text-brand-navy">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
