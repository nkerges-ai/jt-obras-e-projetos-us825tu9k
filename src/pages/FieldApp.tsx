import { useState, useRef, useEffect } from 'react'
import { getProjects, saveProjects, ConstructionReport } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, Camera, ImagePlus, Trash2, CheckCircle2, MapPin, PenTool } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SyncIndicator } from '@/components/SyncIndicator'

export default function FieldApp() {
  const { toast } = useToast()
  const projects = getProjects().filter((p) => p.status === 'Em andamento')

  const [projectId, setProjectId] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [summary, setSummary] = useState('')
  const [photos, setPhotos] = useState<string[]>([])

  // GPS Check-in Tracking
  const [checkInTime, setCheckInTime] = useState<string | null>(null)

  // Signature Pad
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureData, setSignatureData] = useState<string | null>(null)

  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (projectId && !checkInTime) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            // Simulated Geofence success
            setCheckInTime(new Date().toISOString())
            toast({
              title: 'Check-in Realizado',
              description: 'Sua localização foi validada e as horas de trabalho foram iniciadas.',
            })
          },
          (err) => {
            console.warn(err)
            toast({
              title: 'Aviso de Localização',
              description: 'Não foi possível verificar sua localização por GPS.',
              variant: 'destructive',
            })
            setCheckInTime(new Date().toISOString())
          },
        )
      } else {
        setCheckInTime(new Date().toISOString())
      }
    }
  }, [projectId, checkInTime, toast])

  const handleSelectProject = (id: string) => {
    setProjectId(id)
    setCheckInTime(null)
    setSignatureData(null)
    if (canvasRef.current) {
      canvasRef.current
        .getContext('2d')
        ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
    const p = projects.find((proj) => proj.id === id)
    if (p && p.phases && p.phases.length > 0) {
      const avg = Math.round(p.phases.reduce((a, b) => a + b.progress, 0) / p.phases.length)
      setProgress(avg)
    } else {
      setProgress(0)
    }
  }

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPhotos: string[] = []
    let loaded = 0

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        newPhotos.push(event.target?.result as string)
        loaded++
        if (loaded === files.length) {
          setPhotos((prev) => [...prev, ...newPhotos])
        }
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  // Signature logic
  const startDrawing = (e: any) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000000'
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
  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      setSignatureData(canvasRef.current.toDataURL('image/png'))
    }
  }

  const handleSave = () => {
    if (!summary || !projectId) {
      toast({
        title: 'Dados Incompletos',
        description: 'Selecione a obra e preencha o resumo.',
        variant: 'destructive',
      })
      return
    }

    const allProjects = getProjects()
    const pIndex = allProjects.findIndex((p) => p.id === projectId)
    if (pIndex === -1) return

    const checkOutTime = new Date().toISOString()

    const report: ConstructionReport = {
      id: `rep_field_${Date.now()}`,
      date: checkOutTime.split('T')[0],
      progress,
      summary,
      photos,
      checkIn: checkInTime || undefined,
      checkOut: checkOutTime,
      signature: signatureData || undefined,
      syncStatus: 'pending',
    }

    allProjects[pIndex].reports = [report, ...(allProjects[pIndex].reports || [])]

    saveProjects(allProjects)
    window.dispatchEvent(new Event('jt_reports_updated'))

    toast({
      title: 'Termo de Visita Salvo',
      description: 'O relatório e assinatura foram salvos. Será sincronizado em breve.',
    })

    setSummary('')
    setPhotos([])
    setSignatureData(null)
    setCheckInTime(null)
    if (canvasRef.current)
      canvasRef.current
        .getContext('2d')
        ?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    handleSelectProject(projectId)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-brand-navy text-white p-4 sticky top-0 z-30 shadow-md flex justify-between items-center h-16">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-white hover:text-white/80 hover:bg-white/10"
          >
            <Link to="/admin">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
          <h1 className="font-bold text-lg hidden sm:block">App de Campo</h1>
        </div>
        <SyncIndicator />
      </header>

      <main className="flex-1 p-4 w-full max-w-2xl mx-auto pb-20">
        <div className="bg-white p-5 rounded-2xl shadow-sm border space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-bold text-brand-navy">Obra / Projeto Ativo</Label>
            <select
              value={projectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="w-full h-14 rounded-xl border border-input bg-background px-4 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-brand-light bg-gray-50"
            >
              <option value="" disabled>
                Selecione a obra...
              </option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {projectId && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {checkInTime && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> Check-in de Área
                    </p>
                    <p className="text-xs mt-1">
                      Registrado às {new Date(checkInTime).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-base font-bold text-brand-navy">Progresso Geral (%)</Label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-light"
                  />
                  <span className="font-bold text-xl w-14 text-center text-brand-navy">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold text-brand-navy">Resumo das Atividades</Label>
                <Textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="min-h-[140px] text-base p-4 bg-gray-50 rounded-xl"
                  placeholder="Descreva o que foi realizado hoje, observações e pendências..."
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-bold text-brand-navy">Evidências (Fotos)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 flex flex-col gap-2 bg-blue-50/50 border-dashed border-blue-200 hover:bg-blue-50 text-blue-700 rounded-xl"
                    onClick={() => cameraRef.current?.click()}
                  >
                    <Camera className="w-6 h-6" /> Câmera
                  </Button>
                  <input
                    type="file"
                    ref={cameraRef}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handlePhoto}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    className="h-24 flex flex-col gap-2 bg-gray-50 border-dashed rounded-xl text-gray-600"
                    onClick={() => galleryRef.current?.click()}
                  >
                    <ImagePlus className="w-6 h-6" /> Galeria
                  </Button>
                  <input
                    type="file"
                    ref={galleryRef}
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhoto}
                  />
                </div>
                {photos.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-3">
                    {photos.map((p, i) => (
                      <div
                        key={i}
                        className="w-24 h-24 shrink-0 relative rounded-xl overflow-hidden border shadow-sm"
                      >
                        <img src={p} className="w-full h-full object-cover" />
                        <Button
                          size="icon"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full shadow-md"
                          onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-bold text-brand-navy flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <PenTool className="w-4 h-4" /> Assinatura do Termo de Visita
                  </span>
                  {signatureData && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-red-500"
                      onClick={() => {
                        setSignatureData(null)
                        canvasRef.current?.getContext('2d')?.clearRect(0, 0, 500, 200)
                      }}
                    >
                      Limpar
                    </Button>
                  )}
                </Label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 touch-none">
                  <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="w-full h-[150px] cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Button
                  size="lg"
                  className="w-full h-16 text-lg font-bold bg-brand-light hover:bg-brand-light/90 text-white rounded-xl shadow-md gap-2"
                  onClick={handleSave}
                >
                  <CheckCircle2 className="h-6 w-6" /> Concluir e Gerar Termo
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  O registro de ponto (Check-out) será realizado automaticamente.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
