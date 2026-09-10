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
    <section className="py-16 md:py-24 bg-white border-t border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="text-brand-orange font-bold uppercase tracking-wider text-xs mb-1 block">
              Avaliações
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              Quem Contratou, Recomenda
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Compromisso, pontualidade e segurança comprovados por nossos clientes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-slate-50 border border-slate-200/80 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 rounded-2xl"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex gap-1 text-amber-500 mb-3">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60">
                    <p className="font-bold text-brand-navy text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-500">{testimonial.role}</p>
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
