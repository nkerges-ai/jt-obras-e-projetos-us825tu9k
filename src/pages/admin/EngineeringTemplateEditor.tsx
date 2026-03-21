import { useState, useRef, useEffect } from 'react'
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
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Printer,
  Save,
  MessageCircle,
  PenTool,
  CheckCircle,
  Upload,
  Fingerprint,
  Trash2,
  Mail,
  Link2,
  Plus,
  Stamp,
  Users,
  Building2,
} from 'lucide-react'
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
  BiometricValidation,
  addLog,
  getEmployees,
  Employee,
  getCompanyAssets,
  getContractors,
  Contractor,
} from '@/lib/storage'
import { BiometricCapture } from '@/components/BiometricCapture'

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

const TREINAMENTO_FIELDS: TemplateField[] = [
  { key: 'courseTitle', label: 'Título do Treinamento', example: 'Ex: NR-35 - Trabalho em Altura' },
  { key: 'date', label: 'Data de Realização', example: 'Ex: 15/10/2023' },
  { key: 'duration', label: 'Carga Horária (Duração)', example: 'Ex: 8 horas' },
  {
    key: 'content',
    label: 'Conteúdo Programático',
    type: 'textarea',
    example: 'Ex: Normas, uso de EPIs, procedimentos de resgate.',
  },
  {
    key: 'instructor',
    label: 'Identificação do Instrutor (Nome e CREA/MTE)',
    example: 'Ex: João Silva - Téc. Segurança MTE 12345',
  },
]

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
        example: 'Ex: Galpão logístico J-2, risco médio...',
        type: 'textarea',
      },
      {
        key: 'medidas',
        label: 'Sistemas de Segurança Avaliados',
        example: 'Ex: Extintores, Iluminação de Emergência...',
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
  nr35: { title: 'Certificado de Treinamento NR-35', fields: TREINAMENTO_FIELDS },
  nr10: { title: 'Certificado de Treinamento NR-10', fields: TREINAMENTO_FIELDS },
  nr06: { title: 'Certificado de Treinamento NR-06', fields: TREINAMENTO_FIELDS },
  nr18: { title: 'Certificado de Treinamento NR-18', fields: TREINAMENTO_FIELDS },
}

