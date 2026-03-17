import { useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    title: 'Manutenção Preventiva Industrial',
    category: 'Indústria',
    image: 'https://img.usecurling.com/p/800/600?q=factory%20maintenance&color=blue',
  },
  {
    id: 2,
    title: 'Construção de Galpão Logístico',
    category: 'Construção Civil',
    image: 'https://img.usecurling.com/p/800/600?q=warehouse%20construction&color=blue',
  },
  {
    id: 3,
    title: 'Adequação Elétrica NR 10',
    category: 'Projetos Elétricos',
    image: 'https://img.usecurling.com/p/800/600?q=electrical%20panel&color=blue',
  },
  {
    id: 4,
    title: 'Pintura e Reforma em Altura (NR 35)',
    category: 'Manutenção Predial',
    image: 'https://img.usecurling.com/p/800/600?q=building%20facade&color=blue',
  },
  {
    id: 5,
    title: 'Infraestrutura Hidráulica',
    category: 'Infraestrutura',
    image: 'https://img.usecurling.com/p/800/600?q=pipes&color=blue',
  },
  {
    id: 6,
    title: 'Reforma de Refeitório Corporativo',
    category: 'Construção Civil',
    image: 'https://img.usecurling.com/p/800/600?q=modern%20cafeteria&color=blue',
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
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">
              Portfólio de Obras
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Conheça alguns dos nossos projetos de alta complexidade executados com excelência.
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
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-white/90 backdrop-blur text-primary text-xs font-bold px-3 py-1 rounded shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-montserrat font-bold text-xl text-slate-800 group-hover:text-primary transition-colors">
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
