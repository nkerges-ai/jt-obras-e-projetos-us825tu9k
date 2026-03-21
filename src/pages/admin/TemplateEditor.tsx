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

  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [isReqSignDialogOpen, setIsReqSignDialogOpen] = useState(false)
  const [reqSignPhone, setReqSignPhone] = useState('')

  const [isSigned, setIsSigned] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [signatureDate, setSignatureDate] = useState<string | null>(null)
  const [finalSignatureType, setFinalSignatureType] = useState<'draw' | 'upload' | 'govbr'>('draw')

  const [isBiometricOpen, setIsBiometricOpen] = useState(false)
  const [biometricData, setBiometricData] = useState<BiometricValidation | null>(null)
  const [tempSignature, setTempSignature] = useState<string | null>(null)

  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const isAuth = sessionStorage.getItem('admin_auth') === 'true'

  const [data, setData] = useState({
    clientName: '',
    document: '',
    address: '',
    description: '',
    value: '',
    date: '',
  })

  const [compliance, setCompliance] = useState({
    esocial: '',
    receita: '',
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

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Olá! Segue o link para o ${title} referente aos serviços da JT Obras e Manutenções.`,
    )
    addLog({
      type: 'WhatsApp',
      recipient: data.clientName || 'Cliente',
      message: `Link do ${title} gerado e disparado via WhatsApp.`,
      status: 'Enviado',
    })
    window.open(`https://wa.me/5511940037545?text=${text}`, '_blank')
    toast({
      title: 'Notificação WhatsApp',
      description: 'Registro de envio automático criado com sucesso.',
    })
  }

  const handleRequestSignature = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.clientName) {
      toast({
        title: 'Nome Necessário',
        description: 'Preencha o nome do cliente antes de solicitar assinatura.',
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
    const text = encodeURIComponent(
      `Olá! Foi solicitada a sua assinatura eletrônica no documento: ${sig.documentName}. Acesse o link seguro: ${link}`,
    )
    window.open(`https://wa.me/${reqSignPhone.replace(/\D/g, '')}?text=${text}`, '_blank')

    toast({
      title: 'Assinatura Solicitada',
      description: 'Link gerado e WhatsApp aberto para envio.',
    })
    setIsReqSignDialogOpen(false)
    setReqSignPhone('')
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    addLog({
      type: 'Email',
      recipient: emailData.to,
      message: `Documento ${title} enviado por e-mail (Assunto: ${emailData.subject}).`,
      status: 'Enviado',
    })
    toast({
      title: 'E-mail enviado com sucesso!',
      description: `O documento foi enviado e a notificação automatizada foi registrada.`,
    })
    setIsEmailDialogOpen(false)
    setEmailData({ to: '', subject: '' })
  }

  const getCoordinates = (e: any) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.nativeEvent.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.nativeEvent.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const startDrawing = (e: any) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getCoordinates(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e: any) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getCoordinates(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => setIsDrawing(false)

  const clearSignature = () =>
    canvasRef.current
      ?.getContext('2d')
      ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

  const handleSaveDrawing = () => {
    if (signType === 'draw') {
      if (!canvasRef.current) return
      setTempSignature(canvasRef.current.toDataURL('image/png'))
    } else if (signType === 'upload') {
      if (!uploadedSign) {
        toast({ title: 'Atenção', description: 'Faça upload da imagem.', variant: 'destructive' })
        return
      }
      setTempSignature(uploadedSign)
    } else if (signType === 'govbr') {
      if (!govbrLink) {
        toast({
          title: 'Atenção',
          description: 'Insira o link de validação.',
          variant: 'destructive',
        })
        return
      }
      setTempSignature('govbr')
    }

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

    addLog({
      type: 'Sistema',
      recipient: data.clientName || 'Cliente',
      message: `Assinatura digital e validação biométrica concluídas para ${title}.`,
      status: 'Enviado',
    })

    toast({
      title: 'Documento Assinado',
      description: 'A assinatura e validação foram aplicadas com sucesso.',
    })
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
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            <Dialog open={isReqSignDialogOpen} onOpenChange={setIsReqSignDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                >
                  <ShieldCheck className="h-4 w-4" />{' '}
                  <span className="hidden sm:inline">Solicitar Assinatura (Cliente)</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Assinatura do Cliente</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRequestSignature} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome do Cliente / Empresa</Label>
                    <Input
                      value={data.clientName}
                      disabled
                      className="bg-gray-50"
                      placeholder="Preencha no painel lateral"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp / Telefone para envio</Label>
                    <Input
                      required
                      placeholder="(11) 99999-9999"
                      value={reqSignPhone}
                      onChange={(e) => setReqSignPhone(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full gap-2 mt-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="h-4 w-4" /> Gerar Link e Enviar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={handleWhatsApp} className="gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />{' '}
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>
            <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" /> <span className="hidden sm:inline">E-mail</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Enviar Notificação por E-mail</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSendEmail} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>E-mail do Cliente</Label>
                    <Input
                      type="email"
                      required
                      placeholder="cliente@email.com"
                      value={emailData.to}
                      onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Assunto</Label>
                    <Input
                      required
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      placeholder="Assunto do e-mail"
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full gap-2 mt-2">
                      <Send className="h-4 w-4" /> Enviar Agora
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span>
            </Button>
            {!isSigned ? (
              <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                    <PenTool className="h-4 w-4" />{' '}
                    <span className="hidden sm:inline">Assinar (Administrador)</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Assinatura Digital - Interna</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Tabs
                      value={signType}
                      onValueChange={(v) => setSignType(v as any)}
                      className="w-full"
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
                        <p className="text-sm text-muted-foreground">
                          Desenhe sua assinatura no quadro abaixo.
                        </p>
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
                        <div className="flex justify-between">
                          <Button
                            variant="ghost"
                            onClick={clearSignature}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" /> Limpar
                          </Button>
                        </div>
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">
                          Faça upload de uma foto da sua assinatura (preferencialmente fundo
                          branco).
                        </p>
                        <Input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (ev) => setUploadedSign(ev.target?.result as string)
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        {uploadedSign && (
                          <img
                            src={uploadedSign}
                            className="h-24 object-contain border p-2 rounded bg-white mx-auto mix-blend-multiply"
                            alt="Preview"
                          />
                        )}
                      </TabsContent>
                      <TabsContent value="govbr" className="space-y-4 mt-4">
                        <p className="text-sm text-muted-foreground">
                          Insira o link de validação da sua assinatura gerada via Portal Gov.br.
                        </p>
                        <Input
                          placeholder="https://validar.iti.gov.br/..."
                          value={govbrLink}
                          onChange={(e) => setGovbrLink(e.target.value)}
                        />
                      </TabsContent>
                    </Tabs>
                    <div className="pt-4 border-t flex justify-end">
                      <Button onClick={handleSaveDrawing} className="gap-2 w-full sm:w-auto">
                        <Save className="h-4 w-4" /> Avançar para Validação
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-green-100 text-green-700 hover:bg-green-200 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" />{' '}
                <span className="hidden sm:inline">Assinado</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 print:p-0 print:m-0 print:w-full print:max-w-none">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 print:hidden">
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
              <h2 className="font-bold text-xl mb-4 border-b pb-2 text-brand-navy">
                Dados do Documento
              </h2>
              <div className="space-y-2">
                <Label htmlFor="clientName">Nome do Cliente / Empresa</Label>
                <Input
                  id="clientName"
                  placeholder="Nome completo ou Razão Social"
                  disabled={isSigned}
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">CPF / CNPJ</Label>
                <Input
                  id="document"
                  placeholder="000.000.000-00"
                  disabled={isSigned}
                  value={data.document}
                  onChange={(e) => setData({ ...data, document: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  placeholder="Rua, Número, Bairro, Cidade - Estado"
                  disabled={isSigned}
                  value={data.address}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição dos Serviços</Label>
                <Textarea
                  id="description"
                  className="min-h-[120px]"
                  placeholder="Descreva o escopo dos serviços detalhadamente..."
                  disabled={isSigned}
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Valor Total (R$)</Label>
                  <Input
                    id="value"
                    placeholder="Ex: 5.000,00"
                    disabled={isSigned}
                    value={data.value}
                    onChange={(e) => setData({ ...data, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">
                    {isContrato ? 'Prazo de Execução' : 'Validade da Proposta'}
                  </Label>
                  <Input
                    id="date"
                    placeholder={isContrato ? 'Ex: 30 dias' : 'Ex: 15 dias'}
                    disabled={isSigned}
                    value={data.date}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t mt-4">
                <h3 className="font-bold text-brand-navy">Dados de Conformidade (Opcional)</h3>
                <div className="space-y-2">
                  <Label>Dados eSocial</Label>
                  <Input
                    placeholder="Matrícula / Evento eSocial"
                    value={compliance.esocial}
                    onChange={(e) => setCompliance({ ...compliance, esocial: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Receita Federal do Brasil</Label>
                  <Input
                    placeholder="Status CPF/CNPJ / CNO"
                    value={compliance.receita}
                    onChange={(e) => setCompliance({ ...compliance, receita: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center print:block print:w-full">
            <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] relative print:shadow-none print:m-0 print:p-0">
              <div className="p-[20mm] pb-0">
                <header className="border-b-2 border-brand-orange pb-6 mb-10 flex justify-between items-end">
                  <div>
                    <img src={logo} alt="JT Obras" className="h-16 md:h-20 object-contain" />
                  </div>
                  <div className="text-right text-xs md:text-sm text-gray-600 space-y-0.5">
                    <p className="font-bold text-brand-navy">JT Obras e Manutenções LTDA</p>
                    <p>CNPJ: 63.243.791/0001-09</p>
                    <p>Rua Tommaso Giordani, 371, Vila Guacuri</p>
                    <p>São Paulo – SP, CEP 04.475-210</p>
                  </div>
                </header>
              </div>
              <main className="px-[20mm] pb-[30mm] text-gray-800 text-[15px] leading-relaxed text-justify space-y-6">
                <h2 className="text-center font-bold text-xl md:text-2xl uppercase mb-10 tracking-widest text-brand-navy">
                  {title}
                </h2>
                {isContrato ? (
                  <>
                    <p>
                      <strong>CONTRATANTE:</strong>{' '}
                      {data.clientName || '____________________________________'}, inscrito(a) no
                      CPF/CNPJ sob o nº {data.document || '____________________'}, com
                      sede/residência em {data.address || '____________________________________'}.
                    </p>
                    <p>
                      <strong>CONTRATADA:</strong> JT Obras e Manutenções LTDA, inscrita no CNPJ sob
                      o nº 63.243.791/0001-09, com sede em Rua Tommaso Giordani, 371, Vila Guacuri,
                      São Paulo - SP.
                    </p>
                    <p>
                      As partes acima identificadas têm, entre si, justo e acertado o presente
                      Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes e
                      pelas condições descritas.
                    </p>
                    <div className="space-y-4 pt-4">
                      <p>
                        <strong className="text-brand-navy">Cláusula 1ª - Do Objeto</strong>
                      </p>
                      <p className="pl-4">
                        O presente contrato tem como objeto a prestação dos serviços de:{' '}
                        <span className="font-medium whitespace-pre-wrap">
                          {data.description ||
                            '____________________________________________________________________'}
                        </span>
                        , a serem realizados no endereço da CONTRATANTE.
                      </p>
                      <p>
                        <strong className="text-brand-navy">
                          Cláusula 2ª - Do Valor e Forma de Pagamento
                        </strong>
                      </p>
                      <p className="pl-4">
                        Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor total de
                        R$ {data.value || '___________'}, com as condições de pagamento previamente
                        acordadas entre as partes.
                      </p>
                      <p>
                        <strong className="text-brand-navy">Cláusula 3ª - Do Prazo</strong>
                      </p>
                      <p className="pl-4">
                        Os serviços serão executados e entregues até {data.date || '___________'},
                        salvo em casos de força maior ou atrasos não imputáveis à CONTRATADA.
                      </p>
                    </div>

                    {(compliance.esocial || compliance.receita) && (
                      <div className="mt-6 border border-gray-300 p-3 rounded-sm bg-gray-50/50 text-[13px]">
                        <h3 className="font-bold text-brand-navy border-b border-gray-200 mb-2 pb-1">
                          Conformidade Regulatória
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {compliance.esocial && (
                            <div>
                              <strong className="text-gray-600 block">Dados eSocial:</strong>
                              <span>{compliance.esocial}</span>
                            </div>
                          )}
                          {compliance.receita && (
                            <div>
                              <strong className="text-gray-600 block">
                                Receita Federal do Brasil:
                              </strong>
                              <span>{compliance.receita}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-16 text-center space-y-16">
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
                            <div className="flex flex-col items-center justify-center h-16 mb-2 text-center">
                              <span className="text-[10px] font-bold text-blue-800 border border-blue-800 px-2 py-1 rounded bg-blue-50">
                                ASSINADO GOV.BR
                              </span>
                              <a
                                href={govbrLink}
                                className="text-[8px] text-blue-600 mt-1 underline break-all max-w-[180px]"
                              >
                                Verificar Validade
                              </a>
                            </div>
                          ) : isSigned && signatureData ? (
                            <div className="h-16 flex items-center justify-center mb-2">
                              <img
                                src={signatureData}
                                alt="Assinatura"
                                className="max-h-full mix-blend-multiply"
                              />
                            </div>
                          ) : (
                            <div className="border-t border-black mb-2 mt-16 w-full"></div>
                          )}
                          {isSigned && <div className="border-t border-black w-full mb-2"></div>}
                          <p className="font-bold text-sm">CONTRATADA</p>
                          <p className="text-xs">JT Obras e Manutenções LTDA</p>
                          {isSigned && (
                            <div className="mt-1 flex flex-col items-center">
                              <p className="text-[10px] text-green-600 flex items-center gap-1 font-bold">
                                <CheckCircle className="h-3 w-3" /> Assinado Digitalmente
                              </p>
                              <p className="text-[9px] text-gray-500 mt-0.5">{signatureDate}</p>
                              {biometricData && (
                                <div className="flex items-center gap-2 mt-2 border border-gray-200 rounded px-2 py-1 bg-gray-50/50">
                                  <img
                                    src={biometricData.imageUrl}
                                    alt="Validação"
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <div className="text-[8px] text-left leading-tight">
                                    <p className="font-bold text-gray-700">Validação Facial</p>
                                    <p className="text-gray-500">
                                      {new Date(biometricData.timestamp).toLocaleString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="w-full sm:w-1/2 px-4 flex flex-col items-center">
                          <div className="border-t border-black mb-2 mt-16 w-full"></div>
                          <p className="font-bold text-sm">CONTRATANTE</p>
                          <p className="text-xs">
                            {data.clientName || 'Assinatura do Cliente / Contratante'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>À {data.clientName || '___________________________'}</strong>
                      <br />
                      Aos cuidados do departamento responsável.
                    </p>
                    <p className="pt-4">
                      Apresentamos a nossa proposta comercial e técnica para a execução dos serviços
                      solicitados no endereço:{' '}
                      <span className="font-medium">
                        {data.address || '____________________________________'}
                      </span>
                      .
                    </p>
                    <div className="space-y-4 pt-4">
                      <p>
                        <strong className="text-brand-navy">1. Escopo dos Serviços</strong>
                      </p>
                      <div className="pl-4 whitespace-pre-wrap">
                        {data.description ||
                          '____________________________________________________________________\n____________________________________________________________________'}
                      </div>
                      <p>
                        <strong className="text-brand-navy">2. Investimento</strong>
                      </p>
                      <p className="pl-4">
                        O valor total para a realização dos serviços descritos acima é de:{' '}
                        <strong>R$ {data.value || '___________'}</strong>.
                      </p>
                      <p>
                        <strong className="text-brand-navy">3. Validade e Prazos</strong>
                      </p>
                      <ul className="pl-8 list-disc space-y-2">
                        <li>Validade desta proposta: {data.date || '___________'}</li>
                        <li>
                          A emissão de nota fiscal, custos com impostos e encargos trabalhistas
                          estão inclusos neste valor.
                        </li>
                      </ul>
                    </div>

                    {(compliance.esocial || compliance.receita) && (
                      <div className="mt-6 border border-gray-300 p-3 rounded-sm bg-gray-50/50 text-[13px]">
                        <h3 className="font-bold text-brand-navy border-b border-gray-200 mb-2 pb-1">
                          Conformidade Regulatória
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {compliance.esocial && (
                            <div>
                              <strong className="text-gray-600 block">Dados eSocial:</strong>
                              <span>{compliance.esocial}</span>
                            </div>
                          )}
                          {compliance.receita && (
                            <div>
                              <strong className="text-gray-600 block">
                                Receita Federal do Brasil:
                              </strong>
                              <span>{compliance.receita}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-16 space-y-16">
                      <p>Colocamo-nos à inteira disposição para quaisquer esclarecimentos.</p>
                      <p>
                        São Paulo,{' '}
                        {new Date().toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                        .
                      </p>
                      <div className="w-64 mx-auto text-center mt-12 flex flex-col items-center">
                        {isSigned && finalSignatureType === 'govbr' ? (
                          <div className="flex flex-col items-center justify-center h-16 mb-2 text-center">
                            <span className="text-[10px] font-bold text-blue-800 border border-blue-800 px-2 py-1 rounded bg-blue-50">
                              ASSINADO GOV.BR
                            </span>
                            <a
                              href={govbrLink}
                              className="text-[8px] text-blue-600 mt-1 underline break-all max-w-[180px]"
                            >
                              Verificar Validade
                            </a>
                          </div>
                        ) : isSigned && signatureData ? (
                          <div className="h-16 flex items-center justify-center mb-2">
                            <img
                              src={signatureData}
                              alt="Assinatura"
                              className="max-h-full mix-blend-multiply"
                            />
                          </div>
                        ) : (
                          <div className="border-t border-black mb-2 mt-16 w-full"></div>
                        )}
                        {isSigned && <div className="border-t border-black w-full mb-2"></div>}
                        <p className="font-bold text-sm">Joel Nascimento de Paula</p>
                        <p className="text-xs">Diretor Técnico - JT Obras e Manutenções LTDA</p>
                        {isSigned && (
                          <div className="mt-1 flex flex-col items-center">
                            <p className="text-[10px] text-green-600 flex items-center gap-1 font-bold">
                              <CheckCircle className="h-3 w-3" /> Assinado Digitalmente
                            </p>
                            <p className="text-[9px] text-gray-500 mt-0.5">{signatureDate}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </main>
              <footer className="absolute bottom-[10mm] left-[20mm] right-[20mm] border-t border-brand-orange/30 pt-4 text-center text-xs text-brand-navy">
                <p className="font-semibold">
                  jt.obrasemanutencao@gmail.com | (11) 94003-7545 | (11) 94706-9293
                </p>
                <p className="mt-1 text-gray-500 font-medium">
                  Documento gerado eletronicamente pelo Sistema JT Obras
                </p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
