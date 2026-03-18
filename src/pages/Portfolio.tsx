import { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeftRight } from 'lucide-react'

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Manutenção de Fachada e Pintura',
    category: 'Trabalho em Altura',
    imageBefore:
      'https://img.usecurling.com/p/800/600?q=scaffolding%20building%20workers&color=gray',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=painted%20building%20yellow%20scaffold',
    description:
      'Trabalho em altura com andaimes para pintura de fachada predial (parede cinza e topo amarelo).',
  },
  {
    id: 2,
    title: 'Desobstrução e Limpeza de Calhas',
    category: 'Manutenção Preventiva',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=clogged%20gutter%20drain%20leaves%20boot',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=clean%20gutter%20water%20flowing',
    description: 'Manutenção e limpeza de calha entupida com folhas, prevenindo infiltrações.',
  },
  {
    id: 3,
    title: 'Reparo de Telhado e Forro',
    category: 'Manutenção Predial',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=dark%20attic%20roof%20hole%20light',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=fixed%20attic%20roof%20no%20hole',
    description: 'Identificação e reparo de buraco no telhado com passagem de luz para o forro.',
  },
  {
    id: 4,
    title: 'Construção de Galpão Logístico',
    category: 'Construção Civil',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=empty%20dirt%20site&dpr=2',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=construction%20worker%20helmet&dpr=2',
    description: 'Terraplanagem e construção completa de galpão para armazenagem.',
  },
  {
    id: 5,
    title: 'Adequação Elétrica NR 10',
    category: 'Projetos Elétricos',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=old%20electrical%20panel&dpr=2',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=electrician%20helmet%20panel&dpr=2',
    description: 'Atualização de quadros elétricos antigos para o padrão de segurança NR 10.',
  },
  {
    id: 6,
    title: 'Infraestrutura Hidráulica',
    category: 'Infraestrutura',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=broken%20water%20pipes&dpr=2',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=plumber%20helmet%20pipes&dpr=2',
    description: 'Substituição de tubulações danificadas e modernização da rede hídrica.',
  },
]

const Portfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Page Header */}
      <section className="bg-primary text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <FadeIn>
            <h1 className="font-poppins font-bold text-4xl md:text-5xl mb-4">Exemplos de Obras</h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Conheça alguns dos nossos projetos de alta complexidade executados com rigor técnico e
              segurança.
              <br className="hidden md:block" /> Passe o mouse nas imagens para ver o{' '}
              <strong className="text-secondary">Antes e Depois</strong>.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_ITEMS.map((item, index) => (
            <FadeIn key={item.id} delay={index * 100}>
              <Card className="overflow-hidden border-none shadow-soft hover:shadow-hover transition-all duration-300 group cursor-pointer h-full bg-white flex flex-col">
                <div className="relative h-72 overflow-hidden bg-slate-200 shrink-0">
                  {/* Before Image */}
                  <img
                    src={item.imageBefore}
                    alt={`${item.title} Antes`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0"
                    loading="lazy"
                  />
                  {/* After Image */}
                  <img
                    src={item.imageAfter}
                    alt={`${item.title} Depois`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Tags */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Before / After Indicators */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded opacity-100 group-hover:opacity-0 transition-opacity flex items-center gap-1">
                      Antes <ArrowLeftRight size={12} />
                    </span>
                    <span className="bg-secondary/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Depois
                    </span>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <h3 className="font-poppins font-bold text-xl text-slate-800 group-hover:text-primary transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mt-auto">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Portfolio
