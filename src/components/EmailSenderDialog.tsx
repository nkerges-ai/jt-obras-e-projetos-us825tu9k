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
import { Mail, Send } from 'lucide-react'
import { addLog } from '@/lib/storage'

interface EmailSenderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentName: string
}

export function EmailSenderDialog({ open, onOpenChange, documentName }: EmailSenderDialogProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setMessage(
        `Olá,\n\nSegue em anexo o documento: ${documentName}.\n\nAtenciosamente,\nEquipe JT Obras e Manutenções`,
      )
    }
  }, [open, documentName])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    // Simulate sending email and log it
    addLog({
      type: 'Email',
      recipient: email,
      message: `Documento Enviado: ${documentName}`,
      status: 'Enviado',
    })

    toast({
      title: 'E-mail Enviado',
      description: `O documento foi enviado com sucesso para ${email}.`,
    })

    onOpenChange(false)
    setEmail('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-navy">
            <Mail className="w-5 h-5 text-brand-light" /> Enviar por E-mail
          </DialogTitle>
          <DialogDescription>
            O documento <strong>{documentName}</strong> será anexado automaticamente em formato PDF
            nesta mensagem.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSend} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>E-mail do Destinatário</Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cliente@empresa.com.br"
            />
          </div>
          <div className="space-y-2">
            <Label>Mensagem</Label>
            <Textarea
              className="min-h-[120px]"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full gap-2 bg-brand-light hover:bg-brand-light/90">
            <Send className="w-4 h-4" /> Disparar E-mail
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
