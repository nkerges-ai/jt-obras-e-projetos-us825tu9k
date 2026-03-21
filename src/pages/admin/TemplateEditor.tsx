import { useState, useRef, useEffect } from 'react'
import { Navigate, useParams, Link, useNavigate } from 'react-router-dom'
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
} from '@/components/ui/dialog'
import {
  ArrowLeft,
  Printer,
  PenTool,
  CheckCircle,
  Upload,
  Fingerprint,
  Stamp,
  Building2,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { BiometricValidation, getCompanyAssets, getContractors, Contractor } from '@/lib/storage'
import { BiometricCapture } from '@/components/BiometricCapture'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { WizardStepper } from '@/components/WizardStepper'

const COMPANY_NAME = 'JT OBRAS E MANUTENÇÕES LTDA'

export default function TemplateEditor() {
  const { type } = useParams<{ type: string }>()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [contractors, setContractors] = useState<Contractor[]>([])
  const [step, setStep] = useState(1)

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

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const [siteImages, setSiteImages] = useState<string[]>([])
  const siteImagesRef = useRef<HTMLInputElement>(null)

  const isAuth = sessionStorage.getItem('admin_auth') === 'true'

  const [data, setData] = useState({
    clientName: '',
    document: '',
    address: '',
    description: '',
    value: '',
    date: '',
    freeContent: '', // For 'timbrado' type
  })

  useEffect(() => {
    setContractors(getContractors())
  }, [])

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
  if (type !== 'contrato' && type !== 'orcamento' && type !== 'timbrado')
    return <Navigate to="/admin" />

  const isContrato = type === 'contrato'
  const isTimbrado = type === 'timbrado'

  const title = isContrato
    ? 'Contrato de Prestação de Serviços'
    : isTimbrado
      ? 'Documento Oficial'
      : 'Proposta Comercial'

  const wizardSteps = isTimbrado
    ? ['Dados Iniciais', 'Conteúdo Livre', 'Revisão e Geração']
    : ['Seleção do Cliente', 'Dados Específicos', 'Imagens/Anexos', 'Revisão e Geração']

  const handlePrint = () => window.print()

  const applyCompanyAsset = () => {
    const assets = getCompanyAssets()
    const asset =
      assets.find((a) => a.type === 'signature') || assets.find((a) => a.type === 'stamp')
    if (asset) {
      setSignatureData(asset.dataUrl)
      setFinalSignatureType('upload')
      setSignatureDate(new Date().toLocaleString('pt-BR'))
      setIsSigned(true)
      toast({ title: 'Validação Aplicada', description: 'Ativo oficial da empresa inserido.' })
    } else {
      toast({
        title: 'Não Encontrado',
        description: 'Nenhum ativo configurado.',
        variant: 'destructive',
      })
    }
  }

  const handleSelectContractor = (id: string) => {
    const c = contractors.find((c) => c.id === id)
    if (c) {
      setData({ ...data, clientName: c.name, document: c.cnpj, address: c.address })
      toast({ title: 'Autopreenchimento', description: 'Dados do contratante inseridos.' })
    }
  }

  // Drawing logic
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

  const handleSiteImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (ev) => setSiteImages((prev) => [...prev, ev.target?.result as string])
        reader.readAsDataURL(file)
      })
      toast({ title: 'Fotos Anexadas' })
    }
  }

  const renderWizardContent = () => {
    if (isTimbrado) {
      if (step === 1) {
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg text-brand-navy border-b pb-2">
              Destinatário (Opcional)
            </h3>
            <div className="space-y-2 pb-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Autopreencher com Cadastro
              </Label>
              <Select onValueChange={handleSelectContractor}>
                <SelectTrigger className="h-10 bg-white">
                  <SelectValue placeholder="Selecionar Contratante..." />
                </SelectTrigger>
                <SelectContent>
                  {contractors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>A/C (Aos Cuidados de)</Label>
              <Input
                value={data.clientName}
                onChange={(e) => setData({ ...data, clientName: e.target.value })}
                placeholder="Nome ou Empresa"
              />
            </div>
          </div>
        )
      }
      if (step === 2) {
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg text-brand-navy border-b pb-2">
              Conteúdo do Documento
            </h3>
            <div className="space-y-2">
              <Label>Texto Livre</Label>
              <Textarea
                className="min-h-[300px] text-base"
                value={data.freeContent}
                onChange={(e) => setData({ ...data, freeContent: e.target.value })}
                placeholder="Digite o conteúdo da carta, comunicado ou relatório aqui..."
              />
            </div>
          </div>
        )
      }
    } else {
      if (step === 1) {
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Seleção do Cliente</h3>
            <div className="space-y-2 pb-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" /> Autopreencher com Cadastro
              </Label>
              <Select onValueChange={handleSelectContractor}>
                <SelectTrigger className="h-10 bg-white">
                  <SelectValue placeholder="Selecionar Contratante..." />
                </SelectTrigger>
                <SelectContent>
                  {contractors.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Nome do Cliente / Empresa</Label>
              <Input
                value={data.clientName}
                onChange={(e) => setData({ ...data, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CPF / CNPJ</Label>
              <Input
                value={data.document}
                onChange={(e) => setData({ ...data, document: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Endereço Completo</Label>
              <Input
                value={data.address}
                onChange={(e) => setData({ ...data, address: e.target.value })}
              />
            </div>
          </div>
        )
      }
      if (step === 2) {
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Dados Específicos</h3>
            <div className="space-y-2">
              <Label>Descrição dos Serviços</Label>
              <Textarea
                className="min-h-[120px]"
                value={data.description}
                onChange={(e) => setData({ ...data, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input
                  value={data.value}
                  onChange={(e) => setData({ ...data, value: e.target.value })}
                  placeholder="Ex: 15.000,00"
                />
              </div>
              <div className="space-y-2">
                <Label>{isContrato ? 'Prazo (Dias/Meses)' : 'Validade da Proposta'}</Label>
                <Input
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                  placeholder="Ex: 30 dias"
                />
              </div>
            </div>
          </div>
        )
      }
      if (step === 3) {
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg text-brand-navy border-b pb-2">
              Imagens de Referência
            </h3>
            <input
              type="file"
              ref={siteImagesRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleSiteImagesUpload}
            />
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed h-20 bg-gray-50 hover:bg-gray-100"
              onClick={() => siteImagesRef.current?.click()}
            >
              <div className="flex flex-col items-center text-muted-foreground">
                <Upload className="h-6 w-6 mb-2" />
                <span>Clique para Anexar Fotos do Local</span>
              </div>
            </Button>
            {siteImages.length > 0 && (
              <div className="flex gap-4 overflow-x-auto py-4">
                {siteImages.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 shrink-0 group shadow-sm rounded-lg">
                    <img
                      src={img}
                      alt="Anexo"
                      className="w-full h-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => setSiteImages(siteImages.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }
    }
    return null
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg text-brand-navy hidden sm:block truncate">
              Editor: {title}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {step === wizardSteps.length && (
              <>
                {!isSigned ? (
                  <>
                    <Button
                      size="sm"
                      onClick={applyCompanyAsset}
                      variant="outline"
                      className="gap-2 border-brand-navy text-brand-navy hidden sm:flex"
                    >
                      <Stamp className="h-4 w-4" /> Validar Oficial
                    </Button>
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
                          <Button onClick={handleSaveDrawing} className="w-full mt-4">
                            Avançar
                          </Button>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </>
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
                  onClick={handlePrint}
                  size="sm"
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <WizardStepper steps={wizardSteps} currentStep={step} setStep={setStep} />

      <div className="container mx-auto px-4 print:p-0 print:w-full print:max-w-none flex flex-col items-center">
        {step < wizardSteps.length && (
          <div className="w-full max-w-2xl bg-white p-8 rounded-xl border shadow-sm print:hidden min-h-[400px] flex flex-col">
            {renderWizardContent()}
            <div className="flex justify-between mt-auto pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                className="gap-2 bg-brand-light hover:bg-brand-light/90"
              >
                Avançar <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div
          className={`w-full flex justify-center ${step < wizardSteps.length ? 'hidden print:flex' : 'flex'}`}
        >
          <DocumentLetterhead title={!isTimbrado ? title : undefined}>
            <div className="text-[14px] leading-relaxed text-justify space-y-6">
              {isTimbrado ? (
                <div className="whitespace-pre-wrap font-medium">
                  {data.clientName && <p className="mb-8 font-bold">À {data.clientName}</p>}
                  {data.freeContent || '...'}
                </div>
              ) : isContrato ? (
                <>
                  <p>
                    <strong>CONTRATANTE:</strong> {data.clientName || '____________________'},
                    CPF/CNPJ: {data.document || '____________________'}.
                  </p>
                  <p>
                    <strong>CONTRATADA:</strong> {COMPANY_NAME}.
                  </p>
                  <div className="space-y-4 pt-4">
                    <p>
                      <strong>Cláusula 1ª (Objeto):</strong> O objeto deste contrato é a prestação
                      dos seguintes serviços:{' '}
                      <span className="font-medium whitespace-pre-wrap">
                        {data.description || '...'}
                      </span>
                      .
                    </p>
                    <p>
                      <strong>Cláusula 2ª (Valor):</strong> O valor total acordado para a execução é
                      de R$ {data.value || '___________'}.
                    </p>
                    <p>
                      <strong>Cláusula 3ª (Prazo):</strong> O prazo estabelecido para execução é de{' '}
                      {data.date || '___________'}.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-6 font-bold">
                    À {data.clientName || '___________________________'}
                  </p>
                  <div className="space-y-4 pt-2">
                    <p>
                      <strong>1. Escopo da Proposta Comercial:</strong>
                    </p>
                    <div className="pl-4 whitespace-pre-wrap">{data.description || '...'}</div>
                    <p>
                      <strong>2. Investimento Necessário:</strong> R$ {data.value || '___________'}.
                    </p>
                    <p>
                      <strong>3. Validade desta Proposta:</strong> {data.date || '___________'}.
                    </p>
                  </div>
                </>
              )}

              <div className="mt-20 text-center space-y-16 break-inside-avoid">
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
                        <span className="text-[10px] font-bold text-brand-navy border border-brand-navy px-2 py-1 bg-brand-light/10">
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
                    <p className="font-bold text-sm">EMISSOR</p>
                    <p className="text-xs">{COMPANY_NAME}</p>
                    {isSigned && biometricData && (
                      <p className="text-[10px] text-green-600 flex items-center gap-1 font-bold mt-1">
                        <CheckCircle className="h-3 w-3" /> Assinado
                      </p>
                    )}
                  </div>
                  {!isTimbrado && (
                    <div className="w-full sm:w-1/2 px-4 flex flex-col items-center">
                      <div className="border-t border-black mb-2 mt-16 w-full"></div>
                      <p className="font-bold text-sm">CLIENTE / CONTRATANTE</p>
                      <p className="text-xs">{data.clientName || 'Assinatura'}</p>
                    </div>
                  )}
                </div>
              </div>

              {!isTimbrado && siteImages.length > 0 && (
                <div className="mt-16 print:break-before-page pt-8">
                  <h3 className="font-bold text-lg mb-6 text-brand-navy uppercase text-center tracking-widest border-b-2 border-brand-light/20 pb-4">
                    Anexos Fotográficos
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {siteImages.map((img, i) => (
                      <div
                        key={i}
                        className="border-2 border-gray-200 p-2 h-64 flex items-center justify-center bg-gray-50 rounded shadow-sm break-inside-avoid"
                      >
                        <img
                          src={img}
                          className="max-w-full max-h-full object-contain"
                          alt={`Anexo ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DocumentLetterhead>
        </div>
      </div>
    </div>
  )
}
