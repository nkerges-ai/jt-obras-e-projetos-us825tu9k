import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  PenTool,
  CheckCircle,
  Upload,
  Fingerprint,
  Stamp,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  PGRDocument,
  getPGRs,
  savePGRs,
  getProjects,
  Project,
  BiometricValidation,
  getCompanyAssets,
  DEFAULT_PGR_TEMPLATE,
} from '@/lib/storage'
import { BiometricCapture } from '@/components/BiometricCapture'
import { PGRForm } from './components/PGRForm'
import { PGRPreview } from './components/PGRPreview'

export default function PGREditor() {
  const { toast } = useToast()
  const navigate = useNavigate()

  const [data, setData] = useState<Partial<PGRDocument>>(() => {
    const existing = getPGRs()
    if (existing.length > 0) return existing[0]
    return { ...DEFAULT_PGR_TEMPLATE, id: `pgr_${Date.now()}` }
  })

  const [projects, setProjects] = useState<Project[]>([])

  const [isAdminSignOpen, setIsAdminSignOpen] = useState(false)
  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')
  const [tempSignature, setTempSignature] = useState<string | null>(null)
  const [isBiometricOpen, setIsBiometricOpen] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => setProjects(getProjects()), [])

  const handleSave = () => {
    const pgrs = getPGRs()
    const doc: PGRDocument = { ...(data as PGRDocument), id: data.id || `pgr_${Date.now()}` }
    const filtered = pgrs.filter((p) => p.id !== doc.id)
    savePGRs([doc, ...filtered])
    toast({
      title: 'PGR Salvo',
      description: 'O Programa de Gerenciamento de Riscos foi salvo com sucesso.',
    })
    navigate('/admin')
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
    toast({ title: 'Documento Assinado' })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={finalizeAdminSignature}
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
            <h1 className="font-bold text-lg text-brand-navy truncate hidden md:block">
              Editor de PGR (NR-01)
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {!data.adminSignature ? (
              <>
                <Button
                  size="sm"
                  onClick={applyCompanyAsset}
                  variant="outline"
                  className="gap-2 border-brand-navy text-brand-navy hidden sm:flex"
                >
                  <Stamp className="h-4 w-4" /> Validar Oficial
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAdminSignOpen(true)}
                  className="gap-2 bg-brand-navy hidden sm:flex"
                >
                  <PenTool className="h-4 w-4" /> Assinar
                </Button>
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
              <Printer className="h-4 w-4" /> Imprimir Documento
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 print:p-0 print:w-full print:max-w-none flex flex-col lg:flex-row gap-8 items-start">
        <PGRForm data={data} setData={setData} projects={projects} />
        <div className="flex-1 flex flex-col">
          <PGRPreview data={data} />
        </div>
      </div>

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
