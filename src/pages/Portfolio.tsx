import { FadeIn } from '@/components/animations/FadeIn'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import imgExternal from '@/assets/whatsapp-image-2026-03-17-at-19.27.50-91cc3.jpeg'
import imgAC from '@/assets/whatsapp-image-2026-03-17-at-19.27.46-76526.jpeg'
import imgPrev from '@/assets/whatsapp-image-2026-03-17-at-19.27.47-95b76.jpeg'

const portfolioItems = [
  {
    title: 'Manutenção Predial Externa e Pintura',
    category: 'Trabalho em Altura',
    description:
      'Revitalização de fachada com pintura e reparos estruturais em alvenaria. Utilização rigorosa de andaimes e equipamentos de proteção, garantindo segurança e acabamento de alto padrão para instituições.',
    image: imgExternal,
    highlights: [
      'Pintura industrial',
      'Montagem de andaimes',
      'Trabalho seguro em altura',
      'Revitalização de fachada',
    ],
  },
  {
    title: 'Manutenção de Ar Condicionado',
    category: 'Climatização',
    description:
      'Serviço de higienização profunda e manutenção preventiva em unidades de ar condicionado do tipo Split. Limpeza de filtros, serpentinas e bandeja de dreno para garantir máxima eficiência energética.',
    image: imgAC,
    highlights: [
      'Limpeza de filtros',
      'Higienização completa',
      'Prevenção de vazamentos',
      'Eficiência energética',
    ],
  },
  {
    title: 'Controle e Manutenção Técnica',
    category: 'Prevenção',
    description:
      'Instalação e monitoramento de dispositivos de controle em ambientes institucionais. Serviço discreto, seguro e documentado, seguindo estritamente as normas vigentes para segurança patrimonial.',
    image: imgPrev,
    highlights: [
      'Instalação técnica',
      'Monitoramento periódico',
      'Adequação às normas',
      'Segurança patrimonial',
    ],
  },
]

export default function Portfolio() {
  return (
    <main className="flex min-h-screen flex-col pt-16 md:pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn>
          <div className="mb-16 md:mb-24 max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Nosso Portfólio
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Confira alguns de nossos trabalhos recentes. Na JT Obras e Projetos, transformamos
              desafios complexos em soluções eficientes, com foco absoluto em qualidade e segurança.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-24 md:space-y-32">
          {portfolioItems.map((item, index) => (
            <FadeIn key={index}>
              <div
                className={`flex flex-col gap-8 md:gap-16 lg:items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              >
                <div className="w-full lg:w-1/2">
                  <div className="overflow-hidden rounded-3xl bg-muted aspect-[4/3] shadow-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center space-y-8">
                  <div>
                    <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-6">
                      {item.category}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {item.highlights.map((highlight, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-foreground font-medium text-lg"
                      >
                        <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-8">
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full font-bold px-8 h-14 text-base shadow-md"
                    >
                      <Link to="/#contato">
                        Solicitar orçamento similar
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-32 rounded-[2.5rem] bg-primary text-primary-foreground p-10 md:p-20 text-center shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Precisa de uma solução para o seu projeto?
            </h2>
            <p className="text-lg md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto mb-10">
              Nossa equipe técnica especializada está pronta para avaliar sua necessidade e propor a
              melhor solução em manutenção ou reforma estrutural.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="rounded-full font-bold h-14 px-10 text-lg hover:scale-105 transition-transform"
            >
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                Fale com um Especialista Agora
              </a>
            </Button>
          </div>
        </FadeIn>
      </div>
    </main>
  )
}
