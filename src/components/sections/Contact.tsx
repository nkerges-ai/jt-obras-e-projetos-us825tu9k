import { useState } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Send, Loader2 } from 'lucide-react'

export function Contact() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: 'Mensagem enviada com sucesso!',
        description: 'Nossa equipe comercial entrará em contato em breve.',
        className: 'bg-green-50 border-green-200 text-green-900',
      })
      ;(e.target as HTMLFormElement).reset()
    }, 1500)
  }

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      ></div>

      <div className="container px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div className="text-white space-y-6">
              <h2 className="font-montserrat font-bold text-4xl lg:text-5xl leading-tight">
                Pronto para iniciar
                <br />
                <span className="text-accent">sua obra?</span>
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700">
                      Nome Completo
                    </label>
                    <Input
                      id="name"
                      required
                      placeholder="João da Silva"
                      className="h-12 bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="company" className="text-sm font-semibold text-slate-700">
                        Empresa
                      </label>
                      <Input
                        id="company"
                        required
                        placeholder="Nome da sua empresa"
                        className="h-12 bg-slate-50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-semibold text-slate-700">
                        Telefone / WhatsApp
                      </label>
                      <Input
                        id="phone"
                        required
                        placeholder="(00) 00000-0000"
                        className="h-12 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      E-mail Profissional
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="joao@empresa.com.br"
                      className="h-12 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-semibold text-slate-700">
                      Detalhes do Projeto
                    </label>
                    <Textarea
                      id="message"
                      required
                      placeholder="Descreva brevemente a obra ou serviço necessário..."
                      className="min-h-[120px] bg-slate-50 resize-y"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-secondary hover:bg-primary transition-colors"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando Solicitação...
                      </>
                    ) : (
                      <>
                        Solicitar Orçamento
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
