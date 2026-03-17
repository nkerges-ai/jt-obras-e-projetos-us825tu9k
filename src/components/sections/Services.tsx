import { Building2, Factory, Zap, Wrench } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { FadeIn } from '@/components/animations/FadeIn'

const SERVICES = [
  {
    title: 'Manutenção Industrial',
    description:
      'Soluções preventivas e corretivas para manter sua linha de produção operando com máxima eficiência e segurança.',
    icon: Factory,
    image: 'https://img.usecurling.com/p/600/400?q=industrial%20maintenance&color=blue',
  },
  {
    title: 'Construção Civil',
    description:
      'Obras corporativas, galpões e reformas estruturais executadas com excelência técnica e cumprimento de prazos.',
    icon: Building2,
    image: 'https://img.usecurling.com/p/600/400?q=civil%20construction&color=blue',
  },
  {
    title: 'Infraestrutura Complexa',
    description:
      'Projetos de alta complexidade que exigem logística precisa, engenharia robusta e equipes altamente especializadas.',
    icon: Wrench,
    image: 'https://img.usecurling.com/p/600/400?q=infrastructure&color=blue',
  },
  {
    title: 'Projetos Elétricos',
    description:
      'Instalações de baixa, média e alta tensão, laudos técnicos e adequações rigorosas à NR 10.',
    icon: Zap,
    image: 'https://img.usecurling.com/p/600/400?q=electrical%20engineering&color=blue',
  },
]

export function Services() {
  return (
    <section id="servicos" className="py-24 bg-slate-50 relative">
      <div className="container px-4">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-heading text-4xl mb-4">Nossas Especialidades</h2>
          <p className="text-muted-foreground text-lg">
            Oferecemos um portfólio completo de serviços para atender às demandas mais complexas da
            engenharia moderna.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.title} delay={index * 150}>
                <Card className="overflow-hidden border-none shadow-soft hover:shadow-hover transition-all duration-300 group h-full cursor-pointer">
                  <div className="flex flex-col sm:flex-row h-full">
                    <div className="sm:w-2/5 overflow-hidden relative">
                      <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
                      <img
                        src={service.image}
                        alt={service.title}
                        className="object-cover w-full h-48 sm:h-full group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <CardContent className="sm:w-3/5 p-6 sm:p-8 flex flex-col justify-center bg-white group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <div className="bg-primary/5 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors">
                        <Icon className="text-primary group-hover:text-white" size={24} />
                      </div>
                      <h3 className="font-poppins font-bold text-xl mb-3 text-primary group-hover:text-white">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground group-hover:text-white/80 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </FadeIn>
            )
          })}
        </div>
      </div>
    </section>
  )
}
