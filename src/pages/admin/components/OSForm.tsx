import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichTextEditor } from '@/components/RichTextEditor'

export function OSForm({ data, setData, currentStep }: any) {
  if (currentStep === 1) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-brand-navy">1. Identificação do Empregado</h2>
          <p className="text-sm text-muted-foreground">
            Dados básicos para a Ordem de Serviço (NR-01).
          </p>
        </div>
        <div className="space-y-3">
          <Label className="font-bold">Nome do Colaborador</Label>
          <Input
            value={data.employee?.name || ''}
            onChange={(e) =>
              setData({ ...data, employee: { ...data.employee, name: e.target.value } })
            }
            placeholder="Ex: João da Silva"
            className="h-12"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="font-bold">Função</Label>
            <Input
              value={data.employee?.role || ''}
              onChange={(e) =>
                setData({ ...data, employee: { ...data.employee, role: e.target.value } })
              }
              placeholder="Ex: Técnico de Segurança do Trabalho"
              className="h-12"
            />
          </div>
          <div className="space-y-3">
            <Label className="font-bold">Data de Emissão</Label>
            <Input
              type="date"
              value={data.employee?.date || ''}
              onChange={(e) =>
                setData({ ...data, employee: { ...data.employee, date: e.target.value } })
              }
              className="h-12"
            />
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 flex-1 flex flex-col">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl font-bold text-brand-navy">2. Instruções de Segurança</h2>
          <p className="text-sm text-muted-foreground">
            Obrigações e proibições de acordo com a NR-01 utilizando o editor de texto rico.
          </p>
        </div>
        <div className="space-y-3 flex-1 flex flex-col">
          <Label className="font-bold text-brand-navy">Cabe ao Empregado (Responsabilidades)</Label>
          <RichTextEditor
            className="flex-1"
            value={data.safetyInstructions?.responsibilities || ''}
            onChange={(val) =>
              setData({
                ...data,
                safetyInstructions: { ...data.safetyInstructions, responsibilities: val },
              })
            }
            placeholder="Digite as obrigações de segurança..."
          />
        </div>
        <div className="space-y-3 flex-1 flex flex-col mt-6">
          <Label className="font-bold text-red-600">Proibições na Execução</Label>
          <RichTextEditor
            className="flex-1 border-red-200 focus-within:ring-red-500/50"
            value={data.safetyInstructions?.prohibitions || ''}
            onChange={(val) =>
              setData({
                ...data,
                safetyInstructions: { ...data.safetyInstructions, prohibitions: val },
              })
            }
            placeholder="Digite as proibições expressas..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-16 flex flex-col items-center justify-center animate-in fade-in">
      <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm border border-green-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-brand-navy mb-2">Dados Preenchidos</h2>
      <p className="text-muted-foreground max-w-md text-sm">
        A Ordem de Serviço foi configurada. Revise o documento com a formatação aplicada na
        visualização ao lado e utilize os botões superiores para assinar, salvar no repositório ou
        imprimir o PDF.
      </p>
    </div>
  )
}
