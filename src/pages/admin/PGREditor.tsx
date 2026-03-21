import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Printer,
  Save,
  MessageCircle,
  PenTool,
  CheckCircle,
  Upload,
  Fingerprint,
  Trash2,
  Mail,
  Link2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  PGRDocument,
  getPGRs,
  savePGRs,
  getProjects,
  Project,
  addLog,
  BiometricValidation,
  DocumentSignature,
  saveSignatures,
  getSignatures,
} from '@/lib/storage'
import { BiometricCapture } from '@/components/BiometricCapture'
import { PGRForm } from './components/PGRForm'
import { PGRPreview } from './components/PGRPreview'

export default function PGREditor() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [data, setData] = useState<Partial<PGRDocument>>({
    projectId: '',
    date: new Date().toISOString(),
    empresa: '',
    cnpj: '',
    elaborador: 'JT Obras (Téc. Segurança)',
    riscos: [],
  })
  const [projects, setProjects] = useState<Project[]>([])

  // Attachments
  const [attachments, setAttachments] = useState<string[]>([])
  const attachRef = useRef<HTMLInputElement>(null)

  // Email
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [emailTo, setEmailTo] = useState('')

  // Signatures
  const [isReqSignDialogOpen, setIsReqSignDialogOpen] = useState(false)
  const [signPhone, setSignPhone] = useState('')

  const [isAdminSignOpen, setIsAdminSignOpen] = useState(false)
  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')
  const [tempSignature, setTempSignature] = useState<string | null>(null)

  const [isBiometricOpen, setIsBiometricOpen] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  useEffect(() => {
    if (isAdminSignOpen && canvasRef.current && signType === 'draw') {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isAdminSignOpen, signType])

  const handleSave = () => {
    const pgrs = getPGRs()
    const doc: PGRDocument = {
      ...(data as PGRDocument),
      id: data.id || `pgr_${Date.now()}`,
    }
    const filtered = pgrs.filter((p) => p.id !== doc.id)
    savePGRs([doc, ...filtered])
    toast({
      title: 'PGR Salvo',
      description: 'O Programa de Gerenciamento de Riscos foi salvo com sucesso.',
    })
    navigate('/admin')
  }

  const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAttachments([...attachments, ev.target?.result as string])
        toast({ title: 'Anexo Adicionado', description: 'Arquivo anexado ao documento.' })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEmail = (e: React.FormEvent) => {
    e.preventDefault()
    addLog({
      type: 'Email',
      recipient: emailTo,
      message: `Documento PGR enviado por e-mail.`,
      status: 'Enviado',
    })
    toast({ title: 'E-mail Enviado', description: `O PGR foi enviado para ${emailTo}.` })
    setIsEmailOpen(false)
    setEmailTo('')
  }

  const handleWhatsApp = () => {
    addLog({
      type: 'WhatsApp',
      recipient: data.empresa || 'Cliente',
      message: `Link do PGR gerado.`,
      status: 'Enviado',
    })
    window.open(
      `https://wa.me/5511940037545?text=Ol%C3%A1!+Segue+o+link+do+Programa+de+Gerenciamento+de+Riscos+%28PGR%29.`,
      '_blank',
    )
    toast({ title: 'Notificação', description: 'WhatsApp aberto para envio.' })
  }

  const handleRequestSignature = (e: React.FormEvent) => {
    e.preventDefault()
    const id = `sig_${Date.now()}`
    const sig: DocumentSignature = {
      id,
      documentId: data.id || `pgr_temp`,
      documentName: `PGR - ${data.empresa || 'Cliente'}`,
      clientName: data.empresa || 'Cliente',
      clientPhone: signPhone,
      status: 'Pendente',
      sentDate: new Date().toISOString(),
    }
    saveSignatures([sig, ...getSignatures()])
    const link = `${window.location.origin}/assinatura/${id}`
    window.open(
      `https://wa.me/${signPhone.replace(/\D/g, '')}?text=Ol%C3%A1!+Por+favor+assine+o+PGR:+${link}`,
      '_blank',
    )
    toast({ title: 'Assinatura Solicitada', description: 'Link gerado e WhatsApp aberto.' })
    setIsReqSignDialogOpen(false)
    setSignPhone('')
  }

  // --- Admin Signature Methods ---
  const startDrawing = (e: any) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }
  const draw = (e: any) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const stopDrawing = () => setIsDrawing(false)

  const handleSaveAdminSignature = () => {
    if (signType === 'draw') {
      if (!canvasRef.current) return
      setTempSignature(canvasRef.current.toDataURL('image/png'))
    } else if (signType === 'upload') {
      if (!uploadedSign) return
      setTempSignature(uploadedSign)
    } else if (signType === 'govbr') {
      setTempSignature('govbr')
    }
    setIsAdminSignOpen(false)
    setTimeout(() => setIsBiometricOpen(true), 300)
  }

  const finalizeAdminSignature = (bioData: BiometricValidation) => {
    setData({
      ...data,
      adminSignature: {
        type: signType,
        data: signType !== 'govbr' ? tempSignature! : undefined,
        link: signType === 'govbr' ? govbrLink : undefined,
        date: new Date().toLocaleString('pt-BR'),
        biometric: bioData,
      },
    })
    setIsBiometricOpen(false)
    toast({
      title: 'Documento Assinado',
      description: 'A assinatura digital foi vinculada ao PGR.',
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={finalizeAdminSignature}
        onCancel={() => setIsBiometricOpen(false)}
      />

      {/* ACTION BAR */}
      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate hidden md:block">
              Gestão de PGR (NR-01)
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <input type="file" ref={attachRef} className="hidden" onChange={handleAttach} />
            <Button
              variant="outline"
              size="sm"
              onClick={() => attachRef.current?.click()}
              className="gap-2 hidden md:flex"
            >
              <Upload className="h-4 w-4 text-blue-600" /> Anexar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEmailOpen(true)}
              className="gap-2 hidden md:flex"
            >
              <Mail className="h-4 w-4 text-blue-500" /> Email
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className="gap-2 hidden sm:flex"
            >
              <MessageCircle className="h-4 w-4 text-green-600" /> WhatsApp
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReqSignDialogOpen(true)}
              className="gap-2 border-green-200 text-green-700 bg-green-50 hover:bg-green-100"
            >
              <Link2 className="h-4 w-4" /> Solicitar Assin.
            </Button>

            {!data.adminSignature ? (
              <Button
                size="sm"
                onClick={() => setIsAdminSignOpen(true)}
                className="gap-2 bg-brand-navy"
              >
                <PenTool className="h-4 w-4" /> Assinar
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-green-100 text-green-700 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" /> Assinado
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2 hidden sm:flex"
            >
              <Save className="h-4 w-4" /> Salvar
            </Button>
            <Button
              onClick={() => window.print()}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 print:p-0 print:w-full print:max-w-none flex flex-col lg:flex-row gap-8 items-start">
        <PGRForm data={data} setData={setData} projects={projects} />
        <div className="flex-1 flex flex-col">
          <PGRPreview data={data} />

          {/* Append Attachments in Print View */}
          {attachments.map((att, i) => (
            <div
              key={i}
              className="print:block hidden bg-white shadow-xl w-full max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] border border-gray-400 mt-8"
            >
              <h3 className="text-lg font-bold mb-4">Anexo de Evidência {i + 1}</h3>
              <img src={att} className="max-w-full" alt="Anexo PGR" />
            </div>
          ))}
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={isEmailOpen} onOpenChange={setIsEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar PGR por E-mail</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEmail} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>E-mail do Destinatário</Label>
              <Input
                type="email"
                required
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar E-mail
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signature Dialogs */}
      <Dialog open={isReqSignDialogOpen} onOpenChange={setIsReqSignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Assinatura</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestSignature} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Telefone WhatsApp (Destinatário)</Label>
              <Input
                required
                value={signPhone}
                onChange={(e) => setSignPhone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Gerar Link Seguro
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAdminSignOpen} onOpenChange={setIsAdminSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura do Elaborador</DialogTitle>
          </DialogHeader>
          <Tabs
            value={signType}
            onValueChange={(v) => setSignType(v as any)}
            className="w-full pt-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draw" className="gap-1 text-xs">
                <PenTool className="h-3 w-3" /> Desenhar
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-1 text-xs">
                <Upload className="h-3 w-3" /> Imagem
              </TabsTrigger>
              <TabsTrigger value="govbr" className="gap-1 text-xs">
                <Fingerprint className="h-3 w-3" /> Gov.br
              </TabsTrigger>
            </TabsList>
            <TabsContent value="draw" className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 touch-none">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="w-full h-[200px] cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4 mt-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    const r = new FileReader()
                    r.onload = (ev) => setUploadedSign(ev.target?.result as string)
                    r.readAsDataURL(f)
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="govbr" className="space-y-4 mt-4">
              <Input
                placeholder="Link de validação"
                value={govbrLink}
                onChange={(e) => setGovbrLink(e.target.value)}
              />
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button onClick={handleSaveAdminSignature} className="w-full mt-4">
              Avançar para Validação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
