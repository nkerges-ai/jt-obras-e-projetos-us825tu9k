import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'
import { PGRDocument, Project } from '@/lib/storage'

interface PGRFormProps {
  data: Partial<PGRDocument>
  setData: (data: Partial<PGRDocument>) => void
  projects: Project[]
}

export function PGRForm({ data, setData, projects }: PGRFormProps) {
  const addRisk = () => {
    const newRisk = { id: `r_${Date.now()}`, atividade: '', perigo: '', dano: '', medidas: '' }
    setData({ ...data, riscos: [...(data.riscos || []), newRisk] })
  }

  const removeRisk = (id: string) => {
    setData({ ...data, riscos: (data.riscos || []).filter((r) => r.id !== id) })
  }

  const updateRisk = (id: string, field: string, value: string) => {
    setData({
      ...data,
      riscos: (data.riscos || []).map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    })
  }

  return (
    <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 space-y-6 print:hidden">
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-5 lg:max-h-[80vh] lg:overflow-y-auto">
        <h2 className="font-bold text-lg text-brand-navy border-b pb-2">Preenchimento do PGR</h2>

        <div className="space-y-2">
          <Label>Obra / Projeto Vinculado</Label>
          <Select value={data.projectId} onValueChange={(v) => setData({ ...data, projectId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um projeto..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">Identificação da Empresa</Label>
          <div className="space-y-2">
            <Label className="text-xs">Razão Social</Label>
            <Input
              placeholder="Ex: Construtora Exemplo LTDA"
              value={data.empresa || ''}
              onChange={(e) => setData({ ...data, empresa: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">CNPJ</Label>
            <Input
              placeholder="00.000.000/0000-00"
              value={data.cnpj || ''}
              onChange={(e) => setData({ ...data, cnpj: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Responsável pela Elaboração</Label>
            <Input
              placeholder="Nome do TST ou Engenheiro"
              value={data.elaborador || ''}
              onChange={(e) => setData({ ...data, elaborador: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-3 rounded border">
          <div className="flex items-center justify-between">
            <Label className="font-bold text-primary">Matriz de Riscos</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addRisk}
              className="h-7 text-xs gap-1"
            >
              <Plus className="h-3 w-3" /> Adicionar Risco
            </Button>
          </div>

          {(data.riscos || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">Nenhum risco mapeado.</p>
          )}

          {(data.riscos || []).map((risco, idx) => (
            <div
              key={risco.id}
              className="p-3 border bg-white rounded shadow-sm relative space-y-3"
            >
              <div className="absolute top-2 right-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:bg-red-50"
                  onClick={() => removeRisk(risco.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs font-bold text-gray-500 mb-2">Fator de Risco {idx + 1}</p>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Atividade / Fonte Geradora
                </Label>
                <Input
                  value={risco.atividade}
                  onChange={(e) => updateRisk(risco.id, 'atividade', e.target.value)}
                  placeholder="Ex: Trabalho em altura"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Perigo / Risco Identificado
                </Label>
                <Input
                  value={risco.perigo}
                  onChange={(e) => updateRisk(risco.id, 'perigo', e.target.value)}
                  placeholder="Ex: Queda de nível"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Dano Potencial
                </Label>
                <Input
                  value={risco.dano}
                  onChange={(e) => updateRisk(risco.id, 'dano', e.target.value)}
                  placeholder="Ex: Fraturas, óbito"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Medidas de Controle Preventivas
                </Label>
                <Textarea
                  value={risco.medidas}
                  onChange={(e) => updateRisk(risco.id, 'medidas', e.target.value)}
                  placeholder="Ex: Uso de cinto tipo paraquedista..."
                  className="min-h-[60px] text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
