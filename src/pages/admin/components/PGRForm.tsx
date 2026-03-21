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
import { PGRDocument, PGRRisk, Project, Contractor, getContractors } from '@/lib/storage'
import { STANDARD_ACTIVITIES } from '@/lib/pgr-data'
import { useToast } from '@/hooks/use-toast'

interface PGRFormProps {
  data: Partial<PGRDocument>
  setData: (data: Partial<PGRDocument>) => void
  projects: Project[]
  currentStep?: number
}

export function PGRForm({ data, setData, projects, currentStep = 1 }: PGRFormProps) {
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
      setData({ ...data, empresa: c.name, cnpj: c.cnpj, endereco: c.address })
      toast({ title: 'Autopreenchimento', description: 'Dados da empresa inseridos.' })
    }
  }

  const getRiskLevel = (p: number, s: number) => {
    const prod = p * s
    if (prod >= 20) return 'Intolerável'
    if (prod >= 15) return 'Substancial'
    if (prod >= 10) return 'Moderado'
    if (prod >= 5) return 'Tolerável'
    return 'Aceitável'
  }

  const updateRiskFields = (id: string, updates: Partial<PGRRisk>) =>
    setData({
      ...data,
      riscos: (data.riscos || []).map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })

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

  const addActionPlan = () =>
    setData({
      ...data,
      planoAcao: [
        ...(data.planoAcao || []),
        {
          id: `ap_${Date.now()}`,
          what: '',
          who: '',
          priority: 'Média',
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

  if (currentStep === 1) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">
          Identificação do Projeto
        </h3>
        <div className="space-y-2">
          <Label>Obra / Projeto Vinculado</Label>
          <Select value={data.projectId} onValueChange={(v) => setData({ ...data, projectId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um projeto..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Geral / Sem vínculo específico</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="space-y-2 pb-3 border-b border-gray-200">
            <Label className="text-xs text-brand-navy font-bold flex items-center gap-1">
              <Building2 className="h-4 w-4" /> Autopreencher Empresa Contratante
            </Label>
            <Select onValueChange={handleSelectContractor}>
              <SelectTrigger className="h-10 bg-white">
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
            <Label>Razão Social da Empresa</Label>
            <Input
              value={data.empresa || ''}
              onChange={(e) => setData({ ...data, empresa: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                value={data.cnpj || ''}
                onChange={(e) => setData({ ...data, cnpj: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Emissão Base</Label>
              <Input
                type="date"
                value={data.date ? new Date(data.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Endereço Completo</Label>
            <Input
              value={data.endereco || ''}
              onChange={(e) => setData({ ...data, endereco: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Diretor Administrativo</Label>
              <Input
                value={data.diretorAdmin || ''}
                onChange={(e) => setData({ ...data, diretorAdmin: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Responsável Técnico</Label>
              <Input
                value={data.responsavelTecnico || ''}
                onChange={(e) => setData({ ...data, responsavelTecnico: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Elaborador Técnico (Ex: TST / Eng)</Label>
            <Input
              value={data.elaborador || ''}
              onChange={(e) => setData({ ...data, elaborador: e.target.value })}
            />
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Estrutura e Textos Base</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Introdução</Label>
            <Textarea
              value={data.introducao || ''}
              onChange={(e) => setData({ ...data, introducao: e.target.value })}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Escopo de Aplicação</Label>
            <Textarea
              value={data.escopo || ''}
              onChange={(e) => setData({ ...data, escopo: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Gestão de Terceiros</Label>
            <Textarea
              value={data.gestaoTerceiros || ''}
              onChange={(e) => setData({ ...data, gestaoTerceiros: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Monitoramento e Revisão</Label>
            <Textarea
              value={data.monitoramento || ''}
              onChange={(e) => setData({ ...data, monitoramento: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Termo de Encerramento</Label>
            <Textarea
              value={data.encerramento || ''}
              onChange={(e) => setData({ ...data, encerramento: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Inventário de Riscos</h3>
        <div className="space-y-4 bg-brand-light/5 p-4 rounded-xl border border-brand-light/20">
          <Label className="font-bold text-brand-navy text-sm">Biblioteca de Riscos (NR-01)</Label>
          <Select
            value={selectedActivityId}
            onValueChange={(v) => {
              setSelectedActivityId(v)
              setSelectedRisks([])
            }}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione uma atividade padrão..." />
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
            <div className="space-y-2 mt-3 bg-white p-4 rounded-lg border shadow-sm">
              {currentActivity.risks.map((r, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-gray-50 p-3 rounded">
                  <Checkbox
                    id={`risk-${idx}`}
                    checked={selectedRisks.includes(idx)}
                    onCheckedChange={(c) => {
                      if (c) setSelectedRisks([...selectedRisks, idx])
                      else setSelectedRisks(selectedRisks.filter((i) => i !== idx))
                    }}
                    className="mt-1"
                  />
                  <div className="grid gap-1">
                    <Label htmlFor={`risk-${idx}`} className="font-bold text-sm cursor-pointer">
                      {r.perigo}
                    </Label>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      Medidas: {r.medidas}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                className="w-full mt-4 bg-brand-light hover:bg-brand-light/90"
                onClick={handleAddStandardRisks}
                disabled={selectedRisks.length === 0}
              >
                Integrar Selecionados ao Inventário
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Label className="font-bold text-brand-navy text-sm">
            Riscos Atuais ({data.riscos?.length || 0})
          </Label>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addManualRisk}
            className="gap-2 border-brand-navy text-brand-navy"
          >
            <Plus className="h-4 w-4" /> Adicionar Manual
          </Button>
        </div>

        <div className="space-y-4">
          {(data.riscos || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg border-dashed bg-gray-50">
              Inventário vazio. Adicione riscos acima.
            </p>
          )}

          {(data.riscos || []).map((risco, idx) => (
            <div
              key={risco.id}
              className="p-4 border border-gray-200 bg-white rounded-xl shadow-sm relative space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Risco #{idx + 1}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:bg-red-50"
                  onClick={() => removeRisk(risco.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Atividade / Fonte</Label>
                <Input
                  value={risco.atividade}
                  onChange={(e) => updateRiskFields(risco.id, { atividade: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Perigo / Fator</Label>
                  <Input
                    value={risco.perigo}
                    onChange={(e) => updateRiskFields(risco.id, { perigo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dano Potencial</Label>
                  <Input
                    value={risco.dano}
                    onChange={(e) => updateRiskFields(risco.id, { dano: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg border">
                <div className="space-y-2">
                  <Label className="text-xs">Probabilidade (P)</Label>
                  <Select
                    value={risco.probabilidade || ''}
                    onValueChange={(v) => {
                      const p = parseInt(v) || 0
                      const s = parseInt(risco.severidade || '0')
                      updateRiskFields(risco.id, {
                        probabilidade: v,
                        nivelRisco: getRiskLevel(p, s),
                      })
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Rara</SelectItem>
                      <SelectItem value="2">2 - Improvável</SelectItem>
                      <SelectItem value="3">3 - Possível</SelectItem>
                      <SelectItem value="4">4 - Provável</SelectItem>
                      <SelectItem value="5">5 - Frequente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Severidade (S)</Label>
                  <Select
                    value={risco.severidade || ''}
                    onValueChange={(v) => {
                      const s = parseInt(v) || 0
                      const p = parseInt(risco.probabilidade || '0')
                      updateRiskFields(risco.id, { severidade: v, nivelRisco: getRiskLevel(p, s) })
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="-" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Leve</SelectItem>
                      <SelectItem value="2">2 - Menor</SelectItem>
                      <SelectItem value="3">3 - Moderada</SelectItem>
                      <SelectItem value="4">4 - Maior</SelectItem>
                      <SelectItem value="5">5 - Severa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-brand-navy">Classificação (P x S)</Label>
                  <div
                    className={`h-10 flex items-center justify-center rounded font-bold border border-gray-200 shadow-sm text-sm ${risco.nivelRisco === 'Intolerável' ? 'bg-purple-700 text-white' : risco.nivelRisco === 'Substancial' ? 'bg-red-600 text-white' : risco.nivelRisco === 'Moderado' ? 'bg-orange-500 text-white' : risco.nivelRisco === 'Tolerável' ? 'bg-yellow-400 text-black' : risco.nivelRisco === 'Aceitável' ? 'bg-green-600 text-white' : 'bg-white text-gray-500'}`}
                  >
                    {risco.nivelRisco || 'Aguardando P/S'}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Medidas de Controle Implementadas / Propostas</Label>
                <Textarea
                  value={risco.medidas}
                  onChange={(e) => updateRiskFields(risco.id, { medidas: e.target.value })}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (currentStep === 4) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-lg text-brand-navy">Plano de Ação (5W2H)</h3>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={addActionPlan}
            className="gap-2 border-brand-light text-brand-light hover:bg-brand-light/10"
          >
            <Plus className="h-4 w-4" /> Nova Ação
          </Button>
        </div>

        <div className="space-y-4">
          {(data.planoAcao || []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8 border rounded-lg border-dashed bg-gray-50">
              Nenhuma ação cadastrada no plano de mitigação.
            </p>
          )}

          {(data.planoAcao || []).map((plano) => (
            <div
              key={plano.id}
              className="p-4 border border-gray-200 bg-white rounded-xl shadow-sm relative space-y-4"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:bg-red-50"
                onClick={() => removeActionPlan(plano.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="space-y-2 pr-10">
                <Label>Ação / Medida de Controle (O que será feito?)</Label>
                <Input
                  value={plano.what}
                  onChange={(e) => updateActionPlan(plano.id, 'what', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Responsável (Quem?)</Label>
                  <Input
                    value={plano.who}
                    onChange={(e) => updateActionPlan(plano.id, 'who', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select
                    value={plano.priority || 'Média'}
                    onValueChange={(v) => updateActionPlan(plano.id, 'priority', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prazo (Até quando?)</Label>
                  <Input
                    type="date"
                    value={plano.endDate ? new Date(plano.endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateActionPlan(plano.id, 'endDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status Atual</Label>
                  <Select
                    value={plano.status}
                    onValueChange={(v) => updateActionPlan(plano.id, 'status', v)}
                  >
                    <SelectTrigger>
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
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
