import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import { Quote, Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos Almeida',
    role: 'Síndico Profissional',
    content:
      'A equipe da JT Obras foi impecável na reforma da fachada do nosso condomínio. Cumpriram o prazo e todas as normas de segurança rigorosamente.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
  },
  {
    name: 'Mariana Costa',
    role: 'Gerente Administrativa',
    content:
      'Tínhamos um problema sério de infiltração. Eles realizaram a limpeza de calhas e o reparo do telhado com extrema eficiência e organização.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=2',
  },
  {
    name: 'Roberto Silva',
    role: 'Diretor de Operações',
    content:
      'Excelente serviço de adequação elétrica (NR 10). Profissionais altamente capacitados e transparentes em todas as etapas do projeto.',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=3',
  },
]

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="py-24 bg-brand-navy text-white border-t border-brand-navy/90"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2">
              O que nossos clientes dizem
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Depoimentos</h3>
            <p className="text-gray-300 text-lg">
              A satisfação dos nossos clientes é o maior reflexo da qualidade e do compromisso que
              entregamos em cada obra realizada.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={index} delay={index * 0.1} direction="up">
              <Card className="h-full border-0 bg-white/5 backdrop-blur-sm shadow-xl hover:bg-white/10 transition-all duration-300">
                <CardContent className="pt-8 relative">
                  <Quote className="absolute top-6 right-6 h-10 w-10 text-brand-orange/20" />
                  <div className="flex gap-1 mb-6 text-brand-orange">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-8 italic leading-relaxed text-sm md:text-base">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full border-2 border-brand-light object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm md:text-base">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs md:text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
