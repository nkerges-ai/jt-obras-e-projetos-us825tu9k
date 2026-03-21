import { useState, useRef, useEffect } from 'react'
import { getCompanyAssets, saveCompanyAssets, CompanyAsset } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Trash2, Stamp, Plus, FileSignature } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export function CompanyAssetsTab() {
  const { toast } = useToast()
  const [assets, setAssets] = useState<CompanyAsset[]>([])

  const fileRef = useRef<HTMLInputElement>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<string | null>(null)

  const [newAsset, setNewAsset] = useState<Partial<CompanyAsset>>({
    type: 'signature',
    name: '',
    role: '',
  })

  useEffect(() => {
    setAssets(getCompanyAssets())
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setPendingFile(ev.target?.result as string)
        setIsDialogOpen(true)
      }
      reader.readAsDataURL(file)
    }
    // reset input
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAsset.name || !pendingFile) return
    const asset: CompanyAsset = {
      id: `ast_${Date.now()}`,
      type: newAsset.type as 'signature' | 'stamp',
      name: newAsset.name,
      role: newAsset.type === 'signature' ? newAsset.role : undefined,
      dataUrl: pendingFile,
    }
    const updated = [asset, ...assets]
    setAssets(updated)
    saveCompanyAssets(updated)
    setIsDialogOpen(false)
    setPendingFile(null)
    setNewAsset({ type: 'signature', name: '', role: '' })
    toast({
      title: 'Ativo Adicionado',
      description: 'O item foi salvo na galeria e está disponível para uso.',
    })
  }

  const handleDelete = (id: string) => {
    const updated = assets.filter((a) => a.id !== id)
    setAssets(updated)
    saveCompanyAssets(updated)
    toast({ title: 'Ativo Removido', description: 'O item foi deletado da galeria.' })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
            <Stamp className="h-5 w-5 text-primary" /> Galeria de Assinaturas e Carimbos
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie múltiplas assinaturas e carimbos para inserir rapidamente nos documentos (PGR,
            OS, Certificados).
          </p>
        </div>
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        <Button
          onClick={() => fileRef.current?.click()}
          className="gap-2 font-bold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Adicionar Imagem
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {assets.length === 0 ? (
          <div className="col-span-full border border-dashed p-12 rounded-xl text-center flex flex-col items-center justify-center bg-white shadow-sm">
            <FileSignature className="h-12 w-12 text-gray-300 mb-4" />
            <h4 className="text-lg font-bold text-gray-700 mb-2">Sua galeria está vazia</h4>
            <p className="text-sm text-gray-500 max-w-md">
              Faça o upload de imagens de assinaturas ou carimbos oficiais da empresa para
              selecioná-los durante a geração de documentos.
            </p>
            <Button onClick={() => fileRef.current?.click()} variant="outline" className="mt-6">
              <Upload className="h-4 w-4 mr-2" /> Upload de Imagem (PNG/JPG)
            </Button>
          </div>
        ) : (
          assets.map((asset) => (
            <Card key={asset.id} className="border-none shadow-sm overflow-hidden flex flex-col">
              <div className="h-36 bg-gray-50 flex items-center justify-center p-4 border-b relative group">
                <img
                  src={asset.dataUrl}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                  alt={asset.name}
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-2 backdrop-blur-[1px]">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 shadow-md"
                    onClick={() => handleDelete(asset.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h4 className="font-bold text-brand-navy truncate" title={asset.name}>
                    {asset.name}
                  </h4>
                  <Badge variant="outline" className="text-[10px] shrink-0 bg-gray-50">
                    {asset.type === 'signature' ? 'Assinatura' : 'Carimbo'}
                  </Badge>
                </div>
                {asset.role && (
                  <p className="text-xs text-muted-foreground mt-auto truncate" title={asset.role}>
                    {asset.role}
                  </p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(o) => {
          setIsDialogOpen(o)
          if (!o) setPendingFile(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Imagem na Galeria</DialogTitle>
          </DialogHeader>
          {pendingFile && (
            <form onSubmit={handleSaveAsset} className="space-y-4 pt-4">
              <div className="border p-2 rounded-lg bg-gray-50 flex items-center justify-center h-32 mb-4 shadow-inner">
                <img
                  src={pendingFile}
                  className="max-h-full max-w-full object-contain mix-blend-multiply"
                  alt="Preview"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Imagem</Label>
                <Select
                  required
                  value={newAsset.type}
                  onValueChange={(v) => setNewAsset({ ...newAsset, type: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="signature">Assinatura Digital</SelectItem>
                    <SelectItem value="stamp">Carimbo Oficial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nome ou Identificação</Label>
                <Input
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="Ex: Joel Nascimento"
                />
              </div>

              {newAsset.type === 'signature' && (
                <div className="space-y-2">
                  <Label>Cargo / Função (Opcional)</Label>
                  <Input
                    value={newAsset.role}
                    onChange={(e) => setNewAsset({ ...newAsset, role: e.target.value })}
                    placeholder="Ex: Diretor Administrativo"
                  />
                </div>
              )}

              <Button type="submit" className="w-full mt-4 h-11">
                Salvar na Galeria
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
