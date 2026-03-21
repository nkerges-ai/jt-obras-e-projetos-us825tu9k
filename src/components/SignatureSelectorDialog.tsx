import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CompanyAsset, getCompanyAssets } from '@/lib/storage'
import { useEffect, useState } from 'react'
import { Stamp, CheckCircle2 } from 'lucide-react'

interface SignatureSelectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (asset: CompanyAsset) => void
}

export function SignatureSelectorDialog({
  open,
  onOpenChange,
  onSelect,
}: SignatureSelectorDialogProps) {
  const [assets, setAssets] = useState<CompanyAsset[]>([])

  useEffect(() => {
    if (open) {
      setAssets(getCompanyAssets())
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-brand-navy text-xl">
            <Stamp className="h-6 w-6" />
            Galeria de Assinaturas e Carimbos
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          {assets.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-10 border border-dashed rounded-lg bg-gray-50">
              Nenhuma assinatura cadastrada na biblioteca.
              <br />
              Acesse "Assinaturas Oficiais" no painel de administração para adicionar.
            </p>
          ) : (
            assets.map((asset) => (
              <div
                key={asset.id}
                className="border rounded-lg p-3 hover:border-brand-light cursor-pointer transition-all relative group bg-white shadow-sm flex flex-col items-center text-center"
                onClick={() => {
                  onSelect(asset)
                  onOpenChange(false)
                }}
              >
                <div className="h-24 flex items-center justify-center mb-3 w-full bg-gray-50 rounded border border-gray-100 p-2">
                  <img
                    src={asset.dataUrl}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    alt={asset.name}
                  />
                </div>
                <p className="font-bold text-sm text-brand-navy truncate w-full">{asset.name}</p>
                <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                  {asset.type === 'signature' ? 'Assinatura' : 'Carimbo'}
                </p>
                {asset.role && (
                  <p className="text-xs text-gray-500 truncate w-full">{asset.role}</p>
                )}

                <div className="absolute inset-0 bg-brand-light/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg backdrop-blur-[1px]">
                  <Button
                    size="sm"
                    className="gap-2 pointer-events-none bg-brand-light text-white shadow-md"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Selecionar
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
