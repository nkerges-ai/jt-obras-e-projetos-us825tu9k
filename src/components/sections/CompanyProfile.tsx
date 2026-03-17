import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, FileText } from 'lucide-react'

export function CompanyProfile() {
  return (
    <section id="sobre" className="py-24 bg-slate-50">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          {/* About Text */}
          <FadeIn direction="right">
            <div className="space-y-6">
              <h2 className="text-heading text-4xl">Perfil Corporativo</h2>
              <div className="w-20 h-1 bg-accent rounded"></div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A <strong>JT Obras e Manutenções</strong> é uma empresa consolidada no mercado de
                engenharia e construção civil. Nossa missão é entregar obras complexas com um nível
                de exigência inegociável em relação à qualidade técnica e à segurança de todos os
                envolvidos.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sob a direção de <strong>Joel Nascimento de Paula</strong>, construímos nossa
                reputação através do rigor metodológico e forte compromisso com normas técnicas,
                incluindo a rigorosa aplicação das normas NR 10, NR 35, NR 18 e NR 01.
              </p>

              <ul className="space-y-3 pt-4">
                {[
                  'Conformidade com NR 10, NR 35, NR 18 e NR 01',
                  'Equipe Multidisciplinar Qualificada',
                  'Forte Política de Compliance e Segurança',
                  'Atendimento Personalizado e Transparente',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-primary font-medium">
                    <CheckCircle2 className="text-accent" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Ficha Técnica */}
          <FadeIn direction="left" delay={200}>
            <div className="space-y-6">
              <Card className="shadow-soft border-t-4 border-t-primary rounded-xl overflow-hidden">
                <CardHeader className="bg-white pb-2 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl font-poppins">
                    <FileText className="text-primary" size={24} />
                    Ficha Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-slate-50/50 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">
                        Razão Social
                      </p>
                      <p className="font-medium text-slate-900">JT Obras e Manutenções</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">CNPJ</p>
                      <p className="font-mono font-medium text-slate-900">63.243.791/0001-09</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">
                        Regime Tributário
                      </p>
                      <p className="font-medium text-slate-900">Simples Nacional</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">
                        Diretor
                      </p>
                      <p className="font-medium text-slate-900">Joel Nascimento de Paula</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-muted-foreground text-xs font-semibold uppercase mb-1">
                      Sede
                    </p>
                    <p className="font-medium text-slate-900">
                      Rua Tommaso Giordani, 371
                      <br />
                      Vila Guacuri – São Paulo - SP
                      <br />
                      CEP: 04.475-210
                    </p>
                  </div>

                  <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase mb-1">
                        WhatsApp
                      </p>
                      <p className="font-medium text-slate-900">(11) 94003-7545</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase mb-1">
                        E-mail
                      </p>
                      <p className="font-medium text-slate-900">jt.obrasemanutencao@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
