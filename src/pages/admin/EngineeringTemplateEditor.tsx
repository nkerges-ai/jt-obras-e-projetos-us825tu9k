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

interface TemplateField {
  key: string
  label: string
  example: string
  type?: 'textarea' | 'input'
}

const TEMPLATES: Record<string, { title: string; fields: TemplateField[] }> = {
  art: {
    title: 'Anotação de Responsabilidade Técnica (ART)',
    fields: [
      {
        key: 'funcao',
        label: 'Atividade Técnica / Função',
        example: 'Ex: Execução de Obra, Laudo Técnico Estrutural',
      },
      {
        key: 'descricao',
        label: 'Descrição Resumida do Serviço',
        example: 'Ex: Reforma estrutural com reforço em sapatas...',
        type: 'textarea',
      },
      { key: 'valor', label: 'Valor Declarado do Contrato (R$)', example: 'Ex: 45.000,00' },
    ],
  },
  avcb: {
    title: 'Auto de Vistoria do Corpo de Bombeiros (AVCB)',
    fields: [
      { key: 'processo', label: 'Número do Processo', example: 'Ex: 2024/98765-43' },
      { key: 'area', label: 'Área Construída (m²)', example: 'Ex: 2.500' },
      {
        key: 'caracteristicas',
        label: 'Características da Edificação',
        example: 'Ex: Galpão logístico J-2, risco médio, hidrantes...',
        type: 'textarea',
      },
    ],
  },
  pt: {
    title: 'Permissão de Trabalho (PT - NR-01)',
    fields: [
      {
        key: 'local',
        label: 'Local Exato da Atividade',
        example: 'Ex: Fachada Leste (Altura 15m)',
      },
      {
        key: 'descricao',
        label: 'Descrição da Atividade Específica',
        example: 'Ex: Manutenção na fachada com uso de balancim...',
        type: 'textarea',
      },
      {
        key: 'riscos',
        label: 'Riscos Potenciais Identificados',
        example: 'Ex: Queda de nível, choque elétrico, queda de material',
      },
      {
        key: 'epis',
        label: 'EPIs / EPCs Obrigatórios',
        example: 'Ex: Cinto paraquedista, talabarte Y, capacete, linha de vida',
      },
    ],
  },
  arpt: {
    title: 'Análise de Risco e Permissão de Trabalho (ARPT)',
    fields: [
      {
        key: 'tarefa',
        label: 'Descrição da Tarefa Crítica',
        example: 'Ex: Solda em tubulação de gás no subsolo',
      },
      {
        key: 'passos',
        label: 'Passos da Tarefa',
        example: 'Ex: 1. Inspeção / 2. Isolamento / 3. Soldagem',
        type: 'textarea',
      },
      {
        key: 'riscos',
        label: 'Riscos Potenciais',
        example: 'Ex: Explosão, Intoxicação por gás, Incêndio',
        type: 'textarea',
      },
      {
        key: 'medidas',
        label: 'Medidas de Controle Aplicadas',
        example: 'Ex: Exaustor mecânico, medidor de gases, extintor CO2',
        type: 'textarea',
      },
    ],
  },
}

export default function EngineeringTemplateEditor() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState('')
  const [isRestricted, setIsRestricted] = useState(true)
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => setProjects(getProjects()), [])

  if (!type || !TEMPLATES[type]) return <div className="p-8">Modelo não encontrado.</div>

  const config = TEMPLATES[type]
  const selectedProject = projects.find((p) => p.id === projectId)

  const handleSave = () => {
    if (!selectedProject) {
      toast({ title: 'Erro', description: 'Selecione uma obra vinculada.', variant: 'destructive' })
      return
    }
    const doc: TechnicalDocument = {
      id: `doc_${Date.now()}`,
      name: `${config.title.split(' ')[0]} - ${selectedProject.name}`,
      category: config.title.split(' ')[0],
      uploadDate: new Date().toISOString(),
      projectId: selectedProject.id,
      isRestricted: isRestricted,
      url: '#',
    }
    saveTechnicalDocuments([doc, ...getTechnicalDocuments()])
    toast({
      title: 'Documento Salvo',
      description: 'O modelo foi gerado e salvo no Acervo Técnico.',
    })
    navigate('/admin')
  }

  const handleFieldChange = (key: string, val: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }))
  }

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
              Preenchimento: {config.title}
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
                <Info className="h-4 w-4" /> Preenchimento Inteligente (NRs)
              </div>
              <p className="text-blue-700/80 leading-relaxed">
                Os dados da JT OBRAS E MANUTENÇÕES serão injetados automaticamente no documento.
                Siga os exemplos para conformidade com normas regulamentadoras.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Obra / Cliente Vinculado</Label>
              <Select value={projectId} onValueChange={setProjectId}>
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

            {config.fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    className="min-h-[80px]"
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.example}
                  />
                ) : (
                  <Input
                    value={formData[field.key] || ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.example}
                  />
                )}
                <p className="text-[10px] text-muted-foreground">{field.example}</p>
              </div>
            ))}

            <div className="flex items-center space-x-3 pt-4 border-t mt-6">
              <Switch checked={!isRestricted} onCheckedChange={(c) => setIsRestricted(!c)} />
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
                {config.title}
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
                  {config.fields.map((field) => (
                    <p key={field.key}>
                      <strong className="block mb-1">{field.label}:</strong>
                      <span className="whitespace-pre-wrap block bg-gray-50/50 p-2 rounded border border-transparent">
                        {formData[field.key] ||
                          '____________________________________________________'}
                      </span>
                    </p>
                  ))}
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
