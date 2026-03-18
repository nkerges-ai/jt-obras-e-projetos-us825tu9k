import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Wrench, Zap, PaintRoller, ShieldAlert, Hammer } from 'lucide-react'

const services = [
  {
    title: 'Obras Corporativas',
    description:
      'Construção e reforma de escritórios, galpões e lajes corporativas com foco em prazo e qualidade.',
    icon: Building2,
    image:
      'https://img.usecurling.com/p/600/400?q=construction%20worker%20helmet%20office&color=blue',
  },
  {
    title: 'Manutenção Industrial',
    description:
      'Serviços preventivos e corretivos em plantas industriais, garantindo operação contínua.',
    icon: Wrench,
    image: 'https://img.usecurling.com/p/600/400?q=industrial%20worker%20ppe&color=orange',
  },
  {
    title: 'Instalações Elétricas',
    description: 'Projetos e execução de baixa e média tensão, painéis e adequação à NR 10.',
    icon: Zap,
    image: 'https://img.usecurling.com/p/600/400?q=electrician%20ppe%20panel&color=black',
  },
  {
    title: 'Acabamentos Finos',
    description:
      'Revestimentos, pintura, gesso e marcenaria de alto padrão para ambientes exigentes.',
    icon: PaintRoller,
    image: 'https://img.usecurling.com/p/600/400?q=painter%20construction%20ppe',
  },
  {
    title: 'Trabalho em Altura',
    description: 'Equipe especializada e certificada em NR 35 para fachadas e coberturas.',
    icon: ShieldAlert,
    image: 'https://img.usecurling.com/p/600/400?q=construction%20worker%20height%20ppe&color=gray',
  },
  {
    title: 'Estruturas Metálicas',
    description: 'Fabricação e montagem de mezaninos, coberturas e reforços estruturais.',
    icon: Hammer,
    image: 'https://img.usecurling.com/p/600/400?q=welder%20steel%20ppe&color=black',
  },
]

export function Services() {
  return (
    <section id="projetos" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <FadeIn>
            <h2 className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2">
              Nossas Especialidades
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-4">
              Projetos e Serviços Especializados
            </h3>
            <p className="text-gray-600 text-lg">
              Oferecemos soluções completas em engenharia, do projeto à entrega das chaves, com
              equipes multidisciplinares e gestão rigorosa.
            </p>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <FadeIn key={index} delay={index * 0.1} direction="up">
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group h-full bg-white flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20 bg-white p-3 rounded-lg shadow-md group-hover:bg-brand-orange group-hover:text-white transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-brand-navy group-hover:text-white" />
                  </div>
                </div>
                <CardHeader className="pt-6 pb-2">
                  <CardTitle className="text-xl font-bold text-brand-navy group-hover:text-brand-light transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6 flex-grow">
                  <CardDescription className="text-gray-600 text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
