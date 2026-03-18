import { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeftRight } from 'lucide-react'

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Manutenção Preventiva Industrial',
    category: 'Indústria',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=factory%20maintenance%20machine',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=worker%20ppe%20factory%20inspection',
  },
  {
    id: 2,
    title: 'Construção de Galpão Logístico',
    category: 'Construção Civil',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=empty%20dirt%20land%20construction',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=warehouse%20construction%20workers%20ppe',
  },
  {
    id: 3,
    title: 'Adequação Elétrica NR 10',
    category: 'Projetos Elétricos',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=old%20electrical%20panel',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=electrician%20ppe%20panel%20wiring',
  },
  {
    id: 4,
    title: 'Pintura e Reforma em Altura (NR 35)',
    category: 'Manutenção Predial',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=worn%20building%20facade',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=worker%20harness%20scaffold%20ppe',
  },
  {
    id: 5,
    title: 'Infraestrutura Hidráulica',
    category: 'Infraestrutura',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=broken%20pipes%20leaking',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=plumber%20ppe%20fixing%20pipes',
  },
  {
    id: 6,
    title: 'Reforma de Refeitório Corporativo',
    category: 'Construção Civil',
    imageBefore: 'https://img.usecurling.com/p/800/600?q=empty%20old%20room',
    imageAfter: 'https://img.usecurling.com/p/800/600?q=construction%20worker%20ppe%20indoor',
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
              <Card className="overflow-hidden border-none shadow-soft hover:shadow-hover transition-all duration-300 group cursor-pointer h-full bg-white">
                <div className="relative h-72 overflow-hidden">
                  {/* Before Image */}
                  <img
                    src={item.imageBefore}
                    alt={`${item.title} Antes`}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover:opacity-0"
                  />
                  {/* After Image */}
                  <img
                    src={item.imageAfter}
                    alt={`${item.title} Depois`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-105"
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
                <CardContent className="p-6">
                  <h3 className="font-poppins font-bold text-xl text-slate-800 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
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
