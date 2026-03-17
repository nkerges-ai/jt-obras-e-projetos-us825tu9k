import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'

export function Contact() {
  return (
    <section id="contato" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Contact Info Side */}
          <div className="bg-brand-navy text-white p-10 lg:w-2/5 flex flex-col justify-between">
            <FadeIn>
              <h2 className="text-3xl font-extrabold mb-2">Fale Conosco</h2>
              <p className="text-gray-300 mb-10 text-sm">
                Estamos prontos para entender as necessidades da sua obra e propor a melhor solução.
                Solicite um orçamento sem compromisso.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full shrink-0">
                    <Phone className="h-6 w-6 text-brand-light" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Telefones / WhatsApp</h4>
                    <div className="mt-3 space-y-4">
                      <a
                        href="https://wa.me/5511940037575"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-brand-orange transition-colors text-sm group"
                      >
                        <MessageCircle className="h-5 w-5 text-brand-orange group-hover:text-brand-light transition-colors shrink-0" />
                        <div>
                          <span className="font-medium text-white group-hover:text-brand-orange transition-colors block mb-0.5">
                            Joel Nascimento (Diretor)
                          </span>
                          <span>+55 11 94003-7575</span>
                        </div>
                      </a>
                      <a
                        href="https://wa.me/5511947069293"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-brand-orange transition-colors text-sm group"
                      >
                        <MessageCircle className="h-5 w-5 text-brand-orange group-hover:text-brand-light transition-colors shrink-0" />
                        <div>
                          <span className="font-medium text-white group-hover:text-brand-orange transition-colors block mb-0.5">
                            Tatiana (Financeiro)
                          </span>
                          <span>+55 11 94706-9293</span>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full shrink-0">
                    <Mail className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">E-mail</h4>
                    <p className="text-gray-300 text-sm mt-1">jt.obrasemanutencao@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full shrink-0">
                    <MapPin className="h-6 w-6 text-brand-light" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Escritório</h4>
                    <p className="text-gray-300 text-sm mt-1">
                      Rua Tommaso Giordani, 371 - Vila Guacuri
                      <br />
                      São Paulo – SP, CEP 04.475-210
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full shrink-0">
                    <Clock className="h-6 w-6 text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Horário de Atendimento</h4>
                    <p className="text-gray-300 text-sm mt-1">Segunda a Sexta: 08h às 18h</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form Side */}
          <div className="p-10 lg:w-3/5">
            <FadeIn delay={0.2}>
              <h3 className="text-2xl font-bold text-brand-navy mb-6">Envie sua mensagem</h3>

              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      placeholder="João da Silva"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-gray-700 font-medium">
                      Empresa
                    </Label>
                    <Input
                      id="company"
                      placeholder="Sua Empresa LTDA"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@empresa.com.br"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 90000-0000"
                      className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Mensagem ou Detalhes do Projeto
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Descreva brevemente o que você precisa..."
                    className="min-h-[120px] bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-[#cf6d18] text-white h-12 text-lg font-medium"
                >
                  Solicitar Orçamento Agora
                </Button>
              </form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
