import { Button } from '@/components/ui/button'
import { ArrowRight, HardHat, ShieldCheck, Ruler } from 'lucide-react'
import { FadeIn } from '@/components/animations/FadeIn'
import { QuoteModal } from '@/components/sections/QuoteModal'
import { Link } from 'react-router-dom'

export function Hero() {
  const handleScrollDown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('servicos')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="inicio"
      className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-brand-navy"
    >
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('https://img.usecurling.com/p/1920/1080?q=construction%20site%20workers%20ppe')`,
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-pulse"></span>
              <span className="text-sm font-medium text-white">
                Especialistas em Obras Complexas
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Construindo Soluções com <span className="text-brand-light">Excelência</span> e
              Segurança
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              Qualidade, confiança e inovação em reformas e construções. Especialistas certificados
              em NR 10, NR 35 e NR 18 para garantir o sucesso do seu projeto.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <QuoteModal>
                <Button
                  size="lg"
                  className="bg-brand-orange hover:bg-[#cf6d18] text-white text-base h-14 px-8 w-full sm:w-auto"
                >
                  Solicitar Orçamento <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </QuoteModal>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10 hover:text-white text-base h-14 px-8 w-full sm:w-auto"
                asChild
              >
                <Link to="/portfolio">Conheça Nossos Projetos</Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2} className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4 translate-y-8">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <HardHat className="h-10 w-10 text-brand-orange mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Engenharia</h3>
                <p className="text-gray-400 text-sm">
                  Projetos estruturais e execução precisa para sua obra.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <Ruler className="h-10 w-10 text-brand-light mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Reformas</h3>
                <p className="text-gray-400 text-sm">
                  Modernização e adequação de espaços comerciais.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <ShieldCheck className="h-10 w-10 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Segurança (NRs)</h3>
                <p className="text-gray-400 text-sm">
                  Rigoroso cumprimento das normas NR 10, 18 e 35.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden h-48 border border-white/10 relative">
                <img
                  src="https://img.usecurling.com/p/400/400?q=engineer%20helmet%20safety"
                  alt="Projeto Seguro"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-navy/40 mix-blend-multiply"></div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <a
          href="#servicos"
          onClick={handleScrollDown}
          className="text-white/50 hover:text-white transition-colors"
        >
          <div className="w-[30px] h-[50px] rounded-full border-2 border-current flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-current rounded-full animate-scroll-down"></div>
          </div>
        </a>
      </div>
    </section>
  )
}
