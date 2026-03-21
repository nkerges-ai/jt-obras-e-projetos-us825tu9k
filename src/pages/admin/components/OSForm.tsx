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
import { getProjects, Project, ServiceOrder, getPGRs } from '@/lib/storage'
import { EPI_LIST, EPC_LIST } from '@/lib/os-text'
import { RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OSFormProps {
  data: Partial<ServiceOrder>
  setData: (data: Partial<ServiceOrder>) => void
}

export function OSForm({ data, setData }: OSFormProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const { toast } = useToast()

  useEffect(() => setProjects(getProjects()), [])

  const updateP = (f: string, v: string) =>
    setData({ ...data, prestadora: { ...data.prestadora!, [f]: v } })
  const updateE = (f: string, v: string) =>
    setData({ ...data, execucao: { ...data.execucao!, [f]: v } })
  const updateA = (f: string, v: string) =>
    setData({ ...data, atividade: { ...data.atividade!, [f]: v } })
  const updateC = (f: string, v: string) =>
    setData({ ...data, compliance: { ...(data.compliance || {}), [f]: v } })

  const toggleArr = (key: 'epis' | 'epcs', item: string) => {
    const arr = data[key] || []
    setData({
      ...data,
      [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
    })
  }

  const handleSyncPGR = () => {
    const pgrs = getPGRs()
    const pgr = pgrs.find((p) => p.projectId === data.projectId)
    if (pgr) {
      const riscosText = pgr.riscos
        .map((r) => `> PERIGO: ${r.perigo}\n  MEDIDA: ${r.medidas}`)
        .join('\n\n')
      setData({
        ...data,
        atividade: {
          ...data.atividade!,
          descricao:
            (data.atividade?.descricao || '') + '\n\n=== RISCOS MAPEADOS (PGR) ===\n' + riscosText,
        },
      })
      toast({ title: 'Sincronização Concluída', description: 'Dados do PGR importados para a OS.' })
    } else {
      toast({
        title: 'PGR não encontrado',
        description: 'Nenhum PGR cadastrado para esta obra.',
        variant: 'destructive',
      })
    }
  }

  const isFinalizado = data.status === 'Finalizado'

  return (
    <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 print:hidden">
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-5 lg:max-h-[80vh] lg:overflow-y-auto">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="font-bold text-lg text-brand-navy">Preenchimento da OS</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncPGR}
            className="gap-1 h-7 text-xs bg-blue-50 text-blue-700 border-blue-200"
          >
            <RefreshCw className="h-3 w-3" /> Sync PGR
          </Button>
        </div>

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

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">Dados da Prestadora</Label>
          <Input
            disabled={isFinalizado}
            placeholder="[Nome do cliente/ estabelecimento]"
            value={data.prestadora?.nome}
            onChange={(e) => updateP('nome', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              disabled={isFinalizado}
              placeholder="[CNPJ]"
              value={data.prestadora?.cnpj}
              onChange={(e) => updateP('cnpj', e.target.value)}
            />
            <Input
              disabled={isFinalizado}
              placeholder="Telefone"
              value={data.prestadora?.telefone}
              onChange={(e) => updateP('telefone', e.target.value)}
            />
          </div>
          <Input
            disabled={isFinalizado}
            placeholder="Endereço Completo"
            value={data.prestadora?.endereco}
            onChange={(e) => updateP('endereco', e.target.value)}
          />
          <Input
            disabled={isFinalizado}
            placeholder="Responsável"
            value={data.prestadora?.responsavel}
            onChange={(e) => updateP('responsavel', e.target.value)}
          />
        </div>

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">Execução e Atividade</Label>
          <Input
            disabled={isFinalizado}
            placeholder="Local de Execução"
            value={data.execucao?.local}
            onChange={(e) => updateE('local', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              disabled={isFinalizado}
              type="date"
              value={data.execucao?.dataInicio}
              onChange={(e) => updateE('dataInicio', e.target.value)}
            />
            <Input
              disabled={isFinalizado}
              type="date"
              value={data.execucao?.dataFim}
              onChange={(e) => updateE('dataFim', e.target.value)}
            />
          </div>
          <Input
            disabled={isFinalizado}
            placeholder="Setor"
            value={data.atividade?.setor}
            onChange={(e) => updateA('setor', e.target.value)}
          />
          <Textarea
            disabled={isFinalizado}
            placeholder="Descrição da atividade e riscos (Pode importar do PGR)..."
            className="min-h-[120px]"
            value={data.atividade?.descricao}
            onChange={(e) => updateA('descricao', e.target.value)}
          />
        </div>

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">EPIs Obrigatórios</Label>
          {EPI_LIST.map((epi) => (
            <div key={epi} className="flex items-center space-x-2">
              <Checkbox
                disabled={isFinalizado}
                id={epi}
                checked={data.epis?.includes(epi)}
                onCheckedChange={() => toggleArr('epis', epi)}
              />
              <Label htmlFor={epi} className="text-xs font-normal leading-tight cursor-pointer">
                {epi}
              </Label>
            </div>
          ))}
        </div>

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">EPCs Obrigatórios</Label>
          {EPC_LIST.map((epc) => (
            <div key={epc} className="flex items-center space-x-2">
              <Checkbox
                disabled={isFinalizado}
                id={epc}
                checked={data.epcs?.includes(epc)}
                onCheckedChange={() => toggleArr('epcs', epc)}
              />
              <Label htmlFor={epc} className="text-xs font-normal leading-tight cursor-pointer">
                {epc}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
