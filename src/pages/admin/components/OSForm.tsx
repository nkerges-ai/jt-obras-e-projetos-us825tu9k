import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getProjects,
  getContractors,
  Project,
  Contractor,
  ServiceOrder,
  getPGRs,
} from '@/lib/storage'
import { EPI_LIST, EPC_LIST } from '@/lib/os-text'
import { RefreshCw, Building2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OSFormProps {
  data: Partial<ServiceOrder>
  setData: (data: Partial<ServiceOrder>) => void
  currentStep?: number
}

export function OSForm({ data, setData, currentStep = 1 }: OSFormProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setProjects(getProjects())
    setContractors(getContractors())
  }, [])

  const updateP = (f: string, v: string) =>
    setData({ ...data, prestadora: { ...data.prestadora!, [f]: v } })
  const updateE = (f: string, v: string) =>
    setData({ ...data, execucao: { ...data.execucao!, [f]: v } })
  const updateA = (f: string, v: string) =>
    setData({ ...data, atividade: { ...data.atividade!, [f]: v } })

  const toggleArr = (key: 'epis' | 'epcs', item: string) => {
    const arr = data[key] || []
    setData({ ...data, [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item] })
  }

  const handleSyncPGR = () => {
    const pgrs = getPGRs()
    const pgr = pgrs.find((p) => p.projectId === data.projectId) || pgrs[0]
    if (pgr && pgr.riscos && pgr.riscos.length > 0) {
      const riscosText = pgr.riscos
        .map(
          (r) =>
            `> RISCO AVALIADO: ${r.perigo} (Nível: ${r.nivelRisco || 'Não definido'})\n  MEDIDA PREVENTIVA: ${r.medidas}`,
        )
        .join('\n\n')
      setData({
        ...data,
        atividade: {
          ...data.atividade!,
          descricao:
            (data.atividade?.descricao ? data.atividade.descricao + '\n\n' : '') +
            '=== RISCOS E MEDIDAS IMPORTADOS DO PGR ===\n' +
            riscosText,
        },
      })
      toast({ title: 'Sincronização Concluída', description: 'Dados do PGR (NR-01) importados.' })
    } else {
      toast({
        title: 'PGR Incompatível',
        description: 'Nenhum risco encontrado para sincronizar.',
        variant: 'destructive',
      })
    }
  }

  const handleSelectContractor = (id: string) => {
    const c = contractors.find((c) => c.id === id)
    if (c) {
      setData({
        ...data,
        prestadora: {
          ...data.prestadora,
          nome: c.name,
          cnpj: c.cnpj,
          endereco: c.address,
          responsavel: c.contact,
        },
      })
      toast({ title: 'Autopreenchimento', description: 'Dados do contratante inseridos.' })
    }
  }

  const isFinalizado = data.status === 'Finalizado'

  if (currentStep === 1) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Identificação Principal</h3>
        <div className="space-y-2">
          <Label>Obra / Projeto Vinculado</Label>
          <Select
            disabled={isFinalizado}
            value={data.projectId}
            onValueChange={(v) => setData({ ...data, projectId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um contrato..." />
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
        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="space-y-2 pb-3 border-b border-gray-200">
            <Label className="text-xs text-brand-navy font-bold flex items-center gap-1">
              <Building2 className="h-4 w-4" /> Autopreencher com Banco de Dados
            </Label>
            <Select disabled={isFinalizado} onValueChange={handleSelectContractor}>
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
            <Label>Nome do Estabelecimento / Prestadora</Label>
            <Input
              disabled={isFinalizado}
              value={data.prestadora?.nome}
              onChange={(e) => updateP('nome', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                disabled={isFinalizado}
                value={data.prestadora?.cnpj}
                onChange={(e) => updateP('cnpj', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                disabled={isFinalizado}
                value={data.prestadora?.telefone}
                onChange={(e) => updateP('telefone', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Endereço Completo</Label>
            <Input
              disabled={isFinalizado}
              value={data.prestadora?.endereco}
              onChange={(e) => updateP('endereco', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Responsável Local</Label>
            <Input
              disabled={isFinalizado}
              value={data.prestadora?.responsavel}
              onChange={(e) => updateP('responsavel', e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 2) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-lg text-brand-navy">Execução e Atividade</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncPGR}
            className="gap-1 h-8 text-xs bg-brand-light/10 text-brand-navy border-brand-light/20 hover:bg-brand-light/20"
          >
            <RefreshCw className="h-3 w-3" /> Importar PGR
          </Button>
        </div>
        <div className="space-y-2">
          <Label>Local Exato de Execução</Label>
          <Input
            disabled={isFinalizado}
            value={data.execucao?.local}
            onChange={(e) => updateE('local', e.target.value)}
            placeholder="Ex: Fachada Sul, Casa de Máquinas..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data de Início Prevista</Label>
            <Input
              disabled={isFinalizado}
              type="date"
              value={data.execucao?.dataInicio}
              onChange={(e) => updateE('dataInicio', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Data de Fim Prevista</Label>
            <Input
              disabled={isFinalizado}
              type="date"
              value={data.execucao?.dataFim}
              onChange={(e) => updateE('dataFim', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Setor de Atuação</Label>
          <Input
            disabled={isFinalizado}
            value={data.atividade?.setor}
            onChange={(e) => updateA('setor', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Descrição Detalhada e Riscos Inerentes</Label>
          <Textarea
            disabled={isFinalizado}
            className="min-h-[180px]"
            value={data.atividade?.descricao}
            onChange={(e) => updateA('descricao', e.target.value)}
            placeholder="Descreva a atividade, equipamentos utilizados e os riscos identificados no PGR..."
          />
        </div>
      </div>
    )
  }

  if (currentStep === 3) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">
          Definição de EPIs e EPCs
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="font-bold text-brand-navy text-base">EPIs Obrigatórios</Label>
            <div className="space-y-3 mt-2">
              {EPI_LIST.map((epi) => (
                <div key={epi} className="flex items-center space-x-3">
                  <Checkbox
                    disabled={isFinalizado}
                    id={epi}
                    checked={data.epis?.includes(epi)}
                    onCheckedChange={() => toggleArr('epis', epi)}
                    className="w-5 h-5 rounded border-gray-400"
                  />
                  <Label htmlFor={epi} className="text-sm font-medium cursor-pointer leading-tight">
                    {epi}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <Label className="font-bold text-brand-navy text-base">EPCs Obrigatórios</Label>
            <div className="space-y-3 mt-2">
              {EPC_LIST.map((epc) => (
                <div key={epc} className="flex items-center space-x-3">
                  <Checkbox
                    disabled={isFinalizado}
                    id={epc}
                    checked={data.epcs?.includes(epc)}
                    onCheckedChange={() => toggleArr('epcs', epc)}
                    className="w-5 h-5 rounded border-gray-400"
                  />
                  <Label htmlFor={epc} className="text-sm font-medium cursor-pointer leading-tight">
                    {epc}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
