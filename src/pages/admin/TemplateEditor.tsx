import { useState, useRef, useEffect } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Printer,
  Mail,
  Send,
  MessageCircle,
  PenTool,
  CheckCircle,
  Save,
  Trash2,
  ShieldCheck,
  Upload,
  Fingerprint,
  Link2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logo from '@/assets/logotipo-c129e.jpg'
import {
  addLog,
  BiometricValidation,
  saveSignatures,
  getSignatures,
  DocumentSignature,
} from '@/lib/storage'
import { BiometricCapture } from '@/components/BiometricCapture'

export default function TemplateEditor() {
  const { type } = useParams<{ type: string }>()
  const { toast } = useToast()

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailData, setEmailData] = useState({ to: '', subject: '' })

  const [isReqSignDialogOpen, setIsReqSignDialogOpen] = useState(false)
  const [reqSignPhone, setReqSignPhone] = useState('')

  const [isSigned, setIsSigned] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [signatureDate, setSignatureDate] = useState<string | null>(null)
  const [finalSignatureType, setFinalSignatureType] = useState<'draw' | 'upload' | 'govbr'>('draw')

  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [isBiometricOpen, setIsBiometricOpen] = useState(false)
  const [biometricData, setBiometricData] = useState<BiometricValidation | null>(null)
  const [tempSignature, setTempSignature] = useState<string | null>(null)

  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const [attachments, setAttachments] = useState<string[]>([])
  const attachRef = useRef<HTMLInputElement>(null)

  const isAuth = sessionStorage.getItem('admin_auth') === 'true'

  const [data, setData] = useState({
    clientName: '',
    document: '',
    address: '',
    description: '',
    value: '',
    date: '',
  })

  useEffect(() => {
    if (isSignDialogOpen && canvasRef.current && signType === 'draw') {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isSignDialogOpen, signType])

  if (!isAuth) return <Navigate to="/admin/login" />
  if (type !== 'contrato' && type !== 'orcamento') return <Navigate to="/admin" />

  const isContrato = type === 'contrato'
  const title = isContrato ? 'Contrato de Prestação de Serviços' : 'Proposta Comercial'

  const handlePrint = () => window.print()

  const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAttachments([...attachments, ev.target?.result as string])
        toast({ title: 'Anexo Adicionado' })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá! Segue o link para o ${title} referente aos serviços.`)
    addLog({
      type: 'WhatsApp',
      recipient: data.clientName || 'Cliente',
      message: `Link gerado.`,
      status: 'Enviado',
    })
    window.open(`https://wa.me/5511940037545?text=${text}`, '_blank')
    toast({ title: 'Notificação WhatsApp' })
  }

  const handleRequestSignature = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.clientName) {
      toast({
        title: 'Nome Necessário',
        description: 'Preencha o nome do cliente.',
        variant: 'destructive',
      })
      return
    }
    const id = `sig_${Date.now()}`
    const sig: DocumentSignature = {
      id,
      documentId: `doc_template_${Date.now()}`,
      documentName: `${title} - ${data.clientName}`,
      clientName: data.clientName,
      clientPhone: reqSignPhone,
      status: 'Pendente',
      sentDate: new Date().toISOString(),
    }
    saveSignatures([sig, ...getSignatures()])
    const link = `${window.location.origin}/assinatura/${id}`
    const text = encodeURIComponent(`Olá! Assine o documento: ${link}`)
    window.open(`https://wa.me/${reqSignPhone.replace(/\D/g, '')}?text=${text}`, '_blank')
    toast({ title: 'Assinatura Solicitada' })
    setIsReqSignDialogOpen(false)
    setReqSignPhone('')
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    addLog({
      type: 'Email',
      recipient: emailData.to,
      message: `Documento enviado.`,
      status: 'Enviado',
    })
    toast({ title: 'E-mail enviado' })
    setIsEmailDialogOpen(false)
    setEmailData({ to: '', subject: '' })
  }

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

  const handleSaveDrawing = () => {
    if (signType === 'draw' && canvasRef.current)
      setTempSignature(canvasRef.current.toDataURL('image/png'))
    else if (signType === 'upload') setTempSignature(uploadedSign)
    else if (signType === 'govbr') setTempSignature('govbr')
    setIsSignDialogOpen(false)
    setTimeout(() => setIsBiometricOpen(true), 300)
  }

  const finalizeSignature = (bioData: BiometricValidation) => {
    setSignatureData(tempSignature)
    setFinalSignatureType(signType)
    setSignatureDate(new Date().toLocaleString('pt-BR'))
    setBiometricData(bioData)
    setIsSigned(true)
    setIsBiometricOpen(false)
    toast({ title: 'Documento Assinado' })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={finalizeSignature}
        onCancel={() => setIsBiometricOpen(false)}
      />

      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate hidden sm:block">
              Editando: {title}
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
              onClick={() => setIsEmailDialogOpen(true)}
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

            <Dialog open={isReqSignDialogOpen} onOpenChange={setIsReqSignDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                >
                  <Link2 className="h-4 w-4" />{' '}
                  <span className="hidden lg:inline">Sol. Assinatura</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Assinatura</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRequestSignature} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Telefone WhatsApp</Label>
                    <Input
                      required
                      value={reqSignPhone}
                      onChange={(e) => setReqSignPhone(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    Gerar Link
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            {!isSigned ? (
              <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white"
                  >
                    <PenTool className="h-4 w-4" />{' '}
                    <span className="hidden sm:inline">Assinar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Assinatura Digital</DialogTitle>
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
                    <Button onClick={handleSaveDrawing} className="w-full mt-4">
                      Avançar
                    </Button>
                  </Tabs>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-green-100 text-green-700 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" />{' '}
                <span className="hidden sm:inline">Assinado</span>
              </Button>
            )}

            <Button
              onClick={handlePrint}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 print:p-0 print:w-full print:max-w-none flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
            <h2 className="font-bold text-xl mb-4 border-b pb-2 text-brand-navy">
              Dados do Documento
            </h2>
            <div className="space-y-2">
              <Label>Nome do Cliente / Empresa</Label>
              <Input
                disabled={isSigned}
                value={data.clientName}
                onChange={(e) => setData({ ...data, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CPF / CNPJ</Label>
              <Input
                disabled={isSigned}
                value={data.document}
                onChange={(e) => setData({ ...data, document: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço Completo</Label>
              <Input
                disabled={isSigned}
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição dos Serviços</Label>
              <Textarea
                className="min-h-[120px]"
                disabled={isSigned}
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input
                  disabled={isSigned}
                  value={data.value}
                  onChange={(e) => setData({ ...data, value: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{isContrato ? 'Prazo' : 'Validade'}</Label>
                <Input
                  disabled={isSigned}
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start print:block print:w-full">
          <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:m-0 print:p-0">
            <div className="p-[15mm] border border-gray-400 min-h-[297mm] flex flex-col print:border-gray-800 m-[5mm] print:m-0">
              <header className="border-b-2 border-brand-orange pb-6 mb-10 flex justify-between items-end">
                <img src={logo} alt="JT Obras" className="h-16 md:h-20 object-contain" />
                <div className="text-right text-[11px] md:text-sm text-gray-600 space-y-0.5">
                  <p className="font-bold text-brand-navy">JT Obras e Manutenções LTDA</p>
                  <p>CNPJ: 63.243.791/0001-09</p>
                  <p>Rua Tommaso Giordani, 371, Vila Guacuri</p>
                </div>
              </header>

              <main className="flex-1 text-gray-800 text-[14px] leading-relaxed text-justify">
                <h2 className="text-center font-bold text-xl uppercase mb-10 tracking-widest text-brand-navy">
                  {title}
                </h2>
                {isContrato ? (
                  <>
                    <p>
                      <strong>CONTRATANTE:</strong> {data.clientName || '____________________'},
                      CPF/CNPJ: {data.document || '____________________'}.
                    </p>
                    <p>
                      <strong>CONTRATADA:</strong> JT Obras e Manutenções LTDA.
                    </p>
                    <div className="space-y-4 pt-4">
                      <p>
                        <strong>Cláusula 1ª:</strong> O objeto deste contrato é:{' '}
                        <span className="font-medium whitespace-pre-wrap">{data.description}</span>.
                      </p>
                      <p>
                        <strong>Cláusula 2ª:</strong> O valor total é de R${' '}
                        {data.value || '___________'}.
                      </p>
                      <p>
                        <strong>Cláusula 3ª:</strong> Prazo de execução:{' '}
                        {data.date || '___________'}.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>À {data.clientName || '___________________________'}</strong>
                    </p>
                    <div className="space-y-4 pt-4">
                      <p>
                        <strong>1. Escopo dos Serviços:</strong>
                      </p>
                      <div className="pl-4 whitespace-pre-wrap">{data.description}</div>
                      <p>
                        <strong>2. Investimento:</strong> R$ {data.value || '___________'}.
                      </p>
                      <p>
                        <strong>3. Validade:</strong> {data.date || '___________'}.
                      </p>
                    </div>
                  </>
                )}

                <div className="mt-16 text-center space-y-12">
                  <p>
                    São Paulo,{' '}
                    {new Date().toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                    .
                  </p>
                  <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-4 mt-8">
                    <div className="w-full sm:w-1/2 px-4 flex flex-col items-center">
                      {isSigned && finalSignatureType === 'govbr' ? (
                        <div className="h-16 flex items-center justify-center mb-2">
                          <span className="text-[10px] font-bold text-blue-800 border px-2 py-1 bg-blue-50">
                            ASSINADO GOV.BR
                          </span>
                        </div>
                      ) : isSigned && signatureData ? (
                        <div className="h-16 flex items-center justify-center mb-2">
                          <img src={signatureData} className="max-h-full mix-blend-multiply" />
                        </div>
                      ) : (
                        <div className="border-t border-black mb-2 mt-16 w-full"></div>
                      )}
                      {isSigned && finalSignatureType !== 'govbr' && (
                        <div className="border-t border-black w-full mb-2"></div>
                      )}
                      <p className="font-bold text-sm">CONTRATADA</p>
                      <p className="text-xs">JT Obras e Manutenções LTDA</p>
                      {isSigned && biometricData && (
                        <div className="mt-1">
                          <p className="text-[10px] text-green-600 flex items-center gap-1 font-bold">
                            <CheckCircle className="h-3 w-3" /> Assinado
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="w-full sm:w-1/2 px-4 flex flex-col items-center">
                      <div className="border-t border-black mb-2 mt-16 w-full"></div>
                      <p className="font-bold text-sm">CONTRATANTE</p>
                      <p className="text-xs">{data.clientName || 'Assinatura'}</p>
                    </div>
                  </div>
                </div>
              </main>

              <footer className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500">
                <span>JT OBRAS E MANUTENÇÕES LTDA - CNPJ: 63.243.791/0001-09</span>
                <span>(11) 94003-7545</span>
                <span className="print:block hidden">Página 1</span>
              </footer>
            </div>
          </div>

          {attachments.map((att, i) => (
            <div
              key={i}
              className="print:block hidden bg-white shadow-xl w-full max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] border border-gray-400 mt-8"
            >
              <h3 className="text-lg font-bold mb-4">Anexo {i + 1}</h3>
              <img src={att} className="max-w-full" alt="Anexo" />
            </div>
          ))}
        </div>
      </div>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar por E-mail</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Input
                type="email"
                required
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
