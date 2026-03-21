import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  getSignatures,
  saveSignatures,
  DocumentSignature,
  BiometricValidation,
} from '@/lib/storage'
import { PenTool, CheckCircle, Save, Trash2, ArrowLeft, FileText, ShieldCheck } from 'lucide-react'
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

  useEffect(() => {
    const sigs = getSignatures()
    const found = sigs.find((s) => s.id === id)
    if (found) {
      setSignatureReq(found)
      if (found.status === 'Assinado') setIsSigned(true)
    }
  }, [id])

  useEffect(() => {
    if (!isSigned && canvasRef.current && !isBiometricOpen) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isSigned, signatureReq, isBiometricOpen])

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

  const handleSaveSignature = () => {
    if (!canvasRef.current) return
    const dataUrl = canvasRef.current.toDataURL('image/png')
    setTempSignature(dataUrl)
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
      description: 'Sua assinatura e validação facial foram registradas com sucesso.',
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

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <div className="bg-brand-navy p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Assinatura de Documento Técnico</h1>
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
                  eletrônica para este documento, como profissional técnico / contratado
                  responsável.
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
                    Obrigado. Sua assinatura foi registrada e o documento já consta no acervo
                    técnico.
                  </p>
                </div>
                {signatureReq.signatureData && (
                  <div className="mt-8 border rounded p-4 bg-gray-50 max-w-xs mx-auto">
                    <p className="text-xs font-bold text-gray-500 mb-2">Sua Assinatura:</p>
                    <img
                      src={signatureReq.signatureData}
                      alt="Assinatura"
                      className="w-full mix-blend-multiply"
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
                        Identidade confirmada e vinculada ao documento.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-bold text-brand-navy flex items-center gap-2">
                    <PenTool className="h-5 w-5" /> Desenhe sua assinatura abaixo
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Use o mouse ou o dedo para assinar no quadro. Após concluir, será solicitada
                    validação facial.
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 touch-none">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={250}
                    className="w-full h-[250px] cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    variant="outline"
                    onClick={clearSignature}
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Limpar Quadro
                  </Button>
                  <Button
                    onClick={handleSaveSignature}
                    className="flex-1 bg-brand-orange hover:bg-[#cf6d18] text-white"
                  >
                    <Save className="h-4 w-4 mr-2" /> Confirmar e Validar Face
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
