import { useState, useRef, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UploadCloud, Type, PenTool, Eraser } from 'lucide-react'

interface SignatureInputProps {
  value?: string
  onChange: (base64: string) => void
}

export function SignatureInput({ value, onChange }: SignatureInputProps) {
  const [activeTab, setActiveTab] = useState('type')
  const [typedName, setTypedName] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Type to Signature
  useEffect(() => {
    if (activeTab === 'type' && typedName) {
      const canvas = document.createElement('canvas')
      canvas.width = 600
      canvas.height = 200
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 600, 200)
        ctx.font = '64px "Brush Script MT", "Caveat", cursive, serif'
        ctx.fillStyle = '#0f172a'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(typedName, 300, 100)
        onChange(canvas.toDataURL('image/png'))
      }
    } else if (activeTab === 'type' && !typedName) {
      onChange('')
    }
  }, [typedName, activeTab, onChange])

  // Canvas Drawing
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    if (canvasRef.current) {
      onChange(canvasRef.current.toDataURL('image/png'))
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    let x, y
    if ('touches' in e) {
      x = (e.touches[0].clientX - rect.left) * scaleX
      y = (e.touches[0].clientY - rect.top) * scaleY
    } else {
      x = (e.clientX - rect.left) * scaleX
      y = (e.clientY - rect.top) * scaleY
    }

    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#0f172a'

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        ctx.beginPath()
        onChange('')
      }
    }
  }

  useEffect(() => {
    if (activeTab === 'draw') {
      setTimeout(clearCanvas, 50) // wait for render
    }
  }, [activeTab])

  // Upload Handling
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="w-full border rounded-xl overflow-hidden bg-white shadow-sm">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full grid grid-cols-3 rounded-none border-b min-h-[48px] bg-slate-50">
          <TabsTrigger
            value="type"
            className="gap-1 sm:gap-2 data-[state=active]:bg-white text-xs sm:text-sm py-3"
          >
            <Type className="h-4 w-4 hidden sm:block" /> Digitar
          </TabsTrigger>
          <TabsTrigger
            value="draw"
            className="gap-1 sm:gap-2 data-[state=active]:bg-white text-xs sm:text-sm py-3"
          >
            <PenTool className="h-4 w-4 hidden sm:block" /> Desenhar
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="gap-1 sm:gap-2 data-[state=active]:bg-white text-xs sm:text-sm py-3"
          >
            <UploadCloud className="h-4 w-4 hidden sm:block" /> Upload
          </TabsTrigger>
        </TabsList>
        <div className="p-4">
          <TabsContent value="type" className="mt-0 space-y-4">
            <div className="space-y-2">
              <Label>Digite seu nome ou rubrica</Label>
              <Input
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Ex: João da Silva"
                className="font-medium bg-slate-50 min-h-[44px]"
              />
            </div>
            {typedName && (
              <div className="mt-4 p-4 border border-dashed border-slate-300 rounded-lg bg-white flex items-center justify-center min-h-[150px]">
                <span
                  className="text-5xl text-slate-900 px-4"
                  style={{ fontFamily: '"Brush Script MT", "Caveat", cursive, serif' }}
                >
                  {typedName}
                </span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="draw" className="mt-0 space-y-4">
            <div className="space-y-2">
              <Label>Desenhe sua assinatura livremente</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg bg-white relative overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full h-[200px] touch-none cursor-crosshair bg-white"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-2 right-2 gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 shadow-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    clearCanvas()
                  }}
                >
                  <Eraser className="h-3 w-3" /> Limpar
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50 transition-colors hover:border-[#3498db]">
              <UploadCloud className="h-10 w-10 text-slate-400" />
              <div>
                <p className="font-bold text-slate-700 text-lg">
                  Envie sua assinatura digitalizada
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  PNG, JPG (Fundo transparente recomendado)
                </p>
              </div>
              <Label
                htmlFor="sig-upload-file-comp"
                className="cursor-pointer bg-[#3498db] text-white px-6 py-3 rounded-full hover:bg-[#2980b9] font-bold transition-colors flex items-center justify-center min-h-[44px]"
              >
                Procurar no Computador
              </Label>
              <input
                id="sig-upload-file-comp"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
