import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Building2 } from 'lucide-react'
import { PGRDocument, Project, Contractor, getContractors } from '@/lib/storage'
import { STANDARD_ACTIVITIES } from '@/lib/pgr-data'
import { useToast } from '@/hooks/use-toast'

interface PGRFormProps {
  data: Partial<PGRDocument>
  setData: (data: Partial<PGRDocument>) => void
  projects: Project[]
}

export function PGRForm({ data, setData, projects }: PGRFormProps) {
  const { toast } = useToast()
  const [selectedActivityId, setSelectedActivityId] = useState<string>('')
  const [selectedRisks, setSelectedRisks] = useState<number[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])

  useEffect(() => setContractors(getContractors()), [])

  const currentActivity = STANDARD_ACTIVITIES.find((a) => a.id === selectedActivityId)

  const handleAddStandardRisks = () => {
    if (!currentActivity || selectedRisks.length === 0) return
    const risksToAdd = currentActivity.risks
      .filter((_, i) => selectedRisks.includes(i))
      .map((r, i) => ({
        id: `r_${Date.now()}_${i}`,
        atividade: currentActivity.name,
        perigo: r.perigo,
        dano: r.dano,
        probabilidade: r.probabilidade,
        severidade: r.severidade,
        nivelRisco: r.nivelRisco,
        medidas: r.medidas,
      }))
    setData({ ...data, riscos: [...(data.riscos || []), ...risksToAdd] })
    setSelectedActivityId('')
    setSelectedRisks([])
    toast({ title: 'Riscos Adicionados', description: 'Matriz de riscos atualizada.' })
  }

  const handleSelectContractor = (id: string) => {
    const c = contractors.find((c) => c.id === id)
    if (c) {
      setData({ ...data, empresa: c.name, cnpj: c.cnpj })
      toast({ title: 'Autopreenchimento', description: 'Dados da empresa inseridos.' })
    }
  }

  const addManualRisk = () =>
    setData({
      ...data,
      riscos: [
        ...(data.riscos || []),
        { id: `r_${Date.now()}`, atividade: '', perigo: '', dano: '', medidas: '' },
      ],
    })
  const removeRisk = (id: string) =>
    setData({ ...data, riscos: (data.riscos || []).filter((r) => r.id !== id) })
  const updateRisk = (id: string, field: string, value: string) =>
    setData({
      ...data,
      riscos: (data.riscos || []).map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    })

  const addActionPlan = () =>
    setData({
      ...data,
      planoAcao: [
        ...(data.planoAcao || []),
        {
          id: `ap_${Date.now()}`,
          what: '',
          who: '',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          status: 'Pendente',
        },
      ],
    })
  const updateActionPlan = (id: string, field: string, value: string) =>
    setData({
      ...data,
      planoAcao: (data.planoAcao || []).map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    })
  const removeActionPlan = (id: string) =>
    setData({ ...data, planoAcao: (data.planoAcao || []).filter((p) => p.id !== id) })

  return (
    <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 space-y-6 print:hidden">
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-5 lg:max-h-[85vh] lg:overflow-y-auto custom-scrollbar">
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
          <div className="flex items-center justify-between">
            <Label className="font-bold text-primary">Identificação da Empresa</Label>
          </div>
          <div className="space-y-2 pb-2 border-b border-gray-200">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Autopreencher com Cadastro
            </Label>
            <Select onValueChange={handleSelectContractor}>
              <SelectTrigger className="h-8 text-xs bg-white">
                <SelectValue placeholder="Selecionar Contratante..." />
              </SelectTrigger>
              <SelectContent>
                {contractors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Razão Social</Label>
            <Input
              placeholder="Ex: JT Obras e Manutenções LTDA"
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

        <div className="space-y-4 bg-blue-50/50 p-3 rounded border border-blue-100">
          <Label className="font-bold text-blue-800">
            Inclusão Rápida: Matriz de Riscos (NR-01)
          </Label>
          <Select
            value={selectedActivityId}
            onValueChange={(v) => {
              setSelectedActivityId(v)
              setSelectedRisks([])
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Escolha uma atividade padrão..." />
            </SelectTrigger>
            <SelectContent>
              {STANDARD_ACTIVITIES.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {currentActivity && (
            <div className="space-y-2 mt-3 bg-white p-3 rounded border text-sm">
              <p className="font-semibold text-xs text-gray-600 mb-2">
                Selecione os riscos aplicáveis à frente de serviço:
              </p>
              {currentActivity.risks.map((r, idx) => (
                <div key={idx} className="flex items-start space-x-2 bg-gray-50 p-2 rounded">
                  <Checkbox
                    id={`risk-${idx}`}
                    checked={selectedRisks.includes(idx)}
                    onCheckedChange={(c) => {
                      if (c) setSelectedRisks([...selectedRisks, idx])
                      else setSelectedRisks(selectedRisks.filter((i) => i !== idx))
                    }}
                  />
                  <div className="grid gap-0.5 leading-none">
                    <Label htmlFor={`risk-${idx}`} className="font-bold text-xs cursor-pointer">
                      {r.perigo}
                    </Label>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                      Risco {r.nivelRisco} - {r.medidas}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                className="w-full mt-2"
                onClick={handleAddStandardRisks}
                disabled={selectedRisks.length === 0}
              >
                Integrar à Matriz de Riscos
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4 bg-gray-50 p-3 rounded border">
          <div className="flex items-center justify-between">
            <Label className="font-bold text-primary">Matriz de Riscos (Personalizada)</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addManualRisk}
              className="h-7 text-xs gap-1"
            >
              <Plus className="h-3 w-3" /> Risco Manual
            </Button>
          </div>
          {(data.riscos || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Matriz de riscos vazia.
            </p>
          )}
          {(data.riscos || []).map((risco, idx) => (
            <div
              key={risco.id}
              className="p-3 border border-gray-200 bg-white rounded shadow-sm relative space-y-3"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-bold text-gray-500 uppercase">
                  Item Avaliado #{idx + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-500 hover:bg-red-50 -mt-1 -mr-1"
                  onClick={() => removeRisk(risco.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Atividade / Fonte Geradora
                </Label>
                <Input
                  value={risco.atividade}
                  onChange={(e) => updateRisk(risco.id, 'atividade', e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Perigo / Risco
                </Label>
                <Input
                  value={risco.perigo}
                  onChange={(e) => updateRisk(risco.id, 'perigo', e.target.value)}
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
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">Prob.</Label>
                  <Select
                    value={risco.probabilidade || ''}
                    onValueChange={(v) => updateRisk(risco.id, 'probabilidade', v)}
                  >
                    <SelectTrigger className="h-8 text-xs px-2">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">Sev.</Label>
                  <Select
                    value={risco.severidade || ''}
                    onValueChange={(v) => updateRisk(risco.id, 'severidade', v)}
                  >
                    <SelectTrigger className="h-8 text-xs px-2">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-brand-navy font-bold">Nível</Label>
                  <Select
                    value={risco.nivelRisco || ''}
                    onValueChange={(v) => updateRisk(risco.id, 'nivelRisco', v)}
                  >
                    <SelectTrigger className="h-8 text-xs px-2 font-semibold">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixo">Baixo</SelectItem>
                      <SelectItem value="Médio">Médio</SelectItem>
                      <SelectItem value="Alto">Alto</SelectItem>
                      <SelectItem value="Crítico">Crítico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Medidas de Controle Preventivas
                </Label>
                <Textarea
                  value={risco.medidas}
                  onChange={(e) => updateRisk(risco.id, 'medidas', e.target.value)}
                  className="min-h-[60px] text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 bg-orange-50/50 p-3 rounded border border-orange-100">
          <div className="flex items-center justify-between">
            <Label className="font-bold text-brand-orange">Planos de Ação (Mitigação)</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={addActionPlan}
              className="h-7 text-xs gap-1 border-orange-200 text-orange-700 bg-white hover:bg-orange-50"
            >
              <Plus className="h-3 w-3" /> Nova Ação
            </Button>
          </div>
          {(data.planoAcao || []).length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              Nenhuma ação cadastrada.
            </p>
          )}
          {(data.planoAcao || []).map((plano, idx) => (
            <div
              key={plano.id}
              className="p-3 border bg-white rounded shadow-sm relative space-y-3"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 text-red-500"
                onClick={() => removeActionPlan(plano.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="space-y-1 pr-6">
                <Label className="text-[10px] uppercase text-muted-foreground">
                  Ação a ser executada
                </Label>
                <Input
                  value={plano.what}
                  onChange={(e) => updateActionPlan(plano.id, 'what', e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Ex: Treinamento NR-35"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">Responsável</Label>
                <Input
                  value={plano.who}
                  onChange={(e) => updateActionPlan(plano.id, 'who', e.target.value)}
                  className="h-8 text-sm"
                  placeholder="Nome ou Cargo"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">Data Início</Label>
                  <Input
                    type="date"
                    value={
                      plano.startDate ? new Date(plano.startDate).toISOString().split('T')[0] : ''
                    }
                    onChange={(e) => updateActionPlan(plano.id, 'startDate', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground">
                    Data Fim / Prazo
                  </Label>
                  <Input
                    type="date"
                    value={plano.endDate ? new Date(plano.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateActionPlan(plano.id, 'endDate', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground">Status Atual</Label>
                <Select
                  value={plano.status}
                  onValueChange={(v) => updateActionPlan(plano.id, 'status', v)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
