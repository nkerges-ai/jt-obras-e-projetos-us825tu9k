import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  ArrowLeft,
  Printer,
  Save,
  ScanFace,
  CheckCircle,
  PenTool,
  Upload,
  Fingerprint,
  Link2,
  Stamp,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  ServiceOrder,
  getServiceOrders,
  saveServiceOrders,
  BiometricValidation,
  getCompanyAssets,
} from '@/lib/storage'
import { OSForm } from './components/OSForm'
import { OSPreview } from './components/OSPreview'
import { BiometricCapture } from '@/components/BiometricCapture'
import { WizardStepper } from '@/components/WizardStepper'

export default function OSNREditor() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const wizardSteps = ['Identificação', 'Atividade', 'EPIs e EPCs', 'Revisão e Assinatura']

  const [data, setData] = useState<Partial<ServiceOrder>>({
    osNumber: '',
    revision: '00',
    status: 'Rascunho',
    prestadora: { nome: '', cnpj: '', endereco: '', responsavel: '', telefone: '' },
    execucao: { local: '', dataInicio: '', dataFim: '' },
    atividade: { descricao: '', setor: '' },
    epis: [],
    epcs: [],
    compliance: { esocial: '', receita: '' },
  })

  const [isBiometricOpen, setIsBiometricOpen] = useState(false)
  const [isAdminSignOpen, setIsAdminSignOpen] = useState(false)
  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')
  const [tempSignature, setTempSignature] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isAdminBiometricOpen, setIsAdminBiometricOpen] = useState(false)

  useEffect(() => {
    const orders = getServiceOrders()
    const nextId = String(orders.length + 1).padStart(4, '0')
    setData((prev) => ({ ...prev, osNumber: nextId }))
  }, [])

  const handleSave = () => {
    const orders = getServiceOrders()
    const newOrder = { ...data, id: data.id || `os_${Date.now()}` } as ServiceOrder
    setData(newOrder)
    if (data.id) saveServiceOrders(orders.map((o) => (o.id === data.id ? newOrder : o)))
    else saveServiceOrders([newOrder, ...orders])
    toast({ title: 'Rascunho Salvo', description: 'Ordem de Serviço salva com sucesso.' })
  }

  const applyCompanyAsset = () => {
    const assets = getCompanyAssets()
    const asset =
      assets.find((a) => a.type === 'signature') || assets.find((a) => a.type === 'stamp')
    if (asset) {
      setData({
        ...data,
        adminSignature: {
          type: 'upload',
          data: asset.dataUrl,
          date: new Date().toLocaleString('pt-BR'),
        },
      })
      toast({ title: 'Validação Aplicada', description: 'Ativo oficial da empresa inserido.' })
    } else {
      toast({
        title: 'Não Encontrado',
        description: 'Nenhum ativo configurado na Biblioteca.',
        variant: 'destructive',
      })
    }
  }

  // Draw Logic
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
    if (signType === 'draw' && canvasRef.current)
      setTempSignature(canvasRef.current.toDataURL('image/png'))
    else if (signType === 'upload') setTempSignature(uploadedSign)
    else if (signType === 'govbr') setTempSignature('govbr')
    setIsAdminSignOpen(false)
    setTimeout(() => setIsAdminBiometricOpen(true), 300)
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
    setIsAdminBiometricOpen(false)
    toast({ title: 'Assinatura Registrada' })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={(b) => {
          setData({ ...data, biometricValidation: b, status: 'Finalizado' })
          setIsBiometricOpen(false)
        }}
        onCancel={() => setIsBiometricOpen(false)}
      />
      <BiometricCapture
        open={isAdminBiometricOpen}
        onCapture={finalizeAdminSignature}
        onCancel={() => setIsAdminBiometricOpen(false)}
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
              Ordem de Serviço (NR01)
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {step === wizardSteps.length && (
              <>
                {!data.adminSignature ? (
                  <>
                    <Button
                      size="sm"
                      onClick={applyCompanyAsset}
                      variant="outline"
                      className="gap-2 border-brand-navy text-brand-navy hidden lg:flex"
                    >
                      <Stamp className="h-4 w-4" /> Validar Oficial
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsAdminSignOpen(true)}
                      className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white hidden sm:flex"
                    >
                      <PenTool className="h-4 w-4" /> Assinar (JT)
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2 bg-green-100 text-green-700 pointer-events-none hidden sm:flex"
                  >
                    <CheckCircle className="h-4 w-4" /> JT Assinado
                  </Button>
                )}
                {!data.biometricValidation ? (
                  <Button
                    onClick={() => setIsBiometricOpen(true)}
                    size="sm"
                    className="gap-2 bg-brand-light hover:bg-brand-light/90 text-white"
                  >
                    <ScanFace className="h-4 w-4" /> Assinar (Pres.)
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-2 bg-green-100 text-green-700 pointer-events-none"
                  >
                    <CheckCircle className="h-4 w-4" /> Pres. Assinado
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
                <Button onClick={() => window.print()} size="sm" className="gap-2">
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <WizardStepper steps={wizardSteps} currentStep={step} setStep={setStep} />

      <div className="container mx-auto px-4 print:p-0 flex flex-col items-center">
        {step < wizardSteps.length && (
          <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl border shadow-sm print:hidden min-h-[450px] flex flex-col">
            <OSForm data={data} setData={setData} currentStep={step} />
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
                className="gap-2 bg-brand-light hover:bg-brand-light/90 text-white"
              >
                Avançar <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        <div
          className={`w-full flex-col justify-start print:block print:w-full ${step < wizardSteps.length ? 'hidden print:flex' : 'flex'}`}
        >
          <OSPreview data={data} />
        </div>
      </div>

      <Dialog open={isAdminSignOpen} onOpenChange={setIsAdminSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura Emissora (JT Obras)</DialogTitle>
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
            <Button
              onClick={handleSaveAdminSignature}
              className="w-full mt-4 bg-brand-navy text-white hover:bg-brand-navy/90"
            >
              Avançar para Validação
            </Button>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
