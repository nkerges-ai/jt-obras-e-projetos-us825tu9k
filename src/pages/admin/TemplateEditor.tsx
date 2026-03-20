import { useState, useRef, useEffect } from 'react'
import { Navigate, useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logo from '@/assets/logotipo-c129e.jpg'
import { addLog } from '@/lib/storage'

export default function TemplateEditor() {
  const { type } = useParams<{ type: string }>()
  const { toast } = useToast()

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailData, setEmailData] = useState({ to: '', subject: '' })
  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)
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

  useEffect(() => {
    if (isSignDialogOpen && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isSignDialogOpen])

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
    window.open(`https://wa.me/?text=${text}`, '_blank')
    toast({
      title: 'Notificação WhatsApp',
      description: 'Registro de envio automático criado com sucesso.',
    })
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

  const saveSignature = () => {
    if (!canvasRef.current) return
    setSignatureData(canvasRef.current.toDataURL('image/png'))
    setIsSigned(true)
    setIsSignDialogOpen(false)

    addLog({
      type: 'Sistema',
      recipient: data.clientName || 'Cliente',
      message: `Assinatura digital concluída para ${title}. Notificação de confirmação enviada automaticamente.`,
      status: 'Enviado',
    })

    toast({
      title: 'Documento Assinado',
      description:
        'A assinatura digital foi aplicada. Cliente notificado com sucesso da conclusão.',
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
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
                    <span className="hidden sm:inline">Assinar</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Assinatura Digital</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Desenhe sua assinatura no quadro abaixo para validar o documento e notificar o
                      cliente automaticamente.
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
                      <Button onClick={saveSignature} className="gap-2">
                        <Save className="h-4 w-4" /> Salvar Assinatura
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
                      <strong>CONTRATANTE:</strong> {data.clientName || '[NOME DO CLIENTE]'},
                      inscrito(a) no CPF/CNPJ sob o nº {data.document || '[DOCUMENTO]'}, com
                      sede/residência em {data.address || '[ENDEREÇO COMPLETO]'}.
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
                          {data.description || '[DESCRIÇÃO DETALHADA DOS SERVIÇOS]'}
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
                        R$ {data.value || '[VALOR]'}, com as condições de pagamento previamente
                        acordadas entre as partes.
                      </p>
                      <p>
                        <strong className="text-brand-navy">Cláusula 3ª - Do Prazo</strong>
                      </p>
                      <p className="pl-4">
                        Os serviços serão executados e entregues até{' '}
                        {data.date || '[PRAZO DE EXECUÇÃO]'}, salvo em casos de força maior ou
                        atrasos não imputáveis à CONTRATADA.
                      </p>
                    </div>
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
                          {isSigned && signatureData ? (
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
                          {isSigned && signatureData && (
                            <div className="border-t border-black w-full mb-2"></div>
                          )}
                          <p className="font-bold text-sm">CONTRATANTE</p>
                          <p className="text-xs">{data.clientName || 'Assinatura do Cliente'}</p>
                          {isSigned && (
                            <p className="text-[10px] text-green-600 mt-1 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Assinado Digitalmente
                            </p>
                          )}
                        </div>
                        <div className="w-full sm:w-1/2 px-4 flex flex-col items-center">
                          <div className="border-t border-black mb-2 mt-16 w-full"></div>
                          <p className="font-bold text-sm">CONTRATADA</p>
                          <p className="text-xs">JT Obras e Manutenções LTDA</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>À {data.clientName || '[NOME DO CLIENTE]'}</strong>
                      <br />
                      Aos cuidados do departamento responsável.
                    </p>
                    <p className="pt-4">
                      Apresentamos a nossa proposta comercial e técnica para a execução dos serviços
                      solicitados no endereço:{' '}
                      <span className="font-medium">{data.address || '[ENDEREÇO DO PROJETO]'}</span>
                      .
                    </p>
                    <div className="space-y-4 pt-4">
                      <p>
                        <strong className="text-brand-navy">1. Escopo dos Serviços</strong>
                      </p>
                      <div className="pl-4 whitespace-pre-wrap">
                        {data.description || '[DESCRIÇÃO DETALHADA DOS SERVIÇOS]'}
                      </div>
                      <p>
                        <strong className="text-brand-navy">2. Investimento</strong>
                      </p>
                      <p className="pl-4">
                        O valor total para a realização dos serviços descritos acima é de:{' '}
                        <strong>R$ {data.value || '[VALOR]'}</strong>.
                      </p>
                      <p>
                        <strong className="text-brand-navy">3. Validade e Prazos</strong>
                      </p>
                      <ul className="pl-8 list-disc space-y-2">
                        <li>Validade desta proposta: {data.date || '[VALIDADE]'}</li>
                        <li>
                          A emissão de nota fiscal, custos com impostos e encargos trabalhistas
                          estão inclusos neste valor.
                        </li>
                      </ul>
                    </div>
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
                        {isSigned && signatureData ? (
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
                        {isSigned && signatureData && (
                          <div className="border-t border-black w-full mb-2"></div>
                        )}
                        <p className="font-bold text-sm">Joel Nascimento de Paula</p>
                        <p className="text-xs">Diretor Técnico - JT Obras e Manutenções LTDA</p>
                        {isSigned && (
                          <p className="text-[10px] text-green-600 mt-1 flex items-center justify-center gap-1">
                            <CheckCircle className="h-3 w-3" /> Assinado Digitalmente
                          </p>
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
