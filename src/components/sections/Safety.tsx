import { Zap, Mountain, HardHat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'

const SAFETY_STANDARDS = [
  {
    id: 'nr10',
    title: 'NR 10',
    subtitle: 'Segurança em Instalações Elétricas',
    description:
      'Nossa equipe é rigorosamente treinada e equipada para atuar em instalações e serviços em eletricidade, garantindo a saúde e segurança dos trabalhadores em todas as fases.',
    icon: Zap,
    color: 'text-warning',
  },
  {
    id: 'nr35',
    title: 'NR 35',
    subtitle: 'Trabalho em Altura',
    description:
      'Executamos serviços em altura com planejamento minucioso, utilizando EPIs certificados, linhas de vida e ancoragens aprovadas para eliminar qualquer risco de queda.',
    icon: Mountain,
    color: 'text-accent',
  },
  {
    id: 'nr01',
    title: 'NR 01',
    subtitle: 'Gerenciamento de Riscos',
    description:
      'Aplicamos o PGR (Programa de Gerenciamento de Riscos) de forma integrada, antecipando, reconhecendo e controlando riscos ocupacionais em cada projeto.',
    icon: HardHat,
    color: 'text-secondary',
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SAFETY_STANDARDS.map((standard, index) => {
            const Icon = standard.icon
            return (
              <FadeIn key={standard.id} delay={index * 200}>
                <Card className="h-full border-border/50 shadow-soft hover:shadow-hover hover:-translate-y-2 transition-all duration-300 group overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent group-hover:via-primary transition-all duration-500" />
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={40} className={standard.color} />
                    </div>
                    <CardTitle className="font-montserrat text-2xl text-primary mb-1">
                      {standard.title}
                    </CardTitle>
                    <p className="text-sm font-semibold text-secondary uppercase tracking-wider">
                      {standard.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    <p>{standard.description}</p>
                    <div className="mt-8 inline-flex items-center text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
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
