import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Camera, ScanFace, XCircle } from 'lucide-react'
import { BiometricValidation } from '@/lib/storage'

interface BiometricCaptureProps {
  open: boolean
  onCapture: (data: BiometricValidation) => void
  onCancel: () => void
}

export function BiometricCapture({ open, onCapture, onCancel }: BiometricCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState(false)

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  useEffect(() => {
    if (open) {
      setError(false)
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((s) => {
          setStream(s)
          if (videoRef.current) videoRef.current.srcObject = s
        })
        .catch(() => setError(true))
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [open, stopCamera])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && !error) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240)
        const imageUrl = canvasRef.current.toDataURL('image/jpeg', 0.8)
        stopCamera()
        onCapture({
          imageUrl,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        })
      }
    } else {
      // Mock validation if camera fails (for testing environments)
      onCapture({
        imageUrl: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=1',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <ScanFace className="w-5 h-5 text-primary" /> Validação Biométrica
          </DialogTitle>
          <DialogDescription>
            Posicione seu rosto na câmera para registrar sua assinatura com segurança e
            autenticidade.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center my-4 mx-auto w-full max-w-[320px]">
          {error ? (
            <div className="text-white text-sm px-4 text-center">
              Câmera indisponível.
              <br />
              Clique em "Capturar" para simular a validação.
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
          )}
          <canvas ref={canvasRef} width={320} height={240} className="hidden" />
        </div>

        <div className="flex justify-center gap-4 mt-2">
          <Button variant="outline" onClick={onCancel} className="gap-2">
            <XCircle className="w-4 h-4" /> Cancelar
          </Button>
          <Button
            onClick={handleCapture}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Camera className="w-4 h-4" /> Capturar Identidade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
