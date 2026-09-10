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
  Paintbrush,
  Droplets,
  HardHat,
  Wind,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const allServices = [
  // 1. Reformas (residencial, comercial e corporativo)
  {
    title: 'Reformas Gerais & Corporativas',
    tag: 'Residencial e Comercial',
    description:
      'Adequação de ambientes residenciais, lajes corporativas e galpões com acabamento técnico e prazo rigoroso.',
    icon: Hammer,
    image:
      'https://img.usecurling.com/p/600/400?q=commercial%20building%20interior%20renovation%20office',
    featured: true,
  },
  // 2. Telhados (coberturas térmicas, montagem e vedação estrutural)
  {
    title: 'Telhados & Coberturas',
    tag: 'Metálico e Térmico',
    description:
      'Coberturas térmicas, telhas zipadas, isolamento termoacústico, montagem e vedação estrutural completa.',
    icon: Home,
    image:
      'https://img.usecurling.com/p/600/400?q=industrial%20warehouse%20roof%20steel%20structure',
    featured: true,
  },
  // 3. Bangalôs (estruturas rústicas e modernas de alta durabilidade)
  {
    title: 'Bangalôs & Estruturas',
    tag: 'Madeira e Design',
    description:
      'Estruturas rústicas e modernas de alta durabilidade para empreendimentos, áreas de lazer e convivência.',
    icon: Palmtree,
    image:
      'https://img.usecurling.com/p/600/400?q=timber%20framing%20construction%20wooden%20structure',
    featured: true,
  },
  // 4. Decks de madeira (madeira tratada nobre para áreas externas e piscinas)
  {
    title: 'Decks de Madeira Nobre',
    tag: 'Madeira Tratada',
    description:
      'Estruturação em madeira nobre tratada para áreas externas, piscinas, passarelas e tráfego intenso.',
    icon: Layers,
    image:
      'https://img.usecurling.com/p/600/400?q=hardwood%20decking%20commercial%20boardwalk%20construction',
    featured: true,
  },
  // 5. Projetos de engenharia (cálculo estrutural, laudos técnicos e ART/RRT)
  {
    title: 'Projetos de Engenharia & ART',
    tag: 'Cálculo e Laudos',
    description:
      'Projetos executivos, cálculo estrutural, laudos periciais e emissão de ART/RRT com responsabilidade técnica.',
    icon: Compass,
    image: 'https://img.usecurling.com/p/600/400?q=civil%20engineer%20plans%20industrial%20site',
    featured: true,
  },
  // 6. Instalação de sistemas de exaustão (dutos, coifas e motores de alto rendimento para comércio e indústria)
  {
    title: 'Sistemas de Exaustão & Ventilação',
    tag: 'Industrial e Comercial',
    description:
      'Dutos, coifas e motores de alto rendimento para renovação técnica de ar em cozinhas e indústrias.',
    icon: Fan,
    image: 'https://img.usecurling.com/p/600/400?q=industrial%20exhaust%20ventilation%20ductwork',
    featured: true,
  },
  // 7. Pintura Predial & Industrial (serviço original)
  {
    title: 'Pintura Predial & Industrial',
    tag: 'Fachadas e Galpões',
    description:
      'Pintura técnica de fachadas, pisos industriais epóxi e demarcações operacionais com ancoragem de alta durabilidade.',
    icon: Paintbrush,
    image:
      'https://img.usecurling.com/p/600/400?q=industrial%20painting%20building%20facade%20warehouse',
    featured: false,
  },
  // 8. Obras Civis & Estruturais (serviço original)
  {
    title: 'Obras Civis & Estruturais',
    tag: 'Alvenaria e Concreto',
    description:
      'Construção civil, alvenaria estrutural, fundações e ampliações com acompanhamento rigoroso de engenharia.',
    icon: Building2,
    image:
      'https://img.usecurling.com/p/600/400?q=commercial%20construction%20concrete%20building%20site',
    featured: false,
  },
  // 9. Instalações Elétricas Industriais & Comerciais (serviço original / NR 10)
  {
    title: 'Instalações Elétricas & NR 10',
    tag: 'Elétrica de Potência',
    description:
      'Montagem de quadros elétricos, redes de distribuição, iluminação industrial e conformidade total com a NR 10.',
    icon: Zap,
    image:
      'https://img.usecurling.com/p/600/400?q=industrial%20electrical%20panel%20wiring%20switchboard',
    featured: false,
  },
  // 10. Manutenção Predial & Preventiva (serviço original)
  {
    title: 'Manutenção Predial & Industrial',
    tag: 'Preventiva e Corretiva',
    description:
      'Planos contínuos de conservação para galpões, instalações comerciais e condomínios com equipe dedicada.',
    icon: Wrench,
    image:
      'https://img.usecurling.com/p/600/400?q=facility%20management%20maintenance%20technician%20industrial',
    featured: false,
  },
  // 11. Impermeabilização & Vedações (serviço original)
  {
    title: 'Impermeabilização Técnica',
    tag: 'Lajes e Reservatórios',
    description:
      'Aplicação de mantas asfálticas, poliuretano e vedações estruturais para eliminação definitiva de infiltrações.',
    icon: Droplets,
    image:
      'https://img.usecurling.com/p/600/400?q=waterproofing%20commercial%20concrete%20roof%20slab',
    featured: false,
  },
  // 12. Climatização & Ar Condicionado (serviço original do portfólio)
  {
    title: 'Climatização & HVAC',
    tag: 'Sistemas Térmicos',
    description:
      'Instalação, higienização profunda e manutenção técnica de ar condicionado central e sistemas Split.',
    icon: Wind,
    image:
      'https://img.usecurling.com/p/600/400?q=hvac%20commercial%20air%20conditioning%20industrial%20rooftop',
    featured: false,
  },
]

