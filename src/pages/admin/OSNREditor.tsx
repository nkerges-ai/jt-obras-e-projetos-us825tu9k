import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Save,
  MessageCircle,
  ScanFace,
  CheckCircle,
  PenTool,
  Upload,
  Fingerprint,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  ServiceOrder,
  getServiceOrders,
  saveServiceOrders,
  addLog,
  BiometricValidation,
} from '@/lib/storage'
import { OSForm } from './components/OSForm'
import { OSPreview } from './components/OSPreview'
import { BiometricCapture } from '@/components/BiometricCapture'

export default function OSNREditor() {
  const { toast } = useToast()
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

  // Biometric capture for Prestadora
  const [isBiometricOpen, setIsBiometricOpen] = useState(false)

  // Admin Signature State
  const [isAdminSignOpen, setIsAdminSignOpen] = useState(false)
  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')
  const [tempSignature, setTempSignature] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Secondary biometric capture for admin identity
  const [isAdminBiometricOpen, setIsAdminBiometricOpen] = useState(false)

  useEffect(() => {
    const orders = getServiceOrders()
    const nextId = String(orders.length + 1).padStart(4, '0')
    setData((prev) => ({ ...prev, osNumber: nextId }))
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
    const orders = getServiceOrders()
    const newOrder = { ...data, id: data.id || `os_${Date.now()}` } as ServiceOrder
    setData(newOrder)

    if (data.id) {
      saveServiceOrders(orders.map((o) => (o.id === data.id ? newOrder : o)))
    } else {
      saveServiceOrders([newOrder, ...orders])
    }
    toast({ title: 'Rascunho Salvo', description: 'Ordem de Serviço salva com sucesso.' })
  }

  const handlePrint = () => window.print()

  const handleWhatsApp = () => {
    addLog({
      type: 'WhatsApp',
      recipient: data.prestadora?.nome || 'Prestadora',
      message: `Link da OS NR01 ${data.osNumber} gerado e disparado via WhatsApp.`,
      status: 'Enviado',
    })
    const text = encodeURIComponent(
      `Olá! Segue a Ordem de Serviço NR01 referente às atividades acordadas.`,
    )
    window.open(`https://wa.me/5511940037545?text=${text}`, '_blank')
    toast({ title: 'Notificação', description: 'Mensagem de WhatsApp disparada com sucesso.' })
  }

  // --- Prestadora Biometric Signature ---
  const onPrestadoraBiometricCapture = (bioData: BiometricValidation) => {
    const orders = getServiceOrders()
    const updated = {
      ...data,
      id: data.id || `os_${Date.now()}`,
      status: 'Finalizado',
      biometricValidation: bioData,
    } as ServiceOrder

    setData(updated)
    if (data.id) {
      saveServiceOrders(orders.map((o) => (o.id === updated.id ? updated : o)))
    } else {
      saveServiceOrders([updated, ...orders])
    }

    setIsBiometricOpen(false)
    toast({ title: 'OS Assinada', description: 'Validação biométrica da Prestadora registrada.' })
  }

  // --- Admin Signature Methods ---
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

  const handleSaveAdminSignature = () => {
    if (signType === 'draw') {
      if (!canvasRef.current) return
      setTempSignature(canvasRef.current.toDataURL('image/png'))
    } else if (signType === 'upload') {
      if (!uploadedSign) return
      setTempSignature(uploadedSign)
    } else if (signType === 'govbr') {
      if (!govbrLink) return
      setTempSignature('govbr')
    }

    setIsAdminSignOpen(false)
    setTimeout(() => setIsAdminBiometricOpen(true), 300)
  }

  const finalizeAdminSignature = (bioData: BiometricValidation) => {
    const orders = getServiceOrders()
    const updated = {
      ...data,
      id: data.id || `os_${Date.now()}`,
      adminSignature: {
        type: signType,
        data: signType !== 'govbr' ? tempSignature! : undefined,
        link: signType === 'govbr' ? govbrLink : undefined,
        date: new Date().toLocaleString('pt-BR'),
        biometric: bioData,
      },
    } as ServiceOrder

    setData(updated)
    if (data.id) saveServiceOrders(orders.map((o) => (o.id === updated.id ? updated : o)))
    else saveServiceOrders([updated, ...orders])

    setIsAdminBiometricOpen(false)
    toast({
      title: 'Assinatura Emissora',
      description: 'Sua assinatura foi registrada com sucesso.',
    })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={onPrestadoraBiometricCapture}
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
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWhatsApp}
              className="gap-2 hidden md:flex"
            >
              <MessageCircle className="h-4 w-4 text-green-600" />{' '}
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>

            {!data.adminSignature ? (
              <Dialog open={isAdminSignOpen} onOpenChange={setIsAdminSignOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 border-brand-navy text-brand-navy"
                  >
                    <PenTool className="h-4 w-4" />{' '}
                    <span className="hidden sm:inline">Assinar (JT Obras)</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Assinatura Emissora</DialogTitle>
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
                        <Button
                          variant="ghost"
                          onClick={clearSignature}
                          className="gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" /> Limpar
                        </Button>
                      </TabsContent>
                      <TabsContent value="upload" className="space-y-4 mt-4">
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
                        <Input
                          placeholder="https://validar.iti.gov.br/..."
                          value={govbrLink}
                          onChange={(e) => setGovbrLink(e.target.value)}
                        />
                      </TabsContent>
                    </Tabs>
                    <div className="pt-4 border-t flex justify-end">
                      <Button onClick={handleSaveAdminSignature} className="gap-2 w-full sm:w-auto">
                        <Save className="h-4 w-4" /> Avançar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-blue-50 text-blue-700 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" />{' '}
                <span className="hidden sm:inline">JT Assinado</span>
              </Button>
            )}

            {!data.biometricValidation ? (
              <Button
                onClick={() => setIsBiometricOpen(true)}
                size="sm"
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <ScanFace className="h-4 w-4" />{' '}
                <span className="hidden sm:inline">Assinar (Prestadora)</span>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-green-100 text-green-700 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" />{' '}
                <span className="hidden sm:inline">Prestadora Assinado</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2 hidden md:flex"
            >
              <Save className="h-4 w-4" /> <span className="hidden sm:inline">Salvar</span>
            </Button>
            <Button onClick={handlePrint} size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 print:p-0 print:w-full print:max-w-none flex flex-col lg:flex-row gap-8 items-start">
        <OSForm data={data} setData={setData} />
        <OSPreview data={data} />
      </div>
    </div>
  )
}
