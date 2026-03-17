import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
      {/* Background with overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'url(https://img.usecurling.com/p/1920/1080?q=modern%20construction%20site&color=blue)',
        }}
      />
      <div className="absolute inset-0 z-10 bg-primary/80 mix-blend-multiply" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

      <div className="container relative z-20 px-4 py-32 text-center md:text-left text-white">
        <div className="max-w-3xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
              <ShieldCheck size={16} className="text-warning" />
              <span className="text-sm font-medium">Especialistas em NR 10, NR 35 e NR 01</span>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-montserrat font-extrabold tracking-tight mb-6 leading-[1.1]">
              Excelência em{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-300">
                Obras Complexas
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-light leading-relaxed">
              A JT Obras e Manutenções entrega soluções de engenharia, construção civil e manutenção
              industrial com rigoroso padrão de segurança e qualidade.
            </p>
          </FadeIn>

          <FadeIn
            delay={600}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button
              size="lg"
              className="bg-secondary hover:bg-white hover:text-secondary text-lg h-14 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <a href="#portfolio" className="flex items-center">
                Conheça nossos Projetos
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 hover:text-white text-lg h-14 px-8 backdrop-blur-sm"
            >
              <a href="#contato">Fale Conosco</a>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
