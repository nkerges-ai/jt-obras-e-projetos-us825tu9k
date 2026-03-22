import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/button'
import { Phone, Mail, MapPin } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

export function Contact() {
  return (
    <section id="contato" className="py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-brand-navy mb-6">
                Pronto para iniciar seu projeto?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
                Nossa equipe de especialistas está preparada para avaliar suas necessidades e propor
                as melhores soluções em engenharia e manutenção.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Telefone / WhatsApp</h4>
                    <p className="text-muted-foreground">(11) 94003-7545 (Joel Nascimento)</p>
                    <p className="text-muted-foreground">(11) 94706-9293 (Tatiana Silva)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">E-mail</h4>
                    <a
                      href="mailto:jt.obrasemanutencao@gmail.com"
                      className="text-muted-foreground hover:text-brand-orange transition-colors"
                    >
                      jt.obrasemanutencao@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy mb-1">Endereço Sede</h4>
                    <p className="text-muted-foreground max-w-[250px]">
                      Rua Tommaso Giordani, 371, Vila Guacuri São Paulo – SP, CEP 04.475-210
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-bl-full"></div>
              <h3 className="text-2xl font-bold text-brand-navy mb-8">Solicite um Orçamento</h3>
              <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nome ou Empresa</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                      placeholder="Sua empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Telefone / Whats</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors"
                      placeholder="(11) 90000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Tipo de Serviço Necessário
                  </label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors bg-white">
                    <option>Manutenção Predial / Fachadas</option>
                    <option>Sistemas de Climatização (AC)</option>
                    <option>Instalações Elétricas / Hidráulicas</option>
                    <option>Reformas Estruturais</option>
                    <option>Outro serviço...</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Detalhes do Projeto</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-orange/50 focus:border-brand-orange transition-colors resize-none"
                    placeholder="Descreva brevemente o que você precisa..."
                  ></textarea>
                </div>
                <Button
                  className="w-full h-14 text-base font-bold bg-[#25D366] hover:bg-[#20b858] text-white rounded-xl group gap-2"
                  onClick={() => window.open('https://wa.me/5511940037545', '_blank')}
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Enviar Solicitação via WhatsApp
                </Button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
