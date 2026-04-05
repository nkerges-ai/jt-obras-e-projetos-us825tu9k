import { Textarea } from '@/components/ui/textarea'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      placeholder="Digite o conteúdo aqui..."
    />
  )
}
