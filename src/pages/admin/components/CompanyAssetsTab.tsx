import { useState, useRef, useEffect } from 'react'
import { getCompanyAssets, saveCompanyAssets, CompanyAsset } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Trash2, Stamp, PenTool } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CompanyAssetsTab() {
  const { toast } = useToast()
  const [assets, setAssets] = useState<CompanyAsset[]>([])
  const sigRef = useRef<HTMLInputElement>(null)
  const stampRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setAssets(getCompanyAssets())
  }, [])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'signature' | 'stamp') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string
        const newAsset: CompanyAsset = {
          id: `ast_${Date.now()}`,
          type,
          name: type === 'signature' ? 'Assinatura Oficial' : 'Carimbo Oficial',
          dataUrl,
        }
        const filtered = assets.filter((a) => a.type !== type)
        const updated = [...filtered, newAsset]
        setAssets(updated)
        saveCompanyAssets(updated)
        toast({ title: 'Ativo Atualizado', description: `${newAsset.name} salvo com sucesso.` })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDelete = (id: string) => {
    const updated = assets.filter((a) => a.id !== id)
    setAssets(updated)
    saveCompanyAssets(updated)
    toast({ title: 'Ativo Removido', description: 'O item foi deletado da biblioteca.' })
  }

  const sig = assets.find((a) => a.type === 'signature')
  const stamp = assets.find((a) => a.type === 'stamp')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <Stamp className="h-5 w-5 text-primary" /> Biblioteca de Assinaturas e Carimbos
        </h3>
        <p className="text-muted-foreground text-sm">
          Armazene assinaturas e carimbos para inserir rapidamente nos documentos (PGR, OS,
          Certificados).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <PenTool className="h-5 w-5 text-blue-600" /> Assinatura Digital
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <input
              type="file"
              ref={sigRef}
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={(e) => handleUpload(e, 'signature')}
            />
            {sig ? (
              <div className="border p-4 rounded-lg relative flex flex-col items-center justify-center bg-gray-50 h-40">
                <img src={sig.dataUrl} className="max-h-full mix-blend-multiply" alt="Assinatura" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleDelete(sig.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed p-8 rounded-lg text-center flex flex-col items-center justify-center h-40 bg-gray-50">
                <p className="text-sm text-muted-foreground mb-4">
                  Nenhuma assinatura configurada.
                </p>
                <Button onClick={() => sigRef.current?.click()} variant="outline">
                  <Upload className="h-4 w-4 mr-2" /> Upload PNG/JPG
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-gray-50/50 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Stamp className="h-5 w-5 text-orange-600" /> Carimbo da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <input
              type="file"
              ref={stampRef}
              className="hidden"
              accept="image/png, image/jpeg"
              onChange={(e) => handleUpload(e, 'stamp')}
            />
            {stamp ? (
              <div className="border p-4 rounded-lg relative flex flex-col items-center justify-center bg-gray-50 h-40">
                <img src={stamp.dataUrl} className="max-h-full mix-blend-multiply" alt="Carimbo" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleDelete(stamp.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed p-8 rounded-lg text-center flex flex-col items-center justify-center h-40 bg-gray-50">
                <p className="text-sm text-muted-foreground mb-4">Nenhum carimbo configurado.</p>
                <Button onClick={() => stampRef.current?.click()} variant="outline">
                  <Upload className="h-4 w-4 mr-2" /> Upload PNG/JPG
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
