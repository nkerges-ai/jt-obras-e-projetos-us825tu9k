import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, Printer, Save, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logo from '@/assets/logotipo-c129e.jpg'
import {
  getProjects,
  Project,
  saveTechnicalDocuments,
  getTechnicalDocuments,
  TechnicalDocument,
} from '@/lib/storage'

const COMPANY = {
  name: 'JT OBRAS E MANUTENÇÕES LTDA',
  cnpj: '63.243.791/0001-09',
  address: 'Rua Tommaso Giordani, 371 vila Guacuri – SP Cep- 04.475-210',
  responsible: 'Joel Nascimento de Paula',
}

const TITLES: Record<string, string> = {
  art: 'Anotação de Responsabilidade Técnica (ART)',
  avcb: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)',
  pt: 'Permissão de Trabalho (PT)',
  arpt: 'Análise de Risco e Permissão de Trabalho (ARPT)',
}

export default function EngineeringTemplateEditor() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [projects, setProjects] = useState<Project[]>([])
  const [data, setData] = useState({
    projectId: '',
    description: '',
    field1: '',
    field2: '',
    isRestricted: true,
  })

  useEffect(() => setProjects(getProjects()), [])

  if (!type || !TITLES[type]) return <div className="p-8">Modelo não encontrado.</div>

  const selectedProject = projects.find((p) => p.id === data.projectId)

  const handleSave = () => {
    if (!selectedProject) {
      toast({ title: 'Erro', description: 'Selecione uma obra vinculada.', variant: 'destructive' })
      return
    }
    const doc: TechnicalDocument = {
      id: `doc_${Date.now()}`,
      name: `${type.toUpperCase()} - ${selectedProject.name}`,
      category: type.toUpperCase(),
      uploadDate: new Date().toISOString(),
      projectId: selectedProject.id,
      isRestricted: data.isRestricted,
      url: '#',
    }
    saveTechnicalDocuments([doc, ...getTechnicalDocuments()])
    toast({
      title: 'Documento Salvo',
      description: 'O modelo foi gerado e salvo no Acervo Técnico.',
    })
    navigate('/admin')
  }

  const getFields = () => {
    switch (type) {
      case 'art':
        return {
          descLabel: 'Descrição Resumida do Serviço',
          descEx: 'Exemplo: Reforma estrutural com reforço em sapatas e impermeabilização...',
          f1Label: 'Atividade Técnica / Função',
          f1Ex: 'Exemplo: Execução de Obra, Laudo Técnico Estrutural',
          f2Label: 'Valor Declarado do Contrato (R$)',
          f2Ex: 'Exemplo: 45.000,00',
        }
      case 'avcb':
        return {
          descLabel: 'Características da Edificação',
          descEx: 'Exemplo: Galpão logístico de classe J-2, risco médio, com hidrantes...',
          f1Label: 'Número do Processo (Bombeiros)',
          f1Ex: 'Exemplo: 2024/98765-43',
          f2Label: 'Área Construída (m²)',
          f2Ex: 'Exemplo: 2.500',
        }
      case 'pt':
        return {
          descLabel: 'Descrição da Atividade Específica',
          descEx: 'Exemplo: Manutenção na fachada leste com uso de balancim elétrico...',
          f1Label: 'Riscos Potenciais Identificados',
          f1Ex: 'Exemplo: Queda de nível, choque elétrico, queda de materiais',
          f2Label: 'EPIs e EPCs Obrigatórios',
          f2Ex: 'Exemplo: Cinto tipo paraquedista, talabarte Y, capacete com jugular',
        }
      case 'arpt':
        return {
          descLabel: 'Descrição da Tarefa Crítica',
          descEx: 'Exemplo: Solda em tubulação de gás no subsolo do edifício...',
          f1Label: 'Passos da Tarefa e Análise de Risco',
          f1Ex: 'Exemplo: 1. Inspeção (gases) / 2. Isolamento / 3. Soldagem / 4. Resfriamento',
          f2Label: 'Medidas de Controle Aplicadas',
          f2Ex: 'Exemplo: Medidor de gases contínuo, exaustor mecânico, extintor CO2',
        }
      default:
        return null
    }
  }

  const fields = getFields()

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy hidden sm:block">
              Preenchimento: {TITLES[type]}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />{' '}
              <span className="hidden sm:inline">Salvar no Acervo</span>
            </Button>
            <Button
              onClick={() => window.print()}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir PDF</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 print:p-0 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[400px] shrink-0 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
            <h2 className="font-bold text-xl mb-4 border-b pb-2 text-brand-navy">
              Dados do Documento
            </h2>

            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm mb-4">
              <div className="flex items-center gap-2 text-blue-800 font-bold mb-2">
                <Info className="h-4 w-4" /> Preenchimento Inteligente
              </div>
              <p className="text-blue-700/80 leading-relaxed">
                Os dados da JT OBRAS E MANUTENÇÕES (Sede, CNPJ e Resp. Técnico) serão injetados
                automaticamente no documento final.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Obra / Cliente Vinculado</Label>
              <Select
                value={data.projectId}
                onValueChange={(v) => setData({ ...data, projectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a obra..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {p.client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {fields && (
              <>
                <div className="space-y-2">
                  <Label>{fields.f1Label}</Label>
                  <Input
                    value={data.field1}
                    onChange={(e) => setData({ ...data, field1: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">{fields.f1Ex}</p>
                </div>
                <div className="space-y-2">
                  <Label>{fields.descLabel}</Label>
                  <Textarea
                    className="min-h-[80px]"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">{fields.descEx}</p>
                </div>
                <div className="space-y-2">
                  <Label>{fields.f2Label}</Label>
                  <Input
                    value={data.field2}
                    onChange={(e) => setData({ ...data, field2: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground">{fields.f2Ex}</p>
                </div>
              </>
            )}

            <div className="flex items-center space-x-3 pt-4 border-t mt-6">
              <Switch
                checked={!data.isRestricted}
                onCheckedChange={(c) => setData({ ...data, isRestricted: !c })}
              />
              <Label className="cursor-pointer text-sm font-semibold text-brand-navy">
                Liberar para o Cliente <br />
                <span className="text-xs text-muted-foreground font-normal">
                  Visível no Portal do Cliente
                </span>
              </Label>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center print:block print:w-full">
          <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] relative print:shadow-none print:m-0 print:p-0">
            <div className="p-[20mm] pb-0">
              <header className="border-b-2 border-brand-orange pb-6 mb-10 flex justify-between items-end">
                <img src={logo} alt="JT Obras" className="h-16 md:h-20 object-contain" />
                <div className="text-right text-xs md:text-sm text-gray-600 space-y-0.5">
                  <p className="font-bold text-brand-navy">{COMPANY.name}</p>
                  <p>CNPJ: {COMPANY.cnpj}</p>
                  <p>{COMPANY.address}</p>
                </div>
              </header>
            </div>
            <main className="px-[20mm] pb-[30mm] text-gray-800 text-[14px] leading-relaxed">
              <h2 className="text-center font-bold text-xl uppercase mb-8 tracking-widest text-brand-navy">
                {TITLES[type]}
              </h2>

              <div className="border border-gray-400 rounded p-4 mb-6">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  1. DADOS DA CONTRATADA
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <p>
                    <strong>Razão Social:</strong> {COMPANY.name}
                  </p>
                  <p>
                    <strong>CNPJ:</strong> {COMPANY.cnpj}
                  </p>
                  <p className="col-span-2">
                    <strong>Endereço Sede:</strong> {COMPANY.address}
                  </p>
                  <p className="col-span-2">
                    <strong>Responsável Técnico:</strong> {COMPANY.responsible}
                  </p>
                </div>
              </div>

              <div className="border border-gray-400 rounded p-4 mb-6">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  2. DADOS DA OBRA / CONTRATANTE
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <p>
                    <strong>Obra Vinculada:</strong>{' '}
                    {selectedProject?.name || '___________________________'}
                  </p>
                  <p>
                    <strong>Cliente:</strong>{' '}
                    {selectedProject?.client || '___________________________'}
                  </p>
                  <p className="col-span-2">
                    <strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="border border-gray-400 rounded p-4 mb-6 min-h-[200px]">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  3. DETALHES TÉCNICOS E ESPECIFICAÇÕES
                </h3>
                <div className="space-y-4 text-[13px]">
                  <p>
                    <strong className="block mb-1">{fields?.f1Label}:</strong>
                    <span className="whitespace-pre-wrap">
                      {data.field1 || '____________________________________________________'}
                    </span>
                  </p>
                  <p>
                    <strong className="block mb-1">{fields?.descLabel}:</strong>
                    <span className="whitespace-pre-wrap">
                      {data.description || '____________________________________________________'}
                    </span>
                  </p>
                  <p>
                    <strong className="block mb-1">{fields?.f2Label}:</strong>
                    <span className="whitespace-pre-wrap">
                      {type === 'art' && data.field2
                        ? `R$ ${data.field2}`
                        : data.field2 || '____________________________________________________'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-24 text-center">
                <div className="border-t border-black w-64 mx-auto mb-2"></div>
                <p className="font-bold text-sm">{COMPANY.responsible}</p>
                <p className="text-xs text-gray-500">Engenheiro / Responsável Técnico</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
