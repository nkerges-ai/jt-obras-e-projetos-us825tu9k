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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Printer,
  Save,
  PenTool,
  CheckCircle,
  Upload,
  Fingerprint,
  Trash2,
  Plus,
  Stamp,
  Users,
  Building2,
  ChevronRight,
  ChevronLeft,
  Mail,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  getProjects,
  Project,
  saveTechnicalDocuments,
  getTechnicalDocuments,
  TechnicalDocument,
  BiometricValidation,
  getEmployees,
  Employee,
  getCompanyAssets,
  getContractors,
  Contractor,
} from '@/lib/storage'
import { BiometricCapture } from '@/components/BiometricCapture'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { WizardStepper } from '@/components/WizardStepper'
import { EmailSenderDialog } from '@/components/EmailSenderDialog'

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
        type: 'textarea',
        example: 'Ex: Reforma estrutural com reforço em sapatas...',
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
        type: 'textarea',
        example: 'Ex: Galpão logístico J-2, risco médio...',
      },
      {
        key: 'medidas',
        label: 'Sistemas de Segurança Avaliados',
        type: 'textarea',
        example: 'Ex: Extintores, Iluminação de Emergência...',
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
        type: 'textarea',
        example: 'Ex: Manutenção na fachada com uso de balancim...',
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
        type: 'textarea',
        example: 'Ex: João, José, Maria',
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

  const [step, setStep] = useState(1)

  const [projectId, setProjectId] = useState('global')
  const [contractorId, setContractorId] = useState<string>('none')
  const [employeeId, setEmployeeId] = useState<string>('none')

  const [isRestricted, setIsRestricted] = useState(true)
  const [formData, setFormData] = useState<Record<string, string>>({})

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
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [isSigned, setIsSigned] = useState(false)
  const [adminSignature, setAdminSignature] = useState<TechnicalDocument['adminSignature']>()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

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

  const wizardSteps = isTraining
    ? ['Vínculos', 'Detalhes Técnicos', 'Lista e Fotos', 'Revisão e Geração']
    : ['Vínculos e Clientes', 'Detalhes Técnicos', 'Revisão e Geração']

  const selectedProject = projects.find((p) => p.id === projectId)
  const selectedContractor = contractors.find((c) => c.id === contractorId)
  const selectedEmployee = employees.find((e) => e.id === employeeId)

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
        reader.onload = (ev) => setEvidencePhotos((prev) => [...prev, ev.target?.result as string])
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

  const renderWizardContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Vínculos Operacionais</h3>
          <div className="space-y-2">
            <Label>Obra / Projeto Vinculado</Label>
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
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Contratante
            </Label>
            <Select value={contractorId} onValueChange={setContractorId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o contratante..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não especificado</SelectItem>
                {contractors.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Users className="h-3 w-3" /> Parceiro / Contratada
            </Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o parceiro..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Não especificado</SelectItem>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
            <Switch id="restricted" checked={isRestricted} onCheckedChange={setIsRestricted} />
            <Label htmlFor="restricted">Manter Documento Restrito no Acervo</Label>
          </div>
        </div>
      )
    }
    if (step === 2) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Detalhes Técnicos</h3>
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
      )
    }
    if (step === 3 && isTraining) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-bold text-lg text-brand-navy">Lista de Presença</h3>
            <div className="flex gap-2">
              <Select onValueChange={(v) => addAttendee(employees.find((e) => e.id === v))}>
                <SelectTrigger className="h-8 text-xs w-[140px]">
                  <SelectValue placeholder="Base de Dados" />
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
                className="h-8 text-xs gap-1"
              >
                <Plus className="h-3 w-3" /> Avulso
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {attendanceList.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4 border rounded border-dashed">
                Nenhum participante adicionado.
              </p>
            )}
            {attendanceList.map((att, i) => (
              <div
                key={att.id}
                className="flex gap-2 items-center flex-wrap sm:flex-nowrap bg-gray-50 p-2 rounded border border-gray-200"
              >
                <span className="text-xs font-bold w-4 shrink-0 text-gray-500">{i + 1}.</span>
                <Input
                  placeholder="Nome"
                  value={att.name}
                  onChange={(e) => updateAttendee(att.id, 'name', e.target.value)}
                  className="h-9 text-sm flex-1 bg-white"
                />
                <Input
                  placeholder="CPF"
                  value={att.cpf}
                  onChange={(e) => updateAttendee(att.id, 'cpf', e.target.value)}
                  className="h-9 text-sm w-32 shrink-0 bg-white"
                />
                {att.signature ? (
                  <CheckCircle className="h-7 w-7 text-green-500 shrink-0" title="Assinado" />
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 px-3 text-xs shrink-0 bg-brand-light/10 text-brand-navy border-brand-light/20"
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
                  className="h-9 w-9 text-red-500 shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t">
            <h3 className="font-bold text-lg text-brand-navy mb-4">Fotos de Evidência</h3>
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
              className="w-full border-dashed h-16 bg-gray-50 text-gray-600 hover:bg-gray-100"
              onClick={() => photoRef.current?.click()}
            >
              <Upload className="h-5 w-5 mr-2" /> Clique para Anexar Fotos do Treinamento
            </Button>
            {evidencePhotos.length > 0 && (
              <div className="flex gap-3 overflow-x-auto py-4">
                {evidencePhotos.map((p, i) => (
                  <img
                    key={i}
                    src={p}
                    alt="Evidência"
                    className="h-20 w-20 object-cover rounded shadow-sm border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={finalizeAdminSignature}
        onCancel={() => setIsBiometricOpen(false)}
      />
      <EmailSenderDialog
        open={isEmailOpen}
        onOpenChange={setIsEmailOpen}
        documentName={`${config.title} - ${selectedProject?.name || 'Geral'}`}
      />

      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg text-brand-navy hidden sm:block truncate max-w-md">
              Geração Técnica: {config.title}
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {step === wizardSteps.length && (
              <>
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
                      className="gap-2 bg-brand-navy text-white"
                    >
                      <PenTool className="h-4 w-4" />{' '}
                      <span className="hidden lg:inline">Assinar (Técnico)</span>
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
                  onClick={() => setIsEmailOpen(true)}
                  size="sm"
                  variant="outline"
                  className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 hidden md:flex"
                >
                  <Mail className="h-4 w-4" /> Enviar por E-mail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-2 hidden md:flex border-brand-navy text-brand-navy hover:bg-brand-navy/5"
                >
                  <Save className="h-4 w-4" /> Salvar Acervo
                </Button>
                <Button
                  onClick={() => window.print()}
                  size="sm"
                  className="gap-2 bg-brand-light text-white hover:bg-brand-light/90"
                >
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <WizardStepper steps={wizardSteps} currentStep={step} setStep={setStep} />

      <div className="container mx-auto px-4 print:p-0 flex flex-col items-center">
        {step < wizardSteps.length && (
          <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl border shadow-sm print:hidden min-h-[450px] flex flex-col">
            {renderWizardContent()}
            <div className="flex justify-between mt-auto pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                className="gap-2 bg-brand-light hover:bg-brand-light/90 text-white"
              >
                Avançar <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div
          className={`w-full flex-col justify-start print:block print:w-full ${step < wizardSteps.length ? 'hidden print:flex' : 'flex'}`}
        >
          <DocumentLetterhead title={isTraining ? 'Ata de Treinamento e Integração' : config.title}>
            <div className="border border-brand-navy/20 rounded p-4 mb-8 bg-gray-50/50 space-y-1 text-[13px] shadow-sm">
              <p>
                <strong>Obra / Projeto:</strong>{' '}
                {selectedProject?.name || '___________________________'}
              </p>
              <p>
                <strong>Contratante:</strong>{' '}
                {selectedContractor?.name || '___________________________'}
                {selectedContractor?.cnpj ? ` - CNPJ/CPF: ${selectedContractor.cnpj}` : ''}
              </p>
              <p>
                <strong>Parceiro Técnico:</strong>{' '}
                {selectedEmployee?.name || '___________________________'}
                {selectedEmployee?.cpf ? ` - Registro: ${selectedEmployee.cpf}` : ''}
              </p>
              <p>
                <strong>Data de Emissão:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="border-l-4 border-brand-light pl-4 py-2 mb-8 space-y-5">
              <h3 className="font-bold text-[14px] text-brand-navy mb-4 uppercase tracking-wider">
                DETALHES DA OPERAÇÃO
              </h3>
              {config.fields.map((field) => (
                <div key={field.key} className="text-[13px] leading-relaxed break-inside-avoid">
                  <strong className="block mb-1 text-gray-600">{field.label}:</strong>
                  <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded border border-gray-100 font-medium text-brand-navy">
                    {formData[field.key] || '---'}
                  </div>
                </div>
              ))}
            </div>

            {!isTraining && (
              <div className="mt-20 flex justify-between gap-8 text-center px-8 break-inside-avoid">
                <div className="w-1/2 flex flex-col items-center">
                  {isSigned && adminSignature?.type === 'govbr' ? (
                    <div className="h-16 flex items-center justify-center mb-2">
                      <span className="text-[10px] font-bold text-brand-navy border border-brand-navy px-2 py-1 bg-brand-light/10">
                        ASSINADO GOV.BR
                      </span>
                    </div>
                  ) : isSigned && adminSignature?.data ? (
                    <div className="h-16 flex items-center justify-center mb-2">
                      <img src={adminSignature.data} className="max-h-full mix-blend-multiply" />
                    </div>
                  ) : (
                    <div className="border-t border-gray-400 w-full mx-auto mb-2 mt-16"></div>
                  )}
                  {isSigned && adminSignature?.type !== 'govbr' && (
                    <div className="border-t border-gray-400 w-full mx-auto mb-2"></div>
                  )}
                  <p className="font-bold text-xs text-brand-navy">{COMPANY.responsible}</p>
                  <p className="text-[10px] text-gray-500 uppercase">
                    Emissor Técnico - {COMPANY.name}
                  </p>
                </div>
                <div className="w-1/2 flex flex-col items-center">
                  <div className="border-t border-gray-400 w-full mx-auto mb-2 mt-16"></div>
                  <p className="font-bold text-xs text-brand-navy">
                    {selectedContractor?.name || 'Responsável Local'}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">Aprovação / Ciência</p>
                </div>
              </div>
            )}
          </DocumentLetterhead>

          {/* Training Attendance List Document */}
          {isTraining && attendanceList.length > 0 && (
            <DocumentLetterhead
              title={`Lista de Presença - ${formData.courseTitle || config.title}`}
              className="mt-8 print:break-before-page"
            >
              <table className="w-full border-collapse border border-brand-navy text-[12px] text-center shadow-sm">
                <thead>
                  <tr className="bg-brand-navy text-white">
                    <th className="border border-brand-navy p-2 w-10">Nº</th>
                    <th className="border border-brand-navy p-2 text-left pl-3">
                      Nome Completo do Colaborador
                    </th>
                    <th className="border border-brand-navy p-2 w-36">CPF</th>
                    <th className="border border-brand-navy p-2 w-48">Assinatura Coletada</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((att, i) => (
                    <tr key={att.id} className="h-16 even:bg-gray-50">
                      <td className="border border-brand-navy/30 p-2 font-bold text-gray-500">
                        {i + 1}
                      </td>
                      <td className="border border-brand-navy/30 p-2 text-left pl-3 font-medium">
                        {att.name}
                      </td>
                      <td className="border border-brand-navy/30 p-2 text-gray-600">{att.cpf}</td>
                      <td className="border border-brand-navy/30 p-1 align-middle text-center">
                        {att.signature && (
                          <img
                            src={att.signature}
                            className="max-h-12 mx-auto mix-blend-multiply"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DocumentLetterhead>
          )}

          {/* Evidence Photos Document */}
          {isTraining && evidencePhotos.length > 0 && (
            <DocumentLetterhead
              title="Relatório Fotográfico - Evidências"
              className="mt-8 print:break-before-page"
            >
              <div className="grid grid-cols-2 gap-6 content-start">
                {evidencePhotos.map((photo, i) => (
                  <div
                    key={i}
                    className="border-2 border-brand-light/20 p-2 h-56 flex items-center justify-center bg-gray-50 rounded shadow-sm break-inside-avoid"
                  >
                    <img
                      src={photo}
                      alt="Evidência"
                      className="max-w-full max-h-full object-contain rounded"
                    />
                  </div>
                ))}
              </div>
            </DocumentLetterhead>
          )}

          {/* Certificates Generation */}
          {isTraining &&
            attendanceList.length > 0 &&
            attendanceList.map((att) => (
              <DocumentLetterhead key={`cert_${att.id}`} className="mt-8 print:break-before-page">
                <div className="border-[8px] border-double border-brand-navy p-8 h-full flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-b from-white to-gray-50">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-brand-light mb-8 uppercase tracking-[0.3em] drop-shadow-sm mt-12">
                    Certificado
                  </h1>
                  <p className="text-lg mb-6 text-gray-600">Certificamos com honra que</p>
                  <h2 className="text-2xl md:text-3xl font-bold border-b-2 border-brand-navy pb-3 mb-6 w-full max-w-lg text-brand-navy mx-auto">
                    {att.name || '___________________________'}
                  </h2>
                  <p className="text-sm md:text-base mb-10 text-gray-600">
                    Portador(a) do registro / CPF <strong>{att.cpf || '___.___.___-__'}</strong>
                  </p>
                  <p className="text-base md:text-lg mb-12 leading-relaxed max-w-xl text-gray-800 mx-auto">
                    Concluiu com pleno êxito e aproveitamento o treinamento técnico de <br />
                    <strong className="text-xl text-brand-navy block mt-3 mb-3">
                      {formData.courseTitle || config.title}
                    </strong>
                    realizado em <strong>{formData.date || '__/__/____'}</strong>, contabilizando
                    uma carga horária oficial de <strong>{formData.duration || '___ horas'}</strong>
                    , sob a instrução qualificada de{' '}
                    <strong>{formData.instructor || '___________________'}</strong>.
                  </p>
                  <div className="w-full flex flex-col items-center gap-12 mt-auto pb-12">
                    <div className="w-64 text-center">
                      {isSigned && adminSignature?.data ? (
                        <img
                          src={adminSignature.data}
                          className="h-16 mx-auto mix-blend-multiply mb-2"
                        />
                      ) : (
                        <div className="border-t border-brand-navy w-full mb-3"></div>
                      )}
                      {(!isSigned || !adminSignature?.data) && (
                        <div className="border-t border-brand-navy w-full mb-3"></div>
                      )}
                      <p className="font-bold text-sm text-brand-navy">
                        {formData.instructor || 'Instrutor Técnico Validado'}
                      </p>
                      <p className="text-xs text-brand-light uppercase tracking-wider">
                        Responsável pelo Treinamento
                      </p>
                    </div>
                  </div>
                </div>
              </DocumentLetterhead>
            ))}
        </div>
      </div>

      <Dialog open={isAdminSignOpen} onOpenChange={setIsAdminSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assinatura Oficial do Documento</DialogTitle>
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
                placeholder="Código de validação Gov.br"
                value={govbrLink}
                onChange={(e) => setGovbrLink(e.target.value)}
              />
            </TabsContent>
            <Button
              onClick={handleSaveAdminSignature}
              className="w-full mt-4 bg-brand-navy hover:bg-brand-navy/90 text-white"
            >
              Avançar para Validação Geométrica
            </Button>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isParticipantSignOpen} onOpenChange={setIsParticipantSignOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Coleta de Assinatura (Participante)</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Registre a assinatura do colaborador no quadro abaixo.
          </p>
          <div className="border-2 border-dashed border-brand-light/50 rounded-lg overflow-hidden bg-gray-50 touch-none mt-4">
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
              onClick={() =>
                participantCanvasRef.current?.getContext('2d')?.clearRect(0, 0, 400, 200)
              }
            >
              Limpar
            </Button>
            <Button
              className="flex-1 bg-brand-light hover:bg-brand-light/90 text-white"
              onClick={handleSaveParticipantSignature}
            >
              Confirmar Assinatura
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
