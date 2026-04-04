import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Image as ImageIcon, Video, FileText, UploadCloud, X } from 'lucide-react'

export default function Evidence() {
  const { toast } = useToast()
  const [evidences, setEvidences] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [desc, setDesc] = useState('')
  const [uploading, setUpload] = useState(false)

  const fetchEvidences = async () => {
    const records = await pb.collection('evidence').getFullList({ sort: '-created' })
    setEvidences(records)
  }
  useEffect(() => {
    fetchEvidences()
  }, [])

  const handleUpload = async () => {
    if (!file) return
    setUpload(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', desc)
    formData.append('related_id', 'global')
    const type = file.type.startsWith('image/')
      ? 'photo'
      : file.type.startsWith('video/')
        ? 'video'
        : 'doc'
    formData.append('type', type)

    try {
      await pb.collection('evidence').create(formData)
      toast({ title: 'Sucesso', description: 'Mídia / Evidência salva no acervo.' })
      fetchEvidences()
      setFile(null)
      setDesc('')
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro no upload do arquivo.',
        variant: 'destructive',
      })
    }
    setUpload(false)
  }

  const getIcon = (type: string) => {
    if (type === 'photo') return <ImageIcon className="h-10 w-10 text-blue-500" />
    if (type === 'video') return <Video className="h-10 w-10 text-green-500" />
    return <FileText className="h-10 w-10 text-orange-500" />
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Galeria de Evidências</h1>
          <p className="text-slate-500 mt-1">
            Armazene fotos, vídeos e documentos relativos às obras e treinamentos.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm max-w-3xl border-2 border-dashed border-slate-300 hover:border-[#3498db] transition-colors group">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-slate-50 p-4 rounded-full group-hover:bg-blue-50 transition-colors">
            <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-[#3498db]" />
          </div>
          <div>
            <p className="font-bold text-slate-700 text-lg">Arraste e solte o arquivo aqui</p>
            <p className="text-sm text-slate-500 mt-1">
              Formatos suportados: JPG, PNG, MP4, PDF (Máx. 50MB)
            </p>
          </div>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept="image/*,video/*,application/pdf"
          />
          <Button
            asChild
            className="bg-[#3498db] hover:bg-[#2980b9] text-white rounded-full px-8 mt-2"
          >
            <label htmlFor="file" className="cursor-pointer">
              Procurar no Computador
            </label>
          </Button>

          {file && (
            <div className="w-full max-w-md mt-6 space-y-4 text-left animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 bg-blue-50 text-blue-900 px-4 py-3 rounded-lg border border-blue-100">
                <FileText className="h-5 w-5 shrink-0" />
                <span className="flex-1 truncate font-medium">{file.name}</span>
                <span className="text-xs text-blue-500 shrink-0">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="h-6 w-6 text-blue-400 hover:text-blue-900 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-600">Descrição ou Referência da Obra</Label>
                <input
                  type="text"
                  placeholder="Ex: Fotos da instalação do EPI na obra Alpha..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold"
              >
                {uploading ? 'Fazendo Upload... Aguarde' : 'Confirmar Envio para a Galeria'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-4 border-t">
        {evidences.map((ev) => (
          <div
            key={ev.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border group hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-slate-100 flex items-center justify-center relative overflow-hidden">
              {ev.type === 'photo' ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/evidence/${ev.id}/${ev.file}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                getIcon(ev.type)
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-[#3498db] uppercase tracking-wider mb-1">
                {ev.type}
              </p>
              <p className="text-sm text-slate-700 truncate font-medium" title={ev.file}>
                {ev.file}
              </p>
              {ev.description && (
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {ev.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
