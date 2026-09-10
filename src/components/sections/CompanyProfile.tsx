import { FadeIn } from '@/components/animations/FadeIn'
import { CheckCircle2, Award, Users, Shield } from 'lucide-react'

export function CompanyProfile() {
  const highlights = [
    { title: 'Prazos Rigorosos', desc: 'Cronograma monitorado e cumprido.', icon: Award },
    { title: 'Corpo Técnico Próprio', desc: 'Profissionais qualificados em campo.', icon: Users },
    { title: 'Segurança NR 10, 18 e 35', desc: 'Zero improviso no canteiro.', icon: Shield },
    { title: 'Transparência Total', desc: 'Relatórios e fotos de cada fase.', icon: CheckCircle2 },
  ]

  return (
    <section id="sobre" className="py-16 md:py-24 bg-brand-navy text-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Imagem com selo de experiência */}
          <FadeIn direction="right">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-2xl border-2 border-white/10">
                <img
                  src="https://img.usecurling.com/p/800/600?q=civil%20engineers%20industrial%20construction%20site"
                  alt="Engenheiros e supervisão técnica em canteiro industrial"
                  loading="lazy"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-brand-orange text-white p-4 md:p-5 rounded-2xl shadow-xl hidden sm:block">
                <div className="text-3xl font-black">+10 Anos</div>
                <div className="text-xs font-semibold opacity-90">Construção & Engenharia</div>
              </div>
            </div>
          </FadeIn>

          {/* Texto Ultra-Curto para Leitura Rápida */}
          <FadeIn direction="left" delay={0.15}>
            <span className="text-brand-orange font-bold tracking-wider uppercase text-xs mb-2 block">
              Quem Somos
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-white">
              Engenharia Séria, Sem Complicação.
            </h2>
            <p className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed">
              A <strong>JT Obras e Projetos</strong> entrega obras industriais, coberturas
              metálicas, galpões, reformas corporativas e sistemas de exaustão com responsabilidade
              técnica, supervisão de engenharia e conformidade rigorosa com normas vigentes.
            </p>

            {/* Grid 2x2 com cards curtos */}
            <div className="grid sm:grid-cols-2 gap-3.5 mb-6">
              {highlights.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                  >
                    <Icon className="text-brand-orange h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm text-white">{item.title}</div>
                      <div className="text-xs text-slate-300">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="inline-flex items-center gap-2 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Atendimento em toda a Grande São Paulo e Região
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
