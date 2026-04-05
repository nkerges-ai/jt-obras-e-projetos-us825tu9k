import { HardHat, ShieldCheck, Ruler } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import heroImage from '@/assets/whatsapp-image-2026-03-17-at-19.27.50-91cc3.jpeg'

export function Hero() {
  return (
    <section className="relative min-h-[100svh] lg:min-h-[70vh] w-full flex items-center pt-32 lg:pt-40 pb-16 overflow-hidden bg-brand-navy">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-navy/90 z-10 mix-blend-multiply" />
        <img
          src={heroImage}
          alt="Obra em andamento"
          className="w-full h-full object-cover object-center opacity-40"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-bold tracking-wide mb-6 border border-brand-orange/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
              Especialistas em Manutenção Predial e Industrial
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              A base sólida para o <span className="text-brand-orange">sucesso</span> da sua obra.
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl leading-relaxed font-light">
              Transformamos desafios complexos de engenharia em soluções seguras e eficientes para o
              setor corporativo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button
                size="lg"
                asChild
                className="bg-[#25D366] hover:bg-[#20b858] text-white h-14 px-8 text-base font-bold rounded-full group gap-2"
              >
                <a href="https://wa.me/5511940037545" target="_blank" rel="noopener noreferrer">
                  <WhatsAppIcon className="h-5 w-5" />
                  Fale com um Especialista
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('clientes')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="h-14 px-8 text-base font-bold rounded-full bg-transparent text-white border-white/40 hover:bg-white hover:text-brand-navy transition-colors"
              >
                Veja Nossos Clientes de Confiança
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-orange">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Segurança Total</h3>
                  <p className="text-gray-400 text-sm">Normas NRs rigorosas</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-orange">
                  <HardHat className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Equipe Qualificada</h3>
                  <p className="text-gray-400 text-sm">Profissionais certificados</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-brand-orange">
                  <Ruler className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Projetos Precisos</h3>
                  <p className="text-gray-400 text-sm">Execução dentro do prazo</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
