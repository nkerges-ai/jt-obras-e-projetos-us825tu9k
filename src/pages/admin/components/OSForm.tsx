import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getProjects, Project, ServiceOrder } from '@/lib/storage'
import { EPI_LIST, EPC_LIST } from '@/lib/os-text'

interface OSFormProps {
  data: Partial<ServiceOrder>
  setData: (data: Partial<ServiceOrder>) => void
}

export function OSForm({ data, setData }: OSFormProps) {
  const [projects, setProjects] = useState<Project[]>([])
  useEffect(() => setProjects(getProjects()), [])

  const updateP = (f: string, v: string) =>
    setData({ ...data, prestadora: { ...data.prestadora!, [f]: v } })
  const updateE = (f: string, v: string) =>
    setData({ ...data, execucao: { ...data.execucao!, [f]: v } })
  const updateA = (f: string, v: string) =>
    setData({ ...data, atividade: { ...data.atividade!, [f]: v } })

  const toggleArr = (key: 'epis' | 'epcs', item: string) => {
    const arr = data[key] || []
    setData({
      ...data,
      [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
    })
  }

  return (
    <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 print:hidden">
      <div className="bg-white p-5 rounded-xl border shadow-sm space-y-5 lg:max-h-[80vh] lg:overflow-y-auto">
        <h2 className="font-bold text-lg text-brand-navy border-b pb-2">Preenchimento da OS</h2>

        <div className="space-y-2">
          <Label>Obra / Projeto Vinculado</Label>
          <Select value={data.projectId} onValueChange={(v) => setData({ ...data, projectId: v })}>
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
            placeholder="Razão Social"
            value={data.prestadora?.nome}
            onChange={(e) => updateP('nome', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="CNPJ"
              value={data.prestadora?.cnpj}
              onChange={(e) => updateP('cnpj', e.target.value)}
            />
            <Input
              placeholder="Telefone"
              value={data.prestadora?.telefone}
              onChange={(e) => updateP('telefone', e.target.value)}
            />
          </div>
          <Input
            placeholder="Endereço Completo"
            value={data.prestadora?.endereco}
            onChange={(e) => updateP('endereco', e.target.value)}
          />
          <Input
            placeholder="Nome do Responsável"
            value={data.prestadora?.responsavel}
            onChange={(e) => updateP('responsavel', e.target.value)}
          />
        </div>

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">Execução e Atividade</Label>
          <Input
            placeholder="Local / Unidade"
            value={data.execucao?.local}
            onChange={(e) => updateE('local', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={data.execucao?.dataInicio}
              onChange={(e) => updateE('dataInicio', e.target.value)}
            />
            <Input
              type="date"
              value={data.execucao?.dataFim}
              onChange={(e) => updateE('dataFim', e.target.value)}
            />
          </div>
          <Input
            placeholder="Setor da Atividade"
            value={data.atividade?.setor}
            onChange={(e) => updateA('setor', e.target.value)}
          />
          <Textarea
            placeholder="Descrição da Atividade"
            className="h-20"
            value={data.atividade?.descricao}
            onChange={(e) => updateA('descricao', e.target.value)}
          />
        </div>

        <div className="space-y-3 bg-gray-50 p-3 rounded border">
          <Label className="font-bold text-primary">EPIs Obrigatórios</Label>
          {EPI_LIST.map((epi) => (
            <div key={epi} className="flex items-center space-x-2">
              <Checkbox
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
