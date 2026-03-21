import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getSignatures,
  saveSignatures,
  DocumentSignature,
  BiometricValidation,
} from '@/lib/storage'
import {
  PenTool,
  CheckCircle,
  Save,
  Trash2,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Type,
  Upload,
  Fingerprint,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logo from '@/assets/logotipo-c129e.jpg'
import { Card, CardContent } from '@/components/ui/card'
import { BiometricCapture } from '@/components/BiometricCapture'

export default function PublicSignature() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()

  const [signatureReq, setSignatureReq] = useState<DocumentSignature | null>(null)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSigned, setIsSigned] = useState(false)

  const [isBiometricOpen, setIsBiometricOpen] = useState(false)
  const [tempSignature, setTempSignature] = useState<string | null>(null)
  const [signatureType, setSignatureType] = useState<'draw' | 'upload' | 'typed' | 'govbr'>('draw')

  // Typed Signature
  const [typedName, setTypedName] = useState('')

  // Uploaded Signature
  const [uploadedImg, setUploadedImg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const sigs = getSignatures()
    const found = sigs.find((s) => s.id === id)
    if (found) {
      setSignatureReq(found)
      if (found.status === 'Assinado') setIsSigned(true)
    }
  }, [id])

  useEffect(() => {
    if (!isSigned && canvasRef.current && !isBiometricOpen && signatureType === 'draw') {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isSigned, signatureReq, isBiometricOpen, signatureType])

  if (!signatureReq) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Solicitação não encontrada</h1>
        <p className="text-muted-foreground mb-6">O link pode estar expirado ou incorreto.</p>
        <Button asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </div>
    )
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImg(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateTypedImage = (): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 150
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f8fafc' // bg-slate-50
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = "italic 40px 'Brush Script MT', 'Times New Roman', serif"
      ctx.fillStyle = '#000000'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(typedName || 'Assinatura', canvas.width / 2, canvas.height / 2)
    }
    return canvas.toDataURL('image/png')
  }

  const generateGovbrImage = (): string => {
    const canvas = document.createElement('canvas')
    canvas.width = 500
    canvas.height = 150
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f0fdf4' // bg-green-50
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = 'bold 24px Arial'
      ctx.fillStyle = '#166534' // text-green-800
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('ASSINADO DIGITALMENTE VIA GOV.BR', canvas.width / 2, canvas.height / 2 - 15)
      ctx.font = '16px Arial'
      ctx.fillStyle = '#15803d'
      ctx.fillText(signatureReq.clientName, canvas.width / 2, canvas.height / 2 + 15)
    }
    return canvas.toDataURL('image/png')
  }

  const handlePrepareSignature = () => {
    let finalDataUrl = ''

    if (signatureType === 'draw') {
      if (!canvasRef.current) return
      finalDataUrl = canvasRef.current.toDataURL('image/png')
    } else if (signatureType === 'typed') {
      if (!typedName.trim()) {
        toast({ title: 'Atenção', description: 'Digite seu nome.', variant: 'destructive' })
        return
      }
      finalDataUrl = generateTypedImage()
    } else if (signatureType === 'upload') {
      if (!uploadedImg) {
        toast({ title: 'Atenção', description: 'Faça upload da imagem.', variant: 'destructive' })
        return
      }
      finalDataUrl = uploadedImg
    } else if (signatureType === 'govbr') {
      finalDataUrl = generateGovbrImage()
    }

    setTempSignature(finalDataUrl)
    setIsBiometricOpen(true)
  }

  const finalizeSignature = (bioData: BiometricValidation) => {
    if (!tempSignature) return

    const sigs = getSignatures()
    const updatedSigs = sigs.map((s) =>
      s.id === signatureReq.id
        ? {
            ...s,
            status: 'Assinado' as const,
            signedDate: new Date().toISOString(),
            signatureData: tempSignature,
            signatureType: signatureType,
            biometricData: bioData,
          }
        : s,
    )

    saveSignatures(updatedSigs)
    setSignatureReq(updatedSigs.find((s) => s.id === signatureReq.id) || signatureReq)
    setIsSigned(true)
    setIsBiometricOpen(false)

    toast({
      title: 'Documento Assinado!',
      description: 'Sua assinatura foi registrada com sucesso.',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={finalizeSignature}
        onCancel={() => setIsBiometricOpen(false)}
      />

      <header className="bg-white border-b shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <img src={logo} alt="JT Obras" className="h-10 object-contain" />
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Voltar
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <div className="bg-brand-navy p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Assinatura de Documento</h1>
            <p className="text-gray-300 text-sm">Portal Seguro - JT Obras e Manutenções LTDA</p>
          </div>

          <CardContent className="p-6 md:p-10">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 mb-8 flex items-start gap-4">
              <FileText className="h-8 w-8 text-blue-600 shrink-0 mt-1" />
              <div>
                <p className="text-sm text-blue-800 font-semibold mb-1">Documento Solicitado:</p>
                <p className="text-lg font-bold text-brand-navy">{signatureReq.documentName}</p>
                <p className="text-sm text-blue-700 mt-2">
                  Olá, <strong>{signatureReq.clientName}</strong>. Foi solicitada a sua assinatura
                  eletrônica para este documento.
                </p>
              </div>
            </div>

            {isSigned ? (
              <div className="text-center py-10 space-y-6">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-brand-navy">Documento Assinado!</h2>
                  <p className="text-muted-foreground mt-2">
                    Sua assinatura foi registrada e o documento já consta no acervo técnico.
                  </p>
                </div>
                {signatureReq.signatureData && (
                  <div className="mt-8 border rounded p-4 bg-gray-50 max-w-xs mx-auto">
                    <p className="text-xs font-bold text-gray-500 mb-2">Sua Assinatura:</p>
                    <img
                      src={signatureReq.signatureData}
                      alt="Assinatura"
                      className="w-full mix-blend-multiply rounded"
                    />
                    <p className="text-[10px] text-gray-400 mt-2">
                      Registrado em: {new Date(signatureReq.signedDate!).toLocaleString('pt-BR')}
                    </p>
                  </div>
                )}
                {signatureReq.biometricData && (
                  <div className="flex items-center gap-3 mt-4 border border-green-200 rounded px-4 py-3 bg-green-50 max-w-xs mx-auto justify-center">
                    <ShieldCheck className="h-8 w-8 text-green-600 shrink-0" />
                    <div className="text-left leading-tight">
                      <p className="font-bold text-green-800 text-xs">Validação Facial Ativa</p>
                      <p className="text-green-600 text-[10px] mt-0.5">
                        Identidade confirmada e vinculada.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <Tabs
                  value={signatureType}
                  onValueChange={(v) => setSignatureType(v as any)}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto mb-6">
                    <TabsTrigger value="draw" className="py-2 flex flex-col gap-1">
                      <PenTool className="h-4 w-4" /> Desenhar
                    </TabsTrigger>
                    <TabsTrigger value="typed" className="py-2 flex flex-col gap-1">
                      <Type className="h-4 w-4" /> Digitar
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="py-2 flex flex-col gap-1">
                      <Upload className="h-4 w-4" /> Imagem
                    </TabsTrigger>
                    <TabsTrigger value="govbr" className="py-2 flex flex-col gap-1 text-blue-700">
                      <Fingerprint className="h-4 w-4" /> Gov.br
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="draw" className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Use o mouse ou o dedo para assinar no quadro.
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 touch-none">
                      <canvas
                        ref={canvasRef}
                        width={500}
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
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Limpar Quadro
                    </Button>
                  </TabsContent>

                  <TabsContent value="typed" className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Digite seu nome para gerar uma assinatura estilizada.
                    </p>
                    <Input
                      placeholder="Assinar com Nome"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      className="h-14 text-xl"
                    />
                    <div className="mt-4 p-6 bg-slate-50 border rounded-lg min-h-[120px] flex items-center justify-center overflow-hidden">
                      {typedName ? (
                        <span
                          className="text-4xl text-slate-800"
                          style={{ fontFamily: "'Brush Script MT', cursive, serif" }}
                        >
                          {typedName}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">
                          Pré-visualização
                        </span>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Envie uma foto da sua assinatura (fundo branco preferencialmente).
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleFileUpload}
                      />
                      {uploadedImg ? (
                        <div className="space-y-4 flex flex-col items-center">
                          <img
                            src={uploadedImg}
                            alt="Assinatura"
                            className="max-h-32 object-contain mix-blend-multiply"
                          />
                          <Button variant="outline" onClick={() => setUploadedImg(null)}>
                            Trocar Imagem
                          </Button>
                        </div>
                      ) : (
                        <Button onClick={() => fileInputRef.current?.click()} variant="secondary">
                          <Upload className="h-4 w-4 mr-2" /> Selecionar Arquivo
                        </Button>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="govbr" className="space-y-6 text-center py-6">
                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4">
                      <Fingerprint className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Assinatura Oficial Gov.br</h3>
                    <p className="text-slate-600 max-w-sm mx-auto">
                      Assine este documento utilizando sua conta oficial do governo para máxima
                      validade jurídica.
                    </p>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 max-w-md mx-auto mt-4">
                      <strong>Nota:</strong> Em ambiente de homologação, esta ação simula a
                      autenticação Gov.br e gera um selo oficial no documento.
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="pt-6 border-t">
                  <Button
                    onClick={handlePrepareSignature}
                    size="lg"
                    className="w-full bg-brand-orange hover:bg-[#cf6d18] text-white text-lg h-14"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {signatureType === 'govbr' ? 'Autenticar com Gov.br' : 'Confirmar Assinatura'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
