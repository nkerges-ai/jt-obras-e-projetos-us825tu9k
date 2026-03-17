import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, FileText, Landmark, Wallet } from 'lucide-react'

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
                Sob a direção administrativa de <strong>Joel Nascimento</strong>, construímos nossa
                reputação através do rigor metodológico, atendimento personalizado e capacidade de
                mobilização ágil para atender manutenções emergenciais e projetos de grande
                envergadura.
              </p>

              <ul className="space-y-3 pt-4">
                {[
                  'Transparência Fiscal e Administrativa',
                  'Equipe Multidisciplinar Qualificada',
                  'Forte Política de Compliance e Segurança',
                  'Atendimento Ágil via WhatsApp',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-primary font-medium">
                    <CheckCircle2 className="text-accent" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          {/* Ficha Técnica & Banking Info */}
          <FadeIn direction="left" delay={200}>
            <div className="space-y-6">
              {/* Ficha Técnica Card */}
              <Card className="shadow-soft border-t-4 border-t-primary rounded-xl overflow-hidden">
                <CardHeader className="bg-white pb-2 border-b">
                  <CardTitle className="flex items-center gap-2 text-xl font-montserrat">
                    <FileText className="text-primary" size={24} />
                    Ficha Técnica e Dados Cadastrais
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-slate-50/50 space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">
                        Razão Social
                      </p>
                      <p className="font-medium text-slate-900">JT Obras e manutenções ltda</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">CNPJ</p>
                      <p className="font-mono font-medium text-slate-900">63.243.791/0001-09</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">
                        Regime de Apuração
                      </p>
                      <p className="font-medium text-slate-900">Simples Nacional</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-semibold uppercase">
                        Inscrição Estadual
                      </p>
                      <p className="font-mono font-medium text-slate-900">156.392.261.116</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs font-semibold uppercase mb-1">
                      Endereço Sede
                    </p>
                    <p className="font-medium text-slate-900">
                      Rua Tommaso Giordani, 371
                      <br />
                      Vila Guacuri – São Paulo - SP
                      <br />
                      CEP: 04.475-210
                    </p>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-muted-foreground text-xs font-semibold uppercase mb-1">
                      Representante Legal
                    </p>
                    <p className="font-medium text-slate-900">
                      Joel Nascimento de Paula
                      <br />
                      <span className="text-muted-foreground font-mono">CPF 167.815.198-08</span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Banking Info Card */}
              <Card className="shadow-soft border-l-4 border-l-accent rounded-xl overflow-hidden">
                <CardHeader className="bg-white pb-2 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg font-montserrat">
                    <Landmark className="text-accent" size={20} />
                    Dados Bancários para Faturamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white space-y-4 text-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xl">
                        I
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Banco Inter (077)</p>
                        <p className="text-muted-foreground font-mono">Agência: 0001</p>
                        <p className="text-muted-foreground font-mono">
                          Conta Jurídica: 50953889-4
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-[#E6F7F5] border border-[#32BCA4]/20">
                    <div className="flex items-center gap-3">
                      <Wallet className="text-[#32BCA4]" size={28} />
                      <div>
                        <p className="font-bold text-slate-900">Chave PIX (CNPJ)</p>
                        <p className="text-slate-700 font-mono font-bold text-lg">
                          63.243.791/0001-09
                        </p>
                      </div>
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
