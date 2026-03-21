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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { ArrowLeft, Printer, Save, Info, ShieldCheck, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import logo from '@/assets/logotipo-c129e.jpg'
import {
  getProjects,
  Project,
  saveTechnicalDocuments,
  getTechnicalDocuments,
  TechnicalDocument,
  DocumentSignature,
  saveSignatures,
  getSignatures,
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
        key: 'atividade',
        label: 'Atividade Técnica / Escopo',
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
      {
        key: 'medidas',
        label: 'Sistemas de Segurança Avaliados',
        example: 'Ex: Extintores, Iluminação de Emergência, Alarme de Incêndio',
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
      {
        key: 'emissor',
        label: 'Emissor da PT (Nome / Função)',
        example: 'Ex: Carlos Silva / Téc. Segurança do Trabalho',
      },
      {
        key: 'equipe',
        label: 'Equipe de Trabalho (Nomes)',
        example: 'Ex: João, José, Maria',
        type: 'textarea',
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
      {
        key: 'emissor',
        label: 'Emissor da ARPT (Nome / Função)',
        example: 'Ex: Carlos Silva / Téc. Segurança do Trabalho',
      },
      {
        key: 'equipe',
        label: 'Equipe Envolvida',
        example: 'Ex: João, José, Maria',
        type: 'textarea',
      },
    ],
  },
  osnr01: {
    title: 'Ordem de Serviço (NR-01) - Documento Simples',
    fields: [
      {
        key: 'employee',
        label: 'Dados do Colaborador / Função',
        example: 'Ex: Nome: Carlos Silva, CPF: ..., Função: Pedreiro',
      },
      {
        key: 'jobDesc',
        label: 'Descrição da Atividade',
        type: 'textarea',
        example: 'Ex: Reparos na estrutura de alvenaria e pintura.',
      },
      {
        key: 'risks',
        label: 'Riscos Identificados',
        type: 'textarea',
        example: 'Ex: Queda de mesmo nível, inalação de poeira...',
      },
      {
        key: 'preventive',
        label: 'Medidas Preventivas (EPI/EPC)',
        type: 'textarea',
        example: 'Ex: Uso de botina de segurança, máscara PFF2, isolamento da área.',
      },
      {
        key: 'legal',
        label: 'Declarações Legais',
        type: 'textarea',
        example:
          'Declaro ter recebido treinamento sobre os riscos inerentes à minha atividade e concordo em cumprir todas as normas de segurança.',
      },
    ],
  },
  treinamento: {
    title: 'Certificado de Treinamento e Integração',
    fields: [
      {
        key: 'courseTitle',
        label: 'Título do Treinamento',
        example: 'Ex: Integração de Segurança e Saúde no Trabalho',
      },
      { key: 'date', label: 'Data de Realização', example: 'Ex: 15/10/2023' },
      { key: 'duration', label: 'Carga Horária (Duração)', example: 'Ex: 4 horas' },
      {
        key: 'content',
        label: 'Conteúdo Programático',
        type: 'textarea',
        example:
          'Ex: Normas Regulamentadoras, uso correto de EPIs, procedimentos em caso de emergência.',
      },
      {
        key: 'instructor',
        label: 'Identificação do Instrutor (CREA/MTE)',
        example: 'Ex: João Silva - Téc. Segurança MTE 12345',
      },
      {
        key: 'trainee',
        label: 'Dados do Participante / Treinado',
        example: 'Ex: Nome completo, CPF, Cargo.',
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
  const [profData, setProfData] = useState({
    name: '',
    registry: '',
    document: '',
    role: '',
  })

  const [isSignDialogOpen, setIsSignDialogOpen] = useState(false)
  const [signPhone, setSignPhone] = useState('')

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

  const handleProfChange = (key: string, val: string) => {
    setProfData((prev) => ({ ...prev, [key]: val }))
  }

  const handleRequestSignature = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) {
      toast({ title: 'Erro', description: 'Selecione uma obra vinculada.', variant: 'destructive' })
      return
    }
    const id = `sig_${Date.now()}`
    const sig: DocumentSignature = {
      id,
      documentId: `doc_${Date.now()}`,
      documentName: `${config.title.split(' ')[0]} - ${selectedProject.name} (${profData.name || 'Participante'})`,
      clientName: profData.name || 'Participante / Contratado',
      clientPhone: signPhone,
      status: 'Pendente',
      sentDate: new Date().toISOString(),
    }
    saveSignatures([sig, ...getSignatures()])

    const link = `${window.location.origin}/assinatura/${id}`
    const text = encodeURIComponent(
      `Olá! Foi solicitada a sua assinatura eletrônica no documento: ${sig.documentName}. Acesse o link para assinar de forma segura: ${link}`,
    )
    window.open(`https://wa.me/${signPhone.replace(/\D/g, '')}?text=${text}`, '_blank')

    toast({
      title: 'Assinatura Solicitada',
      description: 'Link gerado e WhatsApp aberto para envio.',
    })
    setIsSignDialogOpen(false)
    setSignPhone('')
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
            <Dialog open={isSignDialogOpen} onOpenChange={setIsSignDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200"
                >
                  <ShieldCheck className="h-4 w-4" />{' '}
                  <span className="hidden sm:inline">Coletar Assinatura</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solicitar Assinatura Eletrônica</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleRequestSignature} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Nome do Signatário (Participante/Prestador)</Label>
                    <Input
                      value={profData.name}
                      disabled
                      className="bg-gray-50"
                      placeholder="Preencha no painel lateral"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp / Telefone para envio</Label>
                    <Input
                      required
                      placeholder="(11) 99999-9999"
                      value={signPhone}
                      onChange={(e) => setSignPhone(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="w-full gap-2 mt-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Send className="h-4 w-4" /> Gerar Link e Enviar
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

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
                <Info className="h-4 w-4" /> Preenchimento Automatizado
              </div>
              <p className="text-blue-700/80 leading-relaxed text-xs">
                A JT Obras constará como Emissora / Contratante. Preencha os dados do participante
                ou contratado para formalizar os registros de NRs e treinamentos.
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

            <div className="space-y-4 pt-4 border-t mt-4">
              <h3 className="font-bold text-brand-navy">Dados do Outro Signatário</h3>
              <div className="space-y-2">
                <Label>Nome Completo (Participante / Prestador)</Label>
                <Input
                  value={profData.name}
                  onChange={(e) => handleProfChange('name', e.target.value)}
                  placeholder="Ex: Carlos Silva"
                />
              </div>
              <div className="space-y-2">
                <Label>Registro / Matrícula (Opcional)</Label>
                <Input
                  value={profData.registry}
                  onChange={(e) => handleProfChange('registry', e.target.value)}
                  placeholder="Ex: Matrícula 123"
                />
              </div>
              <div className="space-y-2">
                <Label>CPF do Participante</Label>
                <Input
                  value={profData.document}
                  onChange={(e) => handleProfChange('document', e.target.value)}
                  placeholder="000.000.000-00"
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo / Função</Label>
                <Input
                  value={profData.role}
                  onChange={(e) => handleProfChange('role', e.target.value)}
                  placeholder="Ex: Pedreiro"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t mt-4">
              <h3 className="font-bold text-brand-navy">Detalhes da Execução</h3>
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
            </div>

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

              <div className="border border-gray-400 rounded p-4 mb-4">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  1. DADOS DA EMPRESA EMISSORA / RESPONSÁVEL
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
                    <strong>Representante Técnico:</strong> {COMPANY.responsible}
                  </p>
                </div>
              </div>

              <div className="border border-gray-400 rounded p-4 mb-4">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  2. DADOS DA OBRA / PROJETO
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <p>
                    <strong>Obra Vinculada:</strong>{' '}
                    {selectedProject?.name || '___________________________'}
                  </p>
                  <p>
                    <strong>Cliente / Local:</strong>{' '}
                    {selectedProject?.client || '___________________________'}
                  </p>
                  <p className="col-span-2">
                    <strong>Data de Emissão do Documento:</strong>{' '}
                    {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="border border-gray-400 rounded p-4 mb-4">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  3. DADOS DO PARTICIPANTE / PRESTADOR
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <p className="col-span-2">
                    <strong>Nome Completo:</strong>{' '}
                    {profData.name || '__________________________________________'}
                  </p>
                  <p>
                    <strong>Registro / Matrícula:</strong>{' '}
                    {profData.registry || '____________________'}
                  </p>
                  <p>
                    <strong>CPF:</strong> {profData.document || '____________________'}
                  </p>
                  <p className="col-span-2">
                    <strong>Função / Cargo:</strong>{' '}
                    {profData.role || '__________________________________________'}
                  </p>
                </div>
              </div>

              <div className="border border-gray-400 rounded p-4 mb-6 min-h-[150px]">
                <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                  4. DETALHES DO DOCUMENTO / ESPECIFICAÇÕES
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

              <div className="mt-20 flex justify-between gap-8 text-center px-4">
                <div className="w-1/2">
                  <div className="border-t border-black w-full mx-auto mb-2"></div>
                  <p className="font-bold text-xs">{COMPANY.responsible}</p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Responsável - {COMPANY.name}
                  </p>
                </div>
                <div className="w-1/2">
                  <div className="border-t border-black w-full mx-auto mb-2"></div>
                  <p className="font-bold text-xs">
                    {profData.name || 'Assinatura do Participante'}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Declarante / Treinado
                    {profData.role ? ` - ${profData.role}` : ''}
                  </p>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
