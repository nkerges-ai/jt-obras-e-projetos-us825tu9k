import { Input } from '@/components/ui/input'

interface SignatureInputProps {
  value: string
  onChange: (value: string) => void
}

export function SignatureInput({ value, onChange }: SignatureInputProps) {
  return (
    <div className="space-y-2 w-full">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="URL da assinatura ou 'govbr'"
        className="w-full"
      />
      <p className="text-xs text-muted-foreground">
        Insira uma URL de imagem válida ou clique no botão "Assinatura Gov.br" no topo.
      </p>
    </div>
  )
}
