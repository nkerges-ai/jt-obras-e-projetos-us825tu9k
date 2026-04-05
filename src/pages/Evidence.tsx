import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { Image as ImageIcon, Video, FileText, UploadCloud, X, CheckCircle2 } from 'lucide-react'

const REFERENCE_IMAGES = [
  {
    id: 'ref-1',
    type: 'photo',
    file: 'https://img.usecurling.com/p/800/600?q=air%20conditioner',
    description: 'Manutenção e Limpeza de Ar Condicionado (Padrão de Execução)',
    isRef: true,
  },
  {
    id: 'ref-2',
    type: 'photo',
    file: 'https://img.usecurling.com/p/800/600?q=pest%20control',
    description: 'Controle de Pragas e Monitoramento de Iscas (Padrão de Execução)',
    isRef: true,
  },
  {
    id: 'ref-3',
    type: 'photo',
    file: 'https://img.usecurling.com/p/800/600?q=scaffolding%20building',
    description: 'Trabalho em Fachada / Infraestrutura Externa (Padrão de Execução)',
    isRef: true,
  },
]

export default function Evidence() {
  const { toast } = useToast()
  const [evidences, setEvidences] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [desc, setDesc] = useState('')
  const [uploading, setUpload] = useState(false)

  const fetchEvidences = async () => {
    try {
      const records = await pb.collection('evidence').getFullList({ sort: '-created' })
      setEvidences(records)
    } catch (e) {
      console.log('No auth or unable to fetch evidence yet', e)
    }
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Galeria de Evidências</h1>
          <p className="text-slate-500 mt-1 max-w-2xl">
            Armazene e consulte fotos, vídeos e documentos relativos às obras. Utilize os modelos de
            referência como padrão de qualidade para a execução dos serviços.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-dashed border-slate-300 hover:border-[#3498db] transition-colors group">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="bg-slate-50 p-4 rounded-full group-hover:bg-blue-50 transition-colors">
            <UploadCloud className="h-10 w-10 text-slate-400 group-hover:text-[#3498db]" />
          </div>
          <div>
            <p className="font-bold text-slate-700 text-lg">
              Arraste e solte ou selecione a evidência
            </p>
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
            className="bg-[#3498db] hover:bg-[#2980b9] text-white rounded-full px-8 mt-2 shadow-md"
          >
            <label htmlFor="file" className="cursor-pointer">
              Procurar Arquivo
            </label>
          </Button>

          {file && (
            <div className="w-full max-w-xl mt-6 space-y-5 text-left animate-in fade-in slide-in-from-bottom-2 bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3 bg-white text-slate-900 px-4 py-3 rounded-lg border shadow-sm">
                <FileText className="h-5 w-5 shrink-0 text-[#3498db]" />
                <span className="flex-1 truncate font-semibold">{file.name}</span>
                <span className="text-xs text-slate-500 shrink-0 font-medium bg-slate-100 px-2 py-1 rounded">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFile(null)}
                  className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700 font-bold">
                  Descrição ou Relatório do Serviço
                </Label>
                <textarea
                  placeholder="Ex: Fotos detalhadas da instalação da infraestrutura externa do bloco B. Serviço executado conforme OS 104..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="flex min-h-[100px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3498db]"
                />
              </div>

              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-md"
              >
                {uploading ? 'Processando Upload...' : 'Confirmar Envio para a Galeria'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" /> Referências de Serviços
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {REFERENCE_IMAGES.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-green-100 group hover:shadow-md transition-shadow relative"
            >
              <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 shadow-sm">
                PADRÃO
              </div>
              <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center relative overflow-hidden">
                <img
                  src={ev.file}
                  alt={ev.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 bg-green-50/50">
                <p className="text-sm font-bold text-slate-800 leading-snug">{ev.description}</p>
                <p className="text-xs text-slate-500 mt-2">
                  Modelo oficial para registro de evidências deste serviço.
                </p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4 pt-4 border-t">Acervo do Projeto</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {evidences.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden border group hover:shadow-md transition-all hover:border-[#3498db]/30"
            >
              <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden">
                {ev.type === 'photo' ? (
                  <img
                    src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/evidence/${ev.id}/${ev.file}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={ev.description || 'Evidência'}
                  />
                ) : (
                  getIcon(ev.type)
                )}
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-[#3498db] uppercase tracking-wider mb-1.5">
                  {ev.type === 'photo' ? 'Fotografia' : ev.type === 'doc' ? 'Documento' : 'Vídeo'}
                </p>
                <p className="text-xs font-semibold text-slate-800 truncate" title={ev.file}>
                  {ev.file}
                </p>
                {ev.description && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-md border border-slate-100">
                    {ev.description}
                  </p>
                )}
              </div>
            </div>
          ))}
          {evidences.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 border-2 border-dashed rounded-xl bg-slate-50">
              Nenhuma evidência registrada neste projeto ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
