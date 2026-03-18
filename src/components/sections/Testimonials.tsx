import { FadeIn } from '@/components/animations/FadeIn'
import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: 'Carlos Silva',
    role: 'Síndico Comercial',
    text: 'A JT Obras resolveu nosso problema crônico de infiltração na fachada. Trabalho impecável, equipe extremamente profissional e entrega rigorosamente dentro do prazo estipulado.',
    rating: 5,
  },
  {
    name: 'Mariana Costa',
    role: 'Diretora Escolar',
    text: 'Contratamos a manutenção preventiva para os aparelhos de ar condicionado da unidade. O serviço foi rápido, limpo e não atrapalhou a rotina das aulas. Excelente atendimento!',
    rating: 5,
  },
  {
    name: 'Roberto Almeida',
    role: 'Gerente de Facilities',
    text: 'A pintura externa do nosso prédio ficou perfeita. A atenção às normas de segurança para trabalho em altura nos deu muita tranquilidade durante toda a execução da obra.',
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A satisfação dos nossos parceiros é o maior reflexo da qualidade, segurança e do
              compromisso que entregamos em cada projeto.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-secondary/20 border-none shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="pt-10 px-8 pb-10 flex flex-col items-center text-center gap-6">
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed text-lg">
                    "{testimonial.text}"
                  </p>
                  <div className="mt-auto pt-4">
                    <p className="font-bold text-foreground text-lg">{testimonial.name}</p>
                    <p className="text-sm font-medium text-primary mt-1">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
