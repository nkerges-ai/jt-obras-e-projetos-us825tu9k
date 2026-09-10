import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import {
  Hammer,
  Home,
  Palmtree,
  Layers,
  Compass,
  Fan,
  Building2,
  Wrench,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const requestedServices = [
  {
    title: 'Reformas Corporativas & Comerciais',
    tag: 'Lajes e Galpões',
    description:
      'Adequação de galpões, escritórios e layouts comerciais com acabamento robusto e entrega rápida.',
    icon: Hammer,
    image:
      'https://img.usecurling.com/p/600/400?q=commercial%20building%20interior%20renovation%20office',
    featured: true,
  },
  {
    title: 'Telhados & Coberturas Industriais',
    tag: 'Metálico e Térmico',
    description:
      'Montagem de estruturas metálicas, telhas zipadas, isolamento termoacústico e vedação técnica.',
    icon: Home,
    image:
      'https://img.usecurling.com/p/600/400?q=industrial%20warehouse%20roof%20steel%20structure',
    featured: true,
  },
  {
    title: 'Bangalôs & Estruturas de Madeira',
    tag: 'Estrutural e Comercial',
    description:
      'Montagem estrutural em madeira pesada para áreas de convivência corporativa, hotéis e empreendimentos.',
    icon: Layers,
    image:
      'https://img.usecurling.com/p/600/400?q=timber%20framing%20construction%20wooden%20structure',
    featured: true,
  },
  {
    title: 'Decks de Madeira Comercial',
    tag: 'Madeira Nobre Tratada',
    description:
      'Estruturação reforçada para passarelas, áreas externas de empresas e decks comerciais de alto tráfego.',
    icon: Layers,
    image:
      'https://img.usecurling.com/p/600/400?q=hardwood%20decking%20commercial%20boardwalk%20construction',
    featured: true,
  },
  {
    title: 'Projetos de Engenharia & ART',
    tag: 'Cálculo e Gestão Técnica',
    description:
      'Projetos executivos, laudos estruturais, cálculo de cargas e emissão de ART/RRT com responsabilidade técnica.',
    icon: Compass,
    image: 'https://img.usecurling.com/p/600/400?q=civil%20engineer%20plans%20industrial%20site',
    featured: true,
  },
  {
    title: 'Sistemas de Exaustão & Ventilação',
    tag: 'Industrial e Comercial',
    description:
      'Dimensionamento e montagem de redes de dutos industriais, coifas, exaustores centrífugos e filtragem.',
    icon: Fan,
    image: 'https://img.usecurling.com/p/600/400?q=industrial%20exhaust%20ventilation%20ductwork',
    featured: true,
  },
]

const complementaryServices = [
  {
    title: 'Obras Corporativas',
    description: 'Lajes e escritórios entregues no prazo.',
    icon: Building2,
  },
  {
    title: 'Manutenção Industrial',
    description: 'Reparos preventivos e corretivos rápidos.',
    icon: Wrench,
  },
  {
    title: 'Instalações Elétricas',
    description: 'Quadros, fiação e conformidade NR 10.',
    icon: Zap,
  },
]

export function Services() {
  return (
    <section id="servicos" className="py-16 md:py-24 bg-slate-50/70 border-y border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        {/* Cabeçalho curto e direto */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange text-xs md:text-sm font-bold tracking-wide mb-3">
              <ShieldCheck className="h-4 w-4" /> Soluções para Empresas e Indústrias
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight mb-3">
              O Que Fazemos
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Execução técnica, controle de cronograma e conformidade com normas de engenharia.
            </p>
          </FadeIn>
        </div>

        {/* Grid Principal - 6 Serviços Chave com fotos e cards rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {requestedServices.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.title} delay={index * 0.08} direction="up">
                <Card className="overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full bg-white flex flex-col rounded-2xl">
                  {/* Foto de topo */}
                  <div className="h-44 sm:h-48 overflow-hidden relative bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-80" />

                    {/* Badge de categoria rápida */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm">
                      {service.tag}
                    </div>

                    {/* Ícone */}
                    <div className="absolute bottom-3 left-3 bg-brand-orange text-white p-2.5 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Conteúdo textual curto: 1 título + 1 linha */}
                  <CardContent className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-brand-navy group-hover:text-brand-orange transition-colors mb-1.5">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-brand-orange flex items-center gap-1 group-hover:gap-1.5 transition-all">
                        Orçamento rápido <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <a
                        href={`https://wa.me/5511940037545?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento%20para%20${encodeURIComponent(service.title)}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-400 hover:text-brand-navy"
                        aria-label={`Pedir orçamento de ${service.title}`}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )
          })}
        </div>

        {/* Faixa complementar em 1 linha para leitura instantânea */}
        <FadeIn delay={0.3}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center md:text-left">
              Outras frentes atendidas pela JT Obras:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {complementaryServices.map((comp) => {
                const Icon = comp.icon
                return (
                  <div
                    key={comp.title}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-brand-navy text-white flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-brand-navy truncate">{comp.title}</div>
                      <div className="text-xs text-slate-500 truncate">{comp.description}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </FadeIn>

        {/* CTA rápido */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            asChild
            className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold h-12 px-8 rounded-full shadow-md"
          >
            <a
              href="https://wa.me/5511940037545?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20minha%20obra."
              target="_blank"
              rel="noopener noreferrer"
            >
              Pedir Orçamento sem Compromisso
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
