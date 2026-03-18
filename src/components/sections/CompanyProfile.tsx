import { FadeIn } from '@/components/animations/FadeIn'
import { CheckCircle2 } from 'lucide-react'

export function CompanyProfile() {
  const values = [
    'Compromisso com Prazos e Custos',
    'Transparência Total com o Cliente',
    'Rigoroso Controle de Qualidade',
    'Segurança em Primeiro Lugar (NRs)',
    'Inovação em Processos Construtivos',
    'Sustentabilidade nos Canteiros',
  ]

  return (
    <section id="sobre" className="py-24 bg-brand-navy text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn direction="right">
            <div className="relative">
              <div className="absolute -inset-4 bg-brand-light/20 blur-2xl rounded-full z-0"></div>
              <img
                src="https://img.usecurling.com/p/800/600?q=construction%20engineers%20ppe&color=blue"
                alt="Equipe JT Obras"
                className="relative z-10 rounded-2xl shadow-2xl border-4 border-white/10 w-full object-cover"
              />
              <div className="absolute -bottom-8 -right-8 bg-brand-orange text-white p-6 rounded-2xl shadow-xl z-20 hidden md:block">
                <div className="text-4xl font-extrabold mb-1">+10</div>
                <div className="text-sm font-medium opacity-90">
                  Anos de Experiência
                  <br />
                  no Mercado
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <h2 className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2">
              Sobre Nós
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-6 text-white">
              Sólida Experiência na Construção Civil
            </h3>

            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              A JT Obras e Manutenções nasceu com o propósito de elevar o padrão de entregas na
              construção civil e reformas comerciais. Nossa equipe é formada por engenheiros e
              técnicos altamente capacitados.
            </p>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Temos orgulho de nosso histórico impecável no cumprimento de normas regulamentadoras,
              garantindo que cada obra seja um ambiente seguro para nossos colaboradores e para os
              nossos clientes.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {values.map((value, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-brand-light h-5 w-5 shrink-0" />
                  <span className="text-sm text-gray-200">{value}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
