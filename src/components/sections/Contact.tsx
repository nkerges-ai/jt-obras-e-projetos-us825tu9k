import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addVisitorLog } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { MessageSquare, Mail } from 'lucide-react'

export function Contact() {
  const { toast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return

    addVisitorLog({
      link: window.location.pathname,
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: 'Registered',
    })

    toast({
      title: 'Solicitação recebida!',
      description: 'Nossa equipe entrará em contato em poucas horas.',
    })
    setForm({ name: '', email: '', phone: '' })
  }

  return (
    <section id="contato" className="py-14 md:py-20 bg-slate-50/60 border-t border-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <span className="text-brand-orange font-bold uppercase tracking-wider text-xs mb-1 block">
            Atendimento Imediato
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-brand-navy mb-2">
            Solicite um Orçamento Rápido
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Resposta em poucas horas. Sem compromisso.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 text-left">
              <Label>Nome Completo</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label>E-mail</Label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div className="space-y-2 text-left">
              <Label>Telefone / WhatsApp</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 90000-0000"
              />
            </div>
            <Button
              type="submit"
              className="w-full gap-2 text-lg h-12 bg-brand-light hover:bg-[#008cc9]"
            >
              <Mail className="w-5 h-5" /> Cadastrar
            </Button>
          </form>
          <div className="mt-4 pt-4 border-t text-center">
            <p className="text-sm text-gray-500 mb-3">Ou fale diretamente pelo WhatsApp</p>
            <Button
              asChild
              variant="outline"
              className="w-full gap-2 border-green-500 text-green-600 hover:bg-green-50"
            >
              <a
                href="https://wa.me/5511940037545?text=Olá,%20gostaria%20de%20solicitar%20um%20orçamento.%20Meu%20nome%20é:%20[SEU%20NOME],%20Telefone:%20[SEU%20TELEFONE],%20Tipo%20de%20Obra:%20[TIPO]."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4" /> Enviar WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
