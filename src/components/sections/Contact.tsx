import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Send, Loader2 } from 'lucide-react'

const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  company: z.string().min(2, 'Empresa é obrigatória'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('E-mail inválido'),
  message: z.string().min(10, 'A mensagem deve ter no mínimo 10 caracteres'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function Contact() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      company: '',
      phone: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (data: ContactFormValues) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Nossa equipe comercial entrará em contato em breve.',
        className: 'bg-green-50 border-green-200 text-green-900',
      })
      form.reset()
    }, 1500)
  }

  return (
    <section id="contato" className="py-24 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div className="text-white space-y-6">
              <h2 className="font-poppins font-bold text-4xl lg:text-5xl leading-tight">
                Vamos
                <br />
                <span className="text-accent">conversar?</span>
              </h2>
              <p className="text-white/80 text-lg max-w-md leading-relaxed">
                Solicite um orçamento sem compromisso. Nossa equipe técnica analisará sua demanda e
                apresentará a melhor solução em engenharia e manutenção.
              </p>
              <div className="hidden lg:block pt-8">
                <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 inline-block">
                  <p className="text-sm text-white/60 uppercase tracking-wider font-semibold mb-2">
                    Atendimento Imediato
                  </p>
                  <p className="text-2xl font-bold font-mono text-white">(11) 94003-7545</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="left" delay={200}>
            <Card className="border-0 shadow-2xl bg-white rounded-2xl">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="João da Silva"
                              className="h-12 bg-slate-50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Empresa</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Sua empresa"
                                className="h-12 bg-slate-50"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">
                              Telefone / WhatsApp
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="(11) 90000-0000"
                                className="h-12 bg-slate-50"
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
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">
                            E-mail Profissional
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="joao@empresa.com.br"
                              className="h-12 bg-slate-50"
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
                          <FormLabel className="text-slate-700 font-semibold">
                            Detalhes do Projeto
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva brevemente a obra ou serviço necessário..."
                              className="min-h-[120px] bg-slate-50 resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg bg-secondary hover:bg-primary transition-colors"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          Solicitar Orçamento
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