export default function EngineeringTemplateEditor() {
  const { type } = useParams<{ type: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()

  const [projects, setProjects] = useState<Project[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [contractors, setContractors] = useState<Contractor[]>([])

  const [projectId, setProjectId] = useState('global')
  const [isRestricted, setIsRestricted] = useState(true)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [profData, setProfData] = useState({ name: '', document: '', role: '' })

  const [attendanceList, setAttendanceList] = useState<
    { id: string; name: string; cpf: string; signature?: string }[]
  >([])
  const [evidencePhotos, setEvidencePhotos] = useState<string[]>([])
  const photoRef = useRef<HTMLInputElement>(null)

  const [isAdminSignOpen, setIsAdminSignOpen] = useState(false)
  const [signType, setSignType] = useState<'draw' | 'upload' | 'govbr'>('draw')
  const [uploadedSign, setUploadedSign] = useState<string | null>(null)
  const [govbrLink, setGovbrLink] = useState('')
  const [tempSignature, setTempSignature] = useState<string | null>(null)
  const [isBiometricOpen, setIsBiometricOpen] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const [adminSignature, setAdminSignature] = useState<TechnicalDocument['adminSignature']>()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Individual Participant Signature logic
  const [isParticipantSignOpen, setIsParticipantSignOpen] = useState(false)
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null)
  const participantCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setProjects(getProjects())
    setEmployees(getEmployees())
    setContractors(getContractors())
  }, [])

  useEffect(() => {
    if (isAdminSignOpen && canvasRef.current && signType === 'draw') {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isAdminSignOpen, signType])

  useEffect(() => {
    if (isParticipantSignOpen && participantCanvasRef.current) {
      const ctx = participantCanvasRef.current.getContext('2d')
      if (ctx) {
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.strokeStyle = '#000000'
      }
    }
  }, [isParticipantSignOpen])

  if (!type || !TEMPLATES[type]) return <div className="p-8">Modelo não encontrado.</div>
  const config = TEMPLATES[type]
  const isTraining = type.startsWith('nr') || type === 'treinamento'
  const selectedProject = projects.find((p) => p.id === projectId)

  const handleSave = () => {
    const doc: TechnicalDocument = {
      id: `doc_${Date.now()}`,
      name: `${config.title.split(' ')[0]} - ${selectedProject?.name || 'Geral'}`,
      category: config.title.split(' ')[0],
      uploadDate: new Date().toISOString(),
      projectId: selectedProject?.id || 'global',
      isRestricted: isRestricted,
      url: '#',
      adminSignature: isSigned ? adminSignature : undefined,
      attendanceList: isTraining ? attendanceList : undefined,
      evidencePhotos: isTraining ? evidencePhotos : undefined,
    }
    saveTechnicalDocuments([doc, ...getTechnicalDocuments()])
    toast({
      title: 'Documento Salvo',
      description: 'O modelo foi gerado e salvo no Acervo Técnico.',
    })
    navigate('/admin')
  }

  const applyCompanyAsset = () => {
    const assets = getCompanyAssets()
    const asset =
      assets.find((a) => a.type === 'signature') || assets.find((a) => a.type === 'stamp')
    if (asset) {
      setAdminSignature({
        type: 'upload',
        data: asset.dataUrl,
        date: new Date().toLocaleString('pt-BR'),
      })
      setIsSigned(true)
      toast({ title: 'Validação Aplicada', description: 'Ativo oficial da empresa inserido.' })
    } else {
      toast({
        title: 'Não Encontrado',
        description: 'Nenhum ativo configurado na Biblioteca.',
        variant: 'destructive',
      })
    }
  }

  const handleAttachPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (ev) => {
          setEvidencePhotos((prev) => [...prev, ev.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
      toast({ title: 'Fotos Anexadas' })
    }
  }

  const addAttendee = (emp?: Employee) => {
    if (emp) {
      if (attendanceList.some((a) => a.cpf === emp.cpf)) return
      setAttendanceList([
        ...attendanceList,
        { id: `att_${Date.now()}`, name: emp.name, cpf: emp.cpf },
      ])
    } else {
      setAttendanceList([...attendanceList, { id: `att_${Date.now()}`, name: '', cpf: '' }])
    }
  }

  const updateAttendee = (id: string, field: string, val: string) =>
    setAttendanceList(attendanceList.map((a) => (a.id === id ? { ...a, [field]: val } : a)))
  const removeAttendee = (id: string) =>
    setAttendanceList(attendanceList.filter((a) => a.id !== id))

  const handlePreFillProf = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    if (emp) setProfData({ name: emp.name, document: emp.cpf, role: emp.role })
  }

  // Draw Admin
  const startDrawing = (e: any) => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }
  const draw = (e: any) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const stopDrawing = () => setIsDrawing(false)

  // Draw Participant
  const startDrawingPart = (e: any) => {
    const ctx = participantCanvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = participantCanvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }
  const drawPart = (e: any) => {
    if (!isDrawing) return
    const ctx = participantCanvasRef.current?.getContext('2d')
    if (!ctx) return
    const rect = participantCanvasRef.current!.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.nativeEvent.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.nativeEvent.clientY) - rect.top
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const handleSaveAdminSignature = () => {
    if (signType === 'draw' && canvasRef.current)
      setTempSignature(canvasRef.current.toDataURL('image/png'))
    else if (signType === 'upload') setTempSignature(uploadedSign)
    else if (signType === 'govbr') setTempSignature('govbr')
    setIsAdminSignOpen(false)
    setTimeout(() => setIsBiometricOpen(true), 300)
  }

  const finalizeAdminSignature = (bioData: BiometricValidation) => {
    setAdminSignature({
      type: signType,
      data: signType !== 'govbr' ? tempSignature! : undefined,
      link: signType === 'govbr' ? govbrLink : undefined,
      date: new Date().toLocaleString('pt-BR'),
      biometric: bioData,
    })
    setIsSigned(true)
    setIsBiometricOpen(false)
    toast({ title: 'Documento Assinado' })
  }

  const handleSaveParticipantSignature = () => {
    if (participantCanvasRef.current && activeParticipantId) {
      const dataUrl = participantCanvasRef.current.toDataURL('image/png')
      updateAttendee(activeParticipantId, 'signature', dataUrl)
      setIsParticipantSignOpen(false)
      setActiveParticipantId(null)
      toast({
        title: 'Assinatura Coletada',
        description: 'A assinatura do participante foi registrada.',
      })
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <style>{`
        @media print {
          body { counter-reset: page-counter; }
          .print-page-container { counter-increment: page-counter; }
          .page-number::after { content: "Página " counter(page-counter); }
        }
      `}</style>
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={finalizeAdminSignature}
        onCancel={() => setIsBiometricOpen(false)}
      />

      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy hidden sm:block truncate max-w-[200px] md:max-w-md">
              Edição: {config.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {!isSigned ? (
              <>
                <Button
                  size="sm"
                  onClick={applyCompanyAsset}
                  variant="outline"
                  className="gap-2 border-brand-navy text-brand-navy hidden lg:flex"
                >
                  <Stamp className="h-4 w-4" /> Validar Oficial
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsAdminSignOpen(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PenTool className="h-4 w-4" />{' '}
                  <span className="hidden lg:inline">Assinar (JT)</span>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-green-100 text-green-700 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" />{' '}
                <span className="hidden lg:inline">Assinado</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2 hidden md:flex"
            >
              <Save className="h-4 w-4" /> Salvar
            </Button>
            <Button
              onClick={() => window.print()}
              size="sm"
              className="gap-2 bg-brand-navy text-white hover:bg-brand-navy/90"
            >
              <Printer className="h-4 w-4" /> Imprimir
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 print:p-0 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5 lg:max-h-[80vh] lg:overflow-y-auto">
            <h2 className="font-bold text-xl mb-4 border-b pb-2 text-brand-navy">
              Dados do Documento
            </h2>
            <div className="space-y-2">
              <Label>Obra / Cliente Vinculado</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a obra..." />
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

            {!isTraining && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-brand-navy">Dados do Signatário</h3>
                </div>
                <div className="space-y-2 pb-2 border-b border-gray-100">
                  <Label className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" /> Autopreencher com Colaborador
                  </Label>
                  <Select onValueChange={handlePreFillProf}>
                    <SelectTrigger className="h-8 text-xs bg-white">
                      <SelectValue placeholder="Selecionar Colaborador..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((e) => (
                        <SelectItem key={e.id} value={e.id}>
                          {e.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    value={profData.name}
                    onChange={(e) => setProfData({ ...profData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registro / CPF</Label>
                  <Input
                    value={profData.document}
                    onChange={(e) => setProfData({ ...profData, document: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cargo / Função</Label>
                  <Input
                    value={profData.role}
                    onChange={(e) => setProfData({ ...profData, role: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 pt-4 border-t mt-4">
              <h3 className="font-bold text-brand-navy">Detalhes da Execução</h3>
              {config.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      className="min-h-[80px]"
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.example}
                    />
                  ) : (
                    <Input
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                      placeholder={field.example}
                    />
                  )}
                </div>
              ))}
            </div>

            {isTraining && (
              <div className="space-y-4 pt-4 border-t mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-brand-navy">Lista de Presença</h3>
                  <div className="flex gap-2">
                    <Select onValueChange={(v) => addAttendee(employees.find((e) => e.id === v))}>
                      <SelectTrigger className="h-7 text-xs w-[120px]">
                        <SelectValue placeholder="Colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => addAttendee()}
                      className="h-7 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" /> Avulso
                    </Button>
                  </div>
                </div>
                {attendanceList.map((att, i) => (
                  <div
                    key={att.id}
                    className="flex gap-2 items-center flex-wrap sm:flex-nowrap bg-gray-50 p-2 rounded border"
                  >
                    <span className="text-xs font-bold w-4 shrink-0">{i + 1}.</span>
                    <Input
                      placeholder="Nome"
                      value={att.name}
                      onChange={(e) => updateAttendee(att.id, 'name', e.target.value)}
                      className="h-8 text-xs flex-1"
                    />
                    <Input
                      placeholder="CPF"
                      value={att.cpf}
                      onChange={(e) => updateAttendee(att.id, 'cpf', e.target.value)}
                      className="h-8 text-xs w-28 shrink-0"
                    />

                    {att.signature ? (
                      <CheckCircle className="h-6 w-6 text-green-500 shrink-0" title="Assinado" />
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 text-xs shrink-0"
                        onClick={() => {
                          setActiveParticipantId(att.id)
                          setIsParticipantSignOpen(true)
                        }}
                      >
                        Assinar
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttendee(att.id)}
                      className="h-8 w-8 text-red-500 shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                <h3 className="font-bold text-brand-navy pt-4">Fotos de Evidência</h3>
                <input
                  type="file"
                  ref={photoRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleAttachPhotos}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed"
                  onClick={() => photoRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" /> Upload de Fotos
                </Button>
                <div className="flex gap-2 overflow-x-auto py-2">
                  {evidencePhotos.map((p, i) => (
                    <img
                      key={i}
                      src={p}
                      alt="Evidência"
                      className="h-16 w-16 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-start print:block print:w-full">
          <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:m-0 print:p-0 print-page-container flex flex-col">
            <div className="p-[15mm] border border-gray-400 min-h-[297mm] flex flex-col flex-1 print:border-gray-800 m-[5mm] print:m-0">
              <header className="border-b-2 border-brand-orange pb-6 mb-10 flex justify-between items-end">
                <img src={logo} alt="JT Obras" className="h-16 md:h-20 object-contain" />
                <div className="text-right text-[11px] text-gray-600 space-y-0.5">
                  <p className="font-bold text-brand-navy text-[13px]">{COMPANY.name}</p>
                  <p>CNPJ: {COMPANY.cnpj}</p>
                  <p>{COMPANY.address}</p>
                </div>
              </header>

              <main className="flex-1 text-[13px] leading-relaxed text-gray-800">
                <h2 className="text-center font-bold text-xl uppercase mb-8 tracking-widest text-brand-navy">
                  {isTraining ? 'Ata de Treinamento e Integração' : config.title}
                </h2>
                <div className="border border-gray-400 rounded p-3 mb-4 bg-gray-50/50">
                  <p>
                    <strong>Obra / Projeto:</strong>{' '}
                    {selectedProject?.name || '___________________________'}
                  </p>
                  <p>
                    <strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}
                  </p>
                </div>

                <div className="border border-gray-400 rounded p-4 mb-6 min-h-[150px]">
                  <h3 className="font-bold border-b border-gray-300 mb-3 pb-1 text-[13px] text-brand-navy">
                    DETALHES DO DOCUMENTO
                  </h3>
                  <div className="space-y-4">
                    {config.fields.map((field) => (
                      <p key={field.key}>
                        <strong className="block mb-1">{field.label}:</strong>{' '}
                        <span className="whitespace-pre-wrap block bg-white p-2 border border-gray-200 rounded min-h-[24px]">
                          {formData[field.key] || '---'}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>

                {!isTraining && (
                  <div className="mt-20 flex justify-between gap-8 text-center px-4">
                    <div className="w-1/2 flex flex-col items-center">
                      {isSigned && adminSignature?.type === 'govbr' ? (
                        <div className="h-12 mb-2 flex items-center">
                          <span className="text-[10px] font-bold text-blue-800 border px-2 py-1 rounded bg-blue-50">
                            ASSINADO GOV.BR
                          </span>
                        </div>
                      ) : isSigned && adminSignature?.data ? (
                        <div className="h-12 flex items-center justify-center mb-2">
                          <img
                            src={adminSignature.data}
                            className="max-h-full mix-blend-multiply"
                            alt="Assinatura"
                          />
                        </div>
                      ) : (
                        <div className="border-t border-black w-full mx-auto mb-2 mt-12"></div>
                      )}
                      {isSigned && adminSignature?.type !== 'govbr' && (
                        <div className="border-t border-black w-full mx-auto mb-2"></div>
                      )}
                      <p className="font-bold text-xs">{COMPANY.responsible}</p>
                      <p className="text-[10px] text-gray-500 uppercase">
                        Emissor - {COMPANY.name}
                      </p>
                    </div>
                    <div className="w-1/2 flex flex-col items-center">
                      <div className="border-t border-black w-full mx-auto mb-2 mt-12"></div>
                      <p className="font-bold text-xs">{profData.name || 'Assinatura'}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Recebedor / Cliente</p>
                    </div>
                  </div>
                )}
              </main>

              <footer className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500">
                <span>
                  {COMPANY.name} - CNPJ: {COMPANY.cnpj}
                </span>
                <span>{COMPANY.address}</span>
                <span className="print:block hidden page-number"></span>
              </footer>
            </div>
          </div>

          {/* Training Attendance List */}
          {isTraining && attendanceList.length > 0 && (
            <div className="print:block hidden bg-white shadow-xl w-full max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] border border-gray-400 mt-8 print:break-before-page print-page-container flex flex-col">
              <header className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
                <img src={logo} className="h-10 object-contain" alt="JT Obras Logo" />
                <h2 className="text-sm font-bold text-center uppercase text-brand-navy">
                  Lista de Presença - {formData.courseTitle || config.title}
                </h2>
              </header>
              <div className="flex-1">
                <table className="w-full border-collapse border border-black text-[12px] text-center">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-black p-2 w-10">Nº</th>
                      <th className="border border-black p-2">Nome Completo</th>
                      <th className="border border-black p-2 w-32">CPF</th>
                      <th className="border border-black p-2 w-48">Assinatura</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((att, i) => (
                      <tr key={att.id} className="h-14">
                        <td className="border border-black p-2">{i + 1}</td>
                        <td className="border border-black p-2 text-left pl-2">{att.name}</td>
                        <td className="border border-black p-2">{att.cpf}</td>
                        <td className="border border-black p-1 align-middle text-center">
                          {att.signature ? (
                            <img
                              src={att.signature}
                              className="max-h-10 mx-auto mix-blend-multiply"
                            />
                          ) : (
                            ''
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <footer className="mt-auto pt-4 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500">
                <span>JT OBRAS E MANUTENÇÕES LTDA</span>
                <span className="print:block hidden page-number"></span>
              </footer>
            </div>
          )}

          {/* Evidence Photos */}
          {isTraining && evidencePhotos.length > 0 && (
            <div className="print:block hidden bg-white shadow-xl w-full max-w-[210mm] mx-auto min-h-[297mm] p-[15mm] border border-gray-400 mt-8 print:break-before-page print-page-container flex flex-col">
              <header className="flex justify-between items-center border-b border-gray-300 pb-4 mb-6">
                <img src={logo} className="h-10 object-contain" alt="JT Obras Logo" />
                <h2 className="text-sm font-bold text-center uppercase text-brand-navy">
                  Relatório Fotográfico - Evidências
                </h2>
              </header>
              <div className="flex-1 grid grid-cols-2 gap-4 content-start">
                {evidencePhotos.map((photo, i) => (
                  <div
                    key={i}
                    className="border border-gray-300 p-2 h-48 flex items-center justify-center bg-gray-50"
                  >
                    <img
                      src={photo}
                      alt="Evidência"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ))}
              </div>
              <footer className="mt-auto pt-4 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500">
                <span>JT OBRAS E MANUTENÇÕES LTDA</span>
                <span className="print:block hidden page-number"></span>
              </footer>
            </div>
          )}

          {/* Certificates */}
          {isTraining &&
            attendanceList.length > 0 &&
            attendanceList.map((att) => (
              <div
                key={`cert_${att.id}`}
                className="print:block hidden bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto p-[15mm] border border-gray-400 mt-8 print:break-before-page print-page-container flex flex-col"
              >
                <div className="border-[8px] border-double border-brand-navy p-8 h-full flex-1 flex flex-col items-center justify-center text-center relative bg-slate-50/50">
                  <div className="absolute top-8 text-center w-full">
                    <img src={logo} className="h-16 object-contain mx-auto" alt="JT Obras Logo" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-brand-navy mb-6 uppercase tracking-widest mt-24">
                    Certificado
                  </h1>
                  <p className="text-base mb-6 text-gray-700">Certificamos que</p>
                  <h2 className="text-2xl font-bold border-b-2 border-brand-orange pb-2 mb-6 w-full max-w-sm text-gray-900 mx-auto">
                    {att.name || '___________________________'}
                  </h2>
                  <p className="text-sm mb-8 text-gray-600">
                    Portador(a) do CPF <strong>{att.cpf || '___.___.___-__'}</strong>
                  </p>
                  <p className="text-base mb-12 leading-relaxed max-w-md text-gray-800 mx-auto">
                    Concluiu com êxito o treinamento de <br />
                    <strong className="text-lg text-brand-navy block mt-2">
                      {formData.courseTitle || config.title}
                    </strong>
                    <br />
                    realizado em <strong>{formData.date || '__/__/____'}</strong>, com carga horária
                    de <strong>{formData.duration || '___ horas'}</strong>, ministrado por{' '}
                    <strong>{formData.instructor || '___________________'}</strong>.
                  </p>
                  <div className="w-full flex flex-col items-center gap-12 mt-auto pb-8">
                    <div className="w-56 text-center">
                      {isSigned && adminSignature?.data ? (
                        <img
                          src={adminSignature.data}
                          className="h-12 mx-auto mix-blend-multiply mb-1"
                        />
                      ) : (
                        <div className="border-t border-black w-full mb-2"></div>
                      )}
                      {(!isSigned || !adminSignature?.data) && (
                        <div className="border-t border-black w-full mb-2"></div>
                      )}
                      <p className="font-bold text-sm">
                        {formData.instructor || 'Instrutor Técnico'}
                      </p>
                      <p className="text-xs text-gray-500">Responsável pelo Treinamento</p>
                    </div>
                    <div className="w-56 text-center">
                      {att.signature ? (
                        <img src={att.signature} className="h-12 mx-auto mix-blend-multiply mb-1" />
                      ) : (
                        <div className="border-t border-black w-full mb-2"></div>
                      )}
                      {!att.signature && <div className="border-t border-black w-full mb-2"></div>}
                      <p className="font-bold text-sm">{att.name}</p>
                      <p className="text-xs text-gray-500">Participante</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Dialog open={isAdminSignOpen} onOpenChange={setIsAdminSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura do Documento</DialogTitle>
          </DialogHeader>
          <Tabs
            value={signType}
            onValueChange={(v) => setSignType(v as any)}
            className="w-full pt-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="draw" className="gap-1 text-xs">
                <PenTool className="h-3 w-3" /> Desenhar
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-1 text-xs">
                <Upload className="h-3 w-3" /> Imagem
              </TabsTrigger>
              <TabsTrigger value="govbr" className="gap-1 text-xs">
                <Fingerprint className="h-3 w-3" /> Gov.br
              </TabsTrigger>
            </TabsList>
            <TabsContent value="draw" className="space-y-4 mt-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 touch-none">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={200}
                  className="w-full h-[200px] cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
              </div>
            </TabsContent>
            <TabsContent value="upload" className="space-y-4 mt-4">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) {
                    const r = new FileReader()
                    r.onload = (ev) => setUploadedSign(ev.target?.result as string)
                    r.readAsDataURL(f)
                  }
                }}
              />
            </TabsContent>
            <TabsContent value="govbr" className="space-y-4 mt-4">
              <Input
                placeholder="Link de validação"
                value={govbrLink}
                onChange={(e) => setGovbrLink(e.target.value)}
              />
            </TabsContent>
            <Button onClick={handleSaveAdminSignature} className="w-full mt-4">
              Avançar para Validação
            </Button>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isParticipantSignOpen} onOpenChange={setIsParticipantSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura do Participante</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Assine no quadro abaixo para registrar presença.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 touch-none mt-4">
            <canvas
              ref={participantCanvasRef}
              width={400}
              height={200}
              className="w-full h-[200px] cursor-crosshair"
              onMouseDown={startDrawingPart}
              onMouseMove={drawPart}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawingPart}
              onTouchMove={drawPart}
              onTouchEnd={stopDrawing}
            />
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                participantCanvasRef.current?.getContext('2d')?.clearRect(0, 0, 400, 200)
              }}
            >
              Limpar
            </Button>
            <Button className="flex-1" onClick={handleSaveParticipantSignature}>
              Salvar Assinatura
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
