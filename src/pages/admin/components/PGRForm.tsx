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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

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

  return (
    <div className="w-full lg:w-[450px] xl:w-[500px] shrink-0 space-y-6 print:hidden">
      <div className="bg-transparent lg:max-h-[85vh] lg:overflow-y-auto custom-scrollbar pr-2">
        <Accordion type="single" collapsible defaultValue="identificacao" className="w-full">
          <AccordionItem
            value="identificacao"
            className="bg-white p-5 rounded-xl border shadow-sm mb-4 border-b-0"
          >
            <AccordionTrigger className="hover:no-underline font-bold text-lg text-brand-navy pt-0">
              1. Identificação do Projeto
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Obra / Projeto Vinculado</Label>
                <Select
                  value={data.projectId}
                  onValueChange={(v) => setData({ ...data, projectId: v })}
                >
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

              <div className="space-y-3 bg-gray-50 p-3 rounded border">
                <div className="space-y-2 pb-2 border-b border-gray-200">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Autopreencher Empresa
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
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label className="text-xs">CNPJ</Label>
                    <Input
                      placeholder="00.000.000/0000-00"
                      value={data.cnpj || ''}
                      onChange={(e) => setData({ ...data, cnpj: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Data Emissão</Label>
                    <Input
                      type="date"
                      value={data.date ? new Date(data.date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setData({ ...data, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Endereço</Label>
                  <Input
                    placeholder="Endereço da sede ou obra"
                    value={data.endereco || ''}
                    onChange={(e) => setData({ ...data, endereco: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Diretor Administrativo</Label>
                  <Input
                    placeholder="Nome do Diretor"
                    value={data.diretorAdmin || ''}
                    onChange={(e) => setData({ ...data, diretorAdmin: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Responsável Técnico</Label>
                  <Input
                    placeholder="Nome do Resp. Técnico"
                    value={data.responsavelTecnico || ''}
                    onChange={(e) => setData({ ...data, responsavelTecnico: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Elaborador do PGR</Label>
                  <Input
                    placeholder="Técnico de Segurança e Registro"
                    value={data.elaborador || ''}
                    onChange={(e) => setData({ ...data, elaborador: e.target.value })}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="textos"
            className="bg-white p-5 rounded-xl border shadow-sm mb-4 border-b-0"
          >
            <AccordionTrigger className="hover:no-underline font-bold text-lg text-brand-navy pt-0">
              2. Textos do Documento
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Introdução
                </Label>
                <Textarea
                  value={data.introducao || ''}
                  onChange={(e) => setData({ ...data, introducao: e.target.value })}
                  className="min-h-[100px] text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Escopo de Aplicação
                </Label>
                <Textarea
                  value={data.escopo || ''}
                  onChange={(e) => setData({ ...data, escopo: e.target.value })}
                  className="min-h-[80px] text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Gestão de Terceiros
                </Label>
                <Textarea
                  value={data.gestaoTerceiros || ''}
                  onChange={(e) => setData({ ...data, gestaoTerceiros: e.target.value })}
                  className="min-h-[80px] text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Monitoramento e Revisão
                </Label>
                <Textarea
                  value={data.monitoramento || ''}
                  onChange={(e) => setData({ ...data, monitoramento: e.target.value })}
                  className="min-h-[80px] text-xs"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Termo de Encerramento
                </Label>
                <Textarea
                  value={data.encerramento || ''}
                  onChange={(e) => setData({ ...data, encerramento: e.target.value })}
                  className="min-h-[80px] text-xs"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="riscos"
            className="bg-white p-5 rounded-xl border shadow-sm mb-4 border-b-0"
          >
            <AccordionTrigger className="hover:no-underline font-bold text-lg text-brand-navy pt-0">
              3. Inventário de Riscos
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="space-y-4 bg-blue-50/50 p-3 rounded border border-blue-100">
                <Label className="font-bold text-blue-800 text-xs">Inclusão Rápida (NR-01)</Label>
                <Select
                  value={selectedActivityId}
                  onValueChange={(v) => {
                    setSelectedActivityId(v)
                    setSelectedRisks([])
                  }}
                >
                  <SelectTrigger className="bg-white text-xs h-8">
                    <SelectValue placeholder="Escolha uma atividade..." />
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
                          <Label
                            htmlFor={`risk-${idx}`}
                            className="font-bold text-xs cursor-pointer"
                          >
                            {r.perigo}
                          </Label>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                            Medidas: {r.medidas}
                          </p>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      className="w-full mt-2 h-8 text-xs"
                      onClick={handleAddStandardRisks}
                      disabled={selectedRisks.length === 0}
                    >
                      Integrar Riscos
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <Label className="font-bold text-primary text-xs uppercase">
                  Riscos Cadastrados
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addManualRisk}
                  className="h-7 text-xs gap-1"
                >
                  <Plus className="h-3 w-3" /> Manual
                </Button>
              </div>

              {(data.riscos || []).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 border rounded border-dashed">
                  Nenhum risco no inventário.
                </p>
              )}

              {(data.riscos || []).map((risco, idx) => (
                <div
                  key={risco.id}
                  className="p-3 border border-gray-200 bg-gray-50 rounded shadow-sm relative space-y-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[11px] font-bold text-gray-500 uppercase">Item #{idx + 1}</p>
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
                      Atividade / Fonte
                    </Label>
                    <Input
                      value={risco.atividade}
                      onChange={(e) => updateRiskFields(risco.id, { atividade: e.target.value })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">
                      Perigo / Fator
                    </Label>
                    <Input
                      value={risco.perigo}
                      onChange={(e) => updateRiskFields(risco.id, { perigo: e.target.value })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">
                      Dano Potencial
                    </Label>
                    <Input
                      value={risco.dano}
                      onChange={(e) => updateRiskFields(risco.id, { dano: e.target.value })}
                      className="h-8 text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Prob. (1-5)
                      </Label>
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
                        <SelectTrigger className="h-8 text-xs px-2 bg-white">
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
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Sev. (1-5)
                      </Label>
                      <Select
                        value={risco.severidade || ''}
                        onValueChange={(v) => {
                          const s = parseInt(v) || 0
                          const p = parseInt(risco.probabilidade || '0')
                          updateRiskFields(risco.id, {
                            severidade: v,
                            nivelRisco: getRiskLevel(p, s),
                          })
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs px-2 bg-white">
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
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-brand-navy font-bold">
                        Nível
                      </Label>
                      <div
                        className={`h-8 px-1 flex items-center justify-center rounded text-[10px] font-bold text-center border border-gray-200 ${
                          risco.nivelRisco === 'Intolerável'
                            ? 'bg-purple-700 text-white'
                            : risco.nivelRisco === 'Substancial'
                              ? 'bg-red-600 text-white'
                              : risco.nivelRisco === 'Moderado'
                                ? 'bg-orange-500 text-white'
                                : risco.nivelRisco === 'Tolerável'
                                  ? 'bg-yellow-400 text-black'
                                  : risco.nivelRisco === 'Aceitável'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-white text-gray-500'
                        }`}
                      >
                        {risco.nivelRisco || '-'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground">
                      Medidas de Controle
                    </Label>
                    <Textarea
                      value={risco.medidas}
                      onChange={(e) => updateRiskFields(risco.id, { medidas: e.target.value })}
                      className="min-h-[60px] text-xs bg-white"
                    />
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="planos"
            className="bg-white p-5 rounded-xl border shadow-sm border-b-0"
          >
            <AccordionTrigger className="hover:no-underline font-bold text-lg text-brand-orange pt-0">
              4. Plano de Ação (5W2H)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase text-muted-foreground font-bold">
                  Tarefas de Mitigação
                </Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addActionPlan}
                  className="h-7 text-xs gap-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                >
                  <Plus className="h-3 w-3" /> Nova Ação
                </Button>
              </div>
              {(data.planoAcao || []).length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4 border rounded border-dashed">
                  Nenhuma ação cadastrada.
                </p>
              )}
              {(data.planoAcao || []).map((plano, idx) => (
                <div
                  key={plano.id}
                  className="p-3 border bg-gray-50 rounded shadow-sm relative space-y-3"
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
                      Medida de Controle
                    </Label>
                    <Input
                      value={plano.what}
                      onChange={(e) => updateActionPlan(plano.id, 'what', e.target.value)}
                      className="h-8 text-xs bg-white"
                      placeholder="O que será feito?"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Responsável
                      </Label>
                      <Input
                        value={plano.who}
                        onChange={(e) => updateActionPlan(plano.id, 'who', e.target.value)}
                        className="h-8 text-xs bg-white"
                        placeholder="Quem fará?"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Prioridade
                      </Label>
                      <Select
                        value={plano.priority || 'Média'}
                        onValueChange={(v) => updateActionPlan(plano.id, 'priority', v)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-white">
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
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Prazo Fim
                      </Label>
                      <Input
                        type="date"
                        value={
                          plano.endDate ? new Date(plano.endDate).toISOString().split('T')[0] : ''
                        }
                        onChange={(e) => updateActionPlan(plano.id, 'endDate', e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground">
                        Status Atual
                      </Label>
                      <Select
                        value={plano.status}
                        onValueChange={(v) => updateActionPlan(plano.id, 'status', v)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-white">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
