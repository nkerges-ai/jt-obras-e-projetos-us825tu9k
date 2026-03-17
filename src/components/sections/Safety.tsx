import { Zap, Mountain, HardHat, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'

const SAFETY_STANDARDS = [
  {
    id: 'nr10',
    title: 'NR 10',
    subtitle: 'Segurança Elétrica',
    description:
      'Nossa equipe é rigorosamente treinada e equipada para atuar em instalações e serviços em eletricidade, garantindo a saúde e segurança de todos.',
    icon: Zap,
    color: 'text-warning',
  },
  {
    id: 'nr35',
    title: 'NR 35',
    subtitle: 'Trabalho em Altura',
    description:
      'Executamos serviços em altura com planejamento minucioso, utilizando EPIs certificados e linhas de vida aprovadas.',
    icon: Mountain,
    color: 'text-secondary',
  },
  {
    id: 'nr18',
    title: 'NR 18',
    subtitle: 'Segurança na Construção',
    description:
      'Garantimos medidas de controle e sistemas preventivos nos processos e no meio ambiente de trabalho na indústria da construção.',
    icon: Building2,
    color: 'text-accent',
  },
  {
    id: 'nr01',
    title: 'NR 01',
    subtitle: 'Gerenciamento de Riscos',
    description:
      'Aplicamos o PGR (Programa de Gerenciamento de Riscos) de forma integrada, antecipando e controlando riscos ocupacionais.',
    icon: HardHat,
    color: 'text-primary',
  },
]

export function Safety() {
  return (
    <section id="seguranca" className="py-24 bg-white relative">
      <div className="container px-4">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading text-4xl mb-4">Compromisso com a Segurança</h2>
          <p className="text-muted-foreground text-lg">
            A vida e a integridade da nossa equipe são prioridade máxima. Operamos estritamente
            dentro das Normas Regulamentadoras mais exigentes do setor.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAFETY_STANDARDS.map((standard, index) => {
            const Icon = standard.icon
            return (
              <FadeIn key={standard.id} delay={index * 150}>
                <Card className="h-full border-border/50 shadow-soft hover:shadow-hover hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary transition-all duration-500" />
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={40} className={standard.color} />
                    </div>
                    <CardTitle className="font-poppins text-2xl text-primary mb-1">
                      {standard.title}
                    </CardTitle>
                    <p className="text-xs font-semibold text-secondary uppercase tracking-wider h-8">
                      {standard.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    <p className="text-sm">{standard.description}</p>
                    <div className="mt-6 inline-flex items-center text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                      Certificação Garantida
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