const complementaryHighlights = [
  {
    title: 'Adequação às Normas Regulamentadoras',
    description:
      'Trabalho em Altura (NR 35), Instalações Elétricas (NR 10) e Construção Civil (NR 18).',
    icon: HardHat,
  },
  {
    title: 'Emissão de ART e Laudos Periciais',
    description:
      'Todos os serviços contam com Anotação de Responsabilidade Técnica registrada no CREA.',
    icon: Compass,
  },
  {
    title: 'Contratos B2B & Gestão de Manutenção',
    description:
      'Atendimento corporativo e industrial com relatórios técnicos periódicos e equipe dedicada.',
    icon: Building2,
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

        {/* Grid Principal - Todos os Serviços com fotos e padrão visual unificado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {allServices.map((service, index) => {
            const Icon = service.icon
            return (
              <FadeIn key={service.title} delay={Math.min(index * 0.05, 0.4)} direction="up">
                <Card className="overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full bg-white flex flex-col rounded-2xl">
                  {/* Foto de topo com padrão corporativo/industrial */}
                  <div className="h-44 sm:h-48 overflow-hidden relative bg-slate-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 via-transparent to-transparent opacity-80" />

                    {/* Badge de categoria */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm">
                      {service.tag}
                    </div>

                    {/* Ícone com destaque laranja da marca */}
                    <div className="absolute bottom-3 left-3 bg-brand-orange text-white p-2.5 rounded-xl shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  {/* Conteúdo: Título em destaque + Descrição concisa */}
                  <CardContent className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-brand-navy group-hover:text-brand-orange transition-colors mb-1.5">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
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

        {/* Faixa complementar de diferenciais técnicos */}
        <FadeIn delay={0.25}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 md:p-6 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 text-center md:text-left">
              Garantias e padrões técnicos da JT Obras:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {complementaryHighlights.map((comp) => {
                const Icon = comp.icon
                return (
                  <div
                    key={comp.title}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-brand-navy text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-5 w-5 text-brand-orange" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-brand-navy leading-snug">
                        {comp.title}
                      </div>
                      <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {comp.description}
                      </div>
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
