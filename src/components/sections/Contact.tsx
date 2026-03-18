import { FadeIn } from '@/components/animations/FadeIn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  subject: z.string().min(2, 'Assunto é obrigatório'),
  message: z.string().min(10, 'A mensagem deve ter pelo menos 10 caracteres'),
})

export function Contact() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  })

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    toast({
      title: 'Mensagem enviada com sucesso!',
      description: 'Recebemos seu contato e retornaremos em breve.',
    })
    form.reset()
  }

  return (
    <section id="contato" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Contact Info Side */}
          <div className="bg-brand-navy text-white p-10 lg:w-2/5 flex flex-col justify-between">
            <FadeIn>
              <h2 className="text-3xl font-extrabold mb-2">Fale Conosco</h2>
              <p className="text-gray-300 mb-10 text-sm">
                Tem dúvidas adicionais ou prefere um contato direto? Preencha o formulário ou use
                nossos canais de atendimento.
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
                        href="https://wa.me/5511940037545"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-gray-300 hover:text-brand-orange transition-colors text-sm group"
                      >
                        <MessageCircle className="h-5 w-5 text-brand-orange group-hover:text-brand-light transition-colors shrink-0" />
                        <div>
                          <span className="font-medium text-white group-hover:text-brand-orange transition-colors block mb-0.5">
                            Joel Nascimento (Projetos)
                          </span>
                          <span>+55 11 94003-7545</span>
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

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Nome</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome completo"
                              className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">E-mail</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="seu@email.com"
                              className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Assunto</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sobre o que deseja falar?"
                            className="bg-gray-50 border-gray-200 focus-visible:ring-brand-light"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">Mensagem</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Escreva sua mensagem aqui..."
                            className="min-h-[120px] bg-gray-50 border-gray-200 focus-visible:ring-brand-light resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-[#cf6d18] text-white h-12 text-lg font-medium"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </Form>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  )
}
