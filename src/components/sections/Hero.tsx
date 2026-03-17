import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
    >
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
              <ShieldCheck size={16} className="text-secondary" />
              <span className="text-sm font-medium">
                Especialistas em NR 10, NR 35, NR 18 e NR 01
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-poppins font-extrabold tracking-tight mb-6 leading-[1.1]">
              Transformando Ideias em <span className="text-secondary">Realidade</span>
            </h1>
          </FadeIn>

          <FadeIn delay={400}>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-light leading-relaxed">
              Qualidade, confiança e inovação em cada projeto. Sua satisfação é a nossa prioridade.
            </p>
          </FadeIn>

          <FadeIn
            delay={600}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-white hover:text-accent text-lg h-14 px-8 rounded-md transition-all duration-300 shadow-lg hover:shadow-xl group"
            >
              <a href="#contato" className="flex items-center">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 hover:text-white text-lg h-14 px-8 backdrop-blur-sm"
            >
              <a href="/portfolio">Ver Projetos</a>
            </Button>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
