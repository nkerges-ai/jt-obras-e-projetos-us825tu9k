import { ShieldCheck, HardHat, Clock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeIn } from '@/components/animations/FadeIn'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import heroImage from '@/assets/whatsapp-image-2026-03-17-at-19.27.50-91cc3.jpeg'

export function Hero() {
  return (
    <section className="relative min-h-[92svh] lg:min-h-[75vh] w-full flex items-center pt-28 lg:pt-36 pb-12 overflow-hidden bg-brand-navy">
      {/* Background com imagem e gradiente de alto contraste */}
      <div className="absolute inset-0 z-0 bg-brand-navy">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/98 via-brand-navy/90 to-brand-navy/70 z-10" />
        <img
          src={heroImage}
          alt="Equipe JT Obras em execução"
          className="w-full h-full object-cover object-center opacity-25"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <FadeIn>
            {/* Tag curta e direta */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-xs md:text-sm font-bold tracking-wide mb-4 border border-brand-orange/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
              </span>
              Engenharia, Reformas & Manutenção
            </div>

            {/* Headline curta de 4 palavras-chave de impacto */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-4 tracking-tight drop-shadow-md">
              Sua Obra Pronta, <span className="text-brand-orange">Sem Dor de Cabeça</span>.
            </h1>

            {/* Subtítulo direto para empresas e indústrias */}
            <p className="text-base sm:text-xl text-slate-200 mb-6 max-w-xl leading-snug font-normal drop-shadow">
              Galpões industriais, reformas corporativas, coberturas metálicas, decks comerciais e
              exaustão industrial com ART e conformidade técnica.
            </p>

            {/* Bullets ultracurtos para leitura em 3 segundos */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 text-xs sm:text-sm text-slate-200">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Prazos e cronograma
                rigorosos
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Equipe qualificada e
                NRs
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" /> Responsabilidade
                técnica & ART
              </span>
            </div>

            {/* CTA Imediato WhatsApp / Orçamento */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Button
                size="lg"
                asChild
                className="bg-[#25D366] hover:bg-[#20b858] text-white h-13 sm:h-14 px-6 sm:px-8 text-base font-bold rounded-full group shadow-lg gap-2"
              >
                <a
                  href="https://wa.me/5511940037545?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20r%C3%A1pido."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Orçamento no WhatsApp
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('servicos')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="h-13 sm:h-14 px-6 sm:px-8 text-base font-bold rounded-full bg-white/10 text-white border-white/40 hover:bg-white hover:text-brand-navy transition-all backdrop-blur-sm"
              >
                Ver Nossos Serviços <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </div>
          </FadeIn>

          {/* Cards em 3 pilares rápidos: 2 palavras de título + 1 linha */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-6 border-t border-white/15">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Segurança Total</h3>
                  <p className="text-slate-300 text-xs">EPIs e normas NRs</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white shrink-0">
                  <HardHat className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Corpo Técnico</h3>
                  <p className="text-slate-300 text-xs">Treinado e certificado</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange text-white shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Prazo Garantido</h3>
                  <p className="text-slate-300 text-xs">Cronograma à risca</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
