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
          <Button type="submit" className="w-full gap-2 bg-[#3498db] hover:bg-[#2980b9] text-white">
            <Send className="w-4 h-4" /> Disparar E-mail
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
