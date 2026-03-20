import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Project, Photo, addLog } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { ImagePlus, Share2, Eye, Copy, FileText } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ProjectGalleryTabProps {
  project: Project
  onUpdate: (updated: Project) => void
}

export function ProjectGalleryTab({ project, onUpdate }: ProjectGalleryTabProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photoType, setPhotoType] = useState<'Antes' | 'Depois'>('Depois')
  const [isUploading, setIsUploading] = useState(false)

  const publicLink = `${window.location.origin}/projeto/${project.id}/galeria`

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)

    // Convert to Base64 to store in localStorage (for demo purposes)
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64Str = event.target?.result as string
      const newPhoto: Photo = {
        id: Date.now().toString(),
        url: base64Str,
        type: photoType,
        date: new Date().toISOString(),
      }
      onUpdate({ ...project, photos: [...project.photos, newPhoto] })
      setIsUploading(false)
      toast({ title: 'Foto Adicionada', description: `Imagem classificada como "${photoType}".` })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleShare = () => {
    navigator.clipboard.writeText(publicLink)
    addLog({
      type: 'Sistema',
      recipient: project.client,
      message: `Link da galeria gerado e copiado para a área de transferência.`,
      status: 'Enviado',
    })
    toast({
      title: 'Link Copiado!',
      description: 'Você já pode colar o link no WhatsApp do cliente.',
    })
  }

  const renderGallerySection = (type: 'Antes' | 'Depois') => {
    const filtered = project.photos.filter((p) => p.type === type)
    if (filtered.length === 0) return null

    return (
      <div className="space-y-3 mb-6">
        <h4 className="font-bold text-brand-navy border-b pb-1">Fotos: {type}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="relative aspect-square rounded-lg overflow-hidden border shadow-sm group"
            >
              <img
                src={p.url}
                alt={p.type}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold">Gerenciador Visual</h3>
        <Button
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => window.open(`/admin/print/resumo/${project.id}`, '_blank')}
        >
          <FileText className="h-4 w-4" /> Exportar Resumo (PDF)
        </Button>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Share2 className="h-4 w-4 text-primary" />
        <AlertDescription className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
          <span>
            O cliente pode acompanhar a evolução da obra em tempo real através do link público.
          </span>
          <Button size="sm" onClick={handleShare} className="shrink-0 gap-2">
            <Copy className="h-4 w-4" /> Copiar Link Público
          </Button>
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4 items-end bg-secondary/20 p-4 rounded-xl border border-dashed">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-sm font-medium">Classificar nova foto como:</label>
          <Select value={photoType} onValueChange={(v: any) => setPhotoType(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Antes">Antes (Situação Inicial)</SelectItem>
              <SelectItem value="Depois">Depois (Andamento/Finalizado)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <Button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="w-full sm:w-auto gap-2"
        >
          <ImagePlus className="h-4 w-4" /> {isUploading ? 'Processando...' : 'Enviar Foto'}
        </Button>
      </div>

      <div>
        {project.photos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-xl border-dashed">
            <ImagePlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma foto adicionada à galeria.</p>
          </div>
        ) : (
          <>
            {renderGallerySection('Antes')}
            {renderGallerySection('Depois')}
          </>
        )}
      </div>
    </div>
  )
}
