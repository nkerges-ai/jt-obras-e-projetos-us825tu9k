import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Mail, Send, Loader2 } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

interface EmailSenderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName: string
}

export function EmailSenderDialog({ open, onOpenChange, documentName }: EmailSenderDialogProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setMessage(
        `Olá,\n\nSegue em anexo o documento: ${documentName}.\n\nAtenciosamente,\nEquipe JT Obras e Manutenções`,
      )
    }
  }, [open, documentName])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)

    try {
      await pb.send('/backend/v1/send-email', {
        method: 'POST',
        body: {
          to: email,
          subject: `Documento: ${documentName}`,
          html: `<p>${message.replace(/\n/g, '<br/>')}</p>`,
        },
      })

      toast({
        title: 'E-mail Enviado',
        description: `O documento foi enviado com sucesso para ${email}.`,
      })
      onOpenChange(false)
      setEmail('')
    } catch (error) {
      toast({
        title: 'Erro ao enviar',
        description: 'Não foi possível enviar o e-mail no momento.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1e293b] border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Mail className="w-5 h-5 text-[#3498db]" /> Enviar por E-mail
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            O documento <strong className="text-slate-200">{documentName}</strong> será anexado
            automaticamente em formato PDF nesta mensagem.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-slate-300">E-mail do Destinatário</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@empresa.com.br"
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Mensagem</Label>
            <Textarea
              className="min-h-[120px] bg-slate-800 border-slate-700 text-white"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2 bg-[#3498db] hover:bg-[#2980b9] text-white"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Enviando...' : 'Disparar E-mail'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
