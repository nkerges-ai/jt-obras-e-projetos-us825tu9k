import { useState, useEffect } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LogOut,
  FileText,
  Image as ImageIcon,
  Headset,
  Download,
  Plus,
  CheckCircle2,
  FolderOpen,
  Lock,
  CalendarDays,
  BriefcaseBusiness,
  ClipboardList,
  MessageSquare,
} from 'lucide-react'
import {
  getProjects,
  saveProjects,
  getTickets,
  saveTickets,
  getTechnicalDocuments,
  getAccessRequests,
  saveAccessRequests,
  getPpe,
  getEquipment,
  getRentalRequests,
  saveRentalRequests,
  getSignatures,
  getChatMessages,
  Project,
  Ticket,
  TechnicalDocument,
  DocumentAccessRequest,
  Ppe,
  Equipment,
  RentalRequest,
  DocumentSignature,
  ConstructionReport,
} from '@/lib/storage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { GanttChart } from '@/components/GanttChart'
import { ChatWindow } from '@/components/ChatWindow'
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider'
import { Checkbox } from '@/components/ui/checkbox'

export default function ClientDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const projectId = sessionStorage.getItem('client_project_id')

  const [project, setProject] = useState<Project | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [techDocs, setTechDocs] = useState<TechnicalDocument[]>([])
  const [requests, setRequests] = useState<DocumentAccessRequest[]>([])
  const [signatures, setSignatures] = useState<DocumentSignature[]>([])

  const [ppes, setPpes] = useState<Ppe[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [clientRentals, setClientRentals] = useState<RentalRequest[]>([])

  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [newTicketDesc, setNewTicketDesc] = useState('')

  const [unreadClient, setUnreadClient] = useState(0)

  // Track checklist states for report approvals
  const [approveChecklist, setApproveChecklist] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (projectId) {
      const p = getProjects().find((p) => p.id === projectId)
      if (p) setProject(p)

      const allTickets = getTickets()
      setTickets(allTickets.filter((t) => t.projectId === projectId))

      const allDocs = getTechnicalDocuments()
      setTechDocs(allDocs.filter((d) => d.projectId === 'global' || d.projectId === projectId))

      const allReqs = getAccessRequests()
      setRequests(allReqs.filter((r) => r.projectId === projectId))

      setSignatures(getSignatures())

      setPpes(getPpe())
      setEquipments(getEquipment())
      setClientRentals(getRentalRequests().filter((r) => r.projectId === projectId))

      const updateUnread = () => {
        const msgs = getChatMessages()
        setUnreadClient(
          msgs.filter((m) => m.projectId === projectId && m.sender === 'admin' && !m.read).length,
        )
      }
      updateUnread()
      window.addEventListener('jt_chats_updated', updateUnread)
      return () => window.removeEventListener('jt_chats_updated', updateUnread)
    }
  }, [projectId])

  if (!projectId) return <Navigate to="/cliente/login" />
  if (!project) return <div className="p-8 text-center">Carregando dados...</div>

  const handleLogout = () => {
    sessionStorage.removeItem('client_project_id')
    navigate('/')
  }

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicketDesc) return

    const newTicket: Ticket = {
      id: `t_${Date.now()}`,
      clientName: project.client,
      projectId: project.id,
      description: newTicketDesc,
      dateOpened: new Date().toISOString(),
      status: 'Aberto',
      internalNotes: '',
    }

    const allTickets = getTickets()
    saveTickets([newTicket, ...allTickets])
    setTickets([newTicket, ...tickets])
    setNewTicketDesc('')
    setIsTicketDialogOpen(false)
    toast({ title: 'Chamado Aberto', description: 'Nossa equipe entrará em contato em breve.' })
  }

  const handleRequestAccess = (docId: string) => {
    const newReq: DocumentAccessRequest = {
      id: `req_${Date.now()}`,
      documentId: docId,
      projectId: project.id,
      clientName: project.client,
      status: 'Pendente',
      requestDate: new Date().toISOString(),
    }
    const allReqs = getAccessRequests()
    saveAccessRequests([newReq, ...allReqs])
    setRequests([newReq, ...requests])
    toast({
      title: 'Acesso Solicitado',
      description: 'Sua solicitação foi enviada ao administrador.',
    })
  }

  const handleRentalRequest = (item: Ppe | Equipment, type: 'EPI' | 'Equipamento') => {
    const newReq: RentalRequest = {
      id: `rent_${Date.now()}`,
      itemId: item.id,
      itemType: type,
      itemName: type === 'EPI' ? (item as Ppe).name : (item as Equipment).type,
      projectId: project.id,
      clientName: project.client,
      quantity: 1,
      status: 'Pendente',
      requestDate: new Date().toISOString(),
    }
    const allRentals = getRentalRequests()
    saveRentalRequests([newReq, ...allRentals])
    setClientRentals([newReq, ...clientRentals])
    toast({
      title: 'Solicitação Enviada',
      description: 'O administrador avaliará seu pedido de locação/EPI.',
    })
  }

  const toggleChecklist = (reportId: string, itemIdx: number, checked: boolean) => {
    setApproveChecklist((prev) => ({ ...prev, [`${reportId}_${itemIdx}`]: checked }))
  }

  const handleApproveReport = (report: ConstructionReport) => {
    if (!approveChecklist[`${report.id}_0`] || !approveChecklist[`${report.id}_1`]) {
      toast({
        title: 'Atenção Necessária',
        description: 'Por favor, confirme a leitura e visualização dos itens antes de aprovar.',
        variant: 'destructive',
      })
      return
    }

    const updatedReport = {
      ...report,
      status: 'Aprovado' as const,
      approvalLog: {
        date: new Date().toISOString(),
        user: project.client,
      },
    }

    const updatedReports =
      project.reports?.map((r) => (r.id === report.id ? updatedReport : r)) || []
    const updatedProject = { ...project, reports: updatedReports }

    const projects = getProjects()
    const idx = projects.findIndex((p) => p.id === project.id)
    if (idx >= 0) {
      projects[idx] = updatedProject
      saveProjects(projects)
    }
    setProject(updatedProject)

    toast({
      title: 'Relatório Validado',
      description: 'A aprovação foi registrada no sistema com sucesso.',
    })
  }

  const antes = project.photos.filter((p) => p.type === 'Antes')
  const depois = project.photos.filter((p) => p.type === 'Depois')

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-navy">
            Bem-vindo, {project.client}
          </h1>
          <p className="text-muted-foreground mt-1">Acompanhamento da obra: {project.name}</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </div>

      <Tabs defaultValue="relatorios" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
          <TabsTrigger
            value="relatorios"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <ClipboardList className="h-4 w-4 mr-2" /> Validação de Relatórios
          </TabsTrigger>
          <TabsTrigger
            value="resumo"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Galeria de Imagens
          </TabsTrigger>
          <TabsTrigger
            value="cronograma"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <CalendarDays className="h-4 w-4 mr-2" /> Cronograma
          </TabsTrigger>
          <TabsTrigger
            value="acervo"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <FolderOpen className="h-4 w-4 mr-2" /> Documentos e Contratos
          </TabsTrigger>
          <TabsTrigger
            value="locacao"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <BriefcaseBusiness className="h-4 w-4 mr-2" /> Locação / EPIs
          </TabsTrigger>
          <TabsTrigger
            value="mensagens"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <MessageSquare className="h-4 w-4 mr-2" /> Mensagens
            {unreadClient > 0 && (
              <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] px-1.5 py-0 border-none shadow-none">
                {unreadClient}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="chamados"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <Headset className="h-4 w-4 mr-2" /> Suporte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="relatorios">
          <Card className="bg-white border-none shadow-sm mb-6">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg text-brand-navy">
                Acompanhamento e Validação de Obra
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!project.reports || project.reports.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
                  <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum relatório de acompanhamento disponível ainda.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {project.reports
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((report) => (
                      <div
                        key={report.id}
                        className="border-2 border-gray-100 rounded-xl p-5 bg-white shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-5 gap-4 border-b pb-4">
                          <h4 className="font-bold text-brand-navy text-xl flex items-center gap-2">
                            <CalendarDays className="h-6 w-6 text-primary" />
                            {new Date(report.date).toLocaleDateString('pt-BR')}
                          </h4>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 text-sm py-1 border-green-200"
                            >
                              Progresso: {report.progress}%
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                report.status === 'Aprovado'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200 py-1'
                                  : 'bg-yellow-50 text-yellow-700 border-yellow-200 py-1'
                              }
                            >
                              {report.status === 'Aprovado' ? 'Aprovado' : 'Aprovação Pendente'}
                            </Badge>
                          </div>
                        </div>

                        <div className="bg-gray-50/50 p-4 rounded-lg border text-gray-800 mb-6">
                          <h5 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">
                            Resumo das Atividades
                          </h5>
                          <p className="text-sm whitespace-pre-wrap leading-relaxed">
                            {report.summary}
                          </p>
                        </div>

                        {report.comparisons && report.comparisons.length > 0 && (
                          <div className="mb-6">
                            <h5 className="font-bold text-sm text-brand-navy border-b pb-2 mb-4 uppercase tracking-wider">
                              Evolução Visual (Antes e Depois)
                            </h5>
                            <div className="grid lg:grid-cols-2 gap-6">
                              {report.comparisons.map((cmp) => (
                                <BeforeAfterSlider
                                  key={cmp.id}
                                  beforeImage={cmp.before}
                                  afterImage={cmp.after}
                                  label={cmp.label}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {report.photos && report.photos.length > 0 && (
                          <div className="mb-6">
                            <h5 className="font-bold text-sm text-brand-navy border-b pb-2 mb-4 uppercase tracking-wider">
                              Galeria de Fotos do Período
                            </h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {report.photos.map((p, idx) => (
                                <div
                                  key={idx}
                                  className="aspect-square rounded-lg border overflow-hidden shadow-sm"
                                >
                                  <img
                                    src={p}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Approval Section */}
                        {!report.status || report.status === 'Pendente' ? (
                          <div className="mt-6 bg-blue-50/50 border border-blue-100 rounded-xl p-5 shadow-sm">
                            <h5 className="font-bold text-brand-navy mb-3 text-lg">
                              Validação do Cliente
                            </h5>
                            <p className="text-sm text-gray-600 mb-4">
                              Para que o relatório seja formalizado no dossiê da obra, por favor,
                              confirme a revisão dos itens abaixo.
                            </p>
                            <div className="space-y-3 mb-5 bg-white p-4 rounded-lg border border-blue-100">
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={`chk_${report.id}_0`}
                                  className="mt-0.5"
                                  checked={approveChecklist[`${report.id}_0`] || false}
                                  onCheckedChange={(c) => toggleChecklist(report.id, 0, !!c)}
                                />
                                <Label
                                  htmlFor={`chk_${report.id}_0`}
                                  className="text-sm cursor-pointer leading-tight text-gray-700"
                                >
                                  Confirmo que li o resumo das atividades e concordo com o progresso
                                  relatado de {report.progress}%.
                                </Label>
                              </div>
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  id={`chk_${report.id}_1`}
                                  className="mt-0.5"
                                  checked={approveChecklist[`${report.id}_1`] || false}
                                  onCheckedChange={(c) => toggleChecklist(report.id, 1, !!c)}
                                />
                                <Label
                                  htmlFor={`chk_${report.id}_1`}
                                  className="text-sm cursor-pointer leading-tight text-gray-700"
                                >
                                  Confirmo que visualizei as imagens e os comparativos de evolução
                                  apresentados neste relatório.
                                </Label>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleApproveReport(report)}
                              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white gap-2 h-11 px-8 shadow-md"
                            >
                              <CheckCircle2 className="h-5 w-5" /> Confirmar e Aprovar Relatório
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                            <div className="bg-green-100 p-2 rounded-full">
                              <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                            </div>
                            <div>
                              <p className="font-bold text-green-800">Relatório Aprovado</p>
                              <p className="text-sm text-green-700 mt-0.5">
                                Validado oficialmente por{' '}
                                <strong>{report.approvalLog?.user}</strong> em{' '}
                                {report.approvalLog
                                  ? new Date(report.approvalLog.date).toLocaleString('pt-BR')
                                  : '-'}
                                .
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resumo" className="space-y-6">
          <Card className="bg-white border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Status Atual do Projeto</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`h-3 w-3 rounded-full ${project.status === 'Concluído' ? 'bg-green-500' : project.status === 'Em andamento' ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    ></span>
                    <span className="font-bold text-lg">{project.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Início</p>
                  <span className="font-medium">
                    {new Date(project.startDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>

              {project.photos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-xl border border-dashed">
                  <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>A galeria de fotos deste projeto será atualizada em breve.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {antes.length > 0 && (
                    <div>
                      <h4 className="font-bold text-brand-navy mb-4 border-b pb-2">
                        Situação Inicial (Antes)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {antes.map((p) => (
                          <div
                            key={p.id}
                            className="aspect-square rounded-lg overflow-hidden shadow-sm border"
                          >
                            <img src={p.url} alt="Antes" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {depois.length > 0 && (
                    <div>
                      <h4 className="font-bold text-brand-navy mb-4 border-b pb-2">
                        Evolução / Atual
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {depois.map((p) => (
                          <div
                            key={p.id}
                            className="aspect-square rounded-lg overflow-hidden shadow-md border-2 border-brand-orange/30 relative"
                          >
                            <img src={p.url} alt="Depois" className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="h-3 w-3 text-green-500" /> Atual
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cronograma">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Cronograma de Fases (Gantt)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <GanttChart phases={project.phases || []} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acervo">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg text-brand-navy">Acervo Técnico e Contratos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {techDocs.length === 0 && (
                  <p className="p-8 text-center text-muted-foreground">
                    Nenhum documento técnico disponível no momento.
                  </p>
                )}
                {techDocs.map((doc) => {
                  const req = requests.find((r) => r.documentId === doc.id)
                  const sig = signatures.find((s) => s.documentId === doc.id)
                  const canDownload = !doc.isRestricted || req?.status === 'Aprovado'

                  return (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {doc.isRestricted && !canDownload ? (
                          <Lock className="h-8 w-8 text-orange-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-blue-500" />
                        )}
                        <div>
                          <p className="font-medium text-brand-navy">{doc.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {doc.category} • {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center justify-end">
                        {sig && sig.status === 'Pendente' && (
                          <Button
                            size="sm"
                            className="bg-brand-orange hover:bg-[#cf6d18] text-white animate-pulse shadow-md"
                            asChild
                          >
                            <Link to={`/assinatura/${sig.id}`}>Assinar Documento</Link>
                          </Button>
                        )}
                        {sig && sig.status === 'Assinado' && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 h-9 font-bold px-3"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Assinado
                          </Badge>
                        )}

                        {canDownload ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() =>
                              toast({
                                title: 'Download Iniciado',
                                description: 'O documento está sendo baixado.',
                              })
                            }
                          >
                            <Download className="h-4 w-4" /> Baixar
                          </Button>
                        ) : (
                          <Button
                            variant={req ? 'secondary' : 'default'}
                            size="sm"
                            className="gap-2"
                            disabled={!!req}
                            onClick={() => handleRequestAccess(doc.id)}
                          >
                            {req?.status === 'Pendente'
                              ? 'Aprovação Pendente'
                              : req?.status === 'Negado'
                                ? 'Acesso Negado'
                                : 'Solicitar Acesso'}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locacao">
          <Card className="bg-white border-none shadow-sm mb-6">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Catálogo de Equipamentos e EPIs</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                {clientRentals.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase">
                      Minhas Solicitações
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      {clientRentals.map((r) => (
                        <div key={r.id} className="border rounded-lg p-4 bg-gray-50 flex flex-col">
                          <p className="font-bold text-brand-navy">{r.itemName}</p>
                          <p className="text-xs text-muted-foreground mb-3">Tipo: {r.itemType}</p>
                          <Badge
                            className="mt-auto w-fit"
                            variant={
                              r.status === 'Aprovado'
                                ? 'default'
                                : r.status === 'Rejeitado'
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {r.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase">
                      EPIs Disponíveis
                    </h3>
                    <div className="space-y-3">
                      {ppes.filter((p) => p.availability > 0).length === 0 ? (
                        <p className="text-xs text-muted-foreground">Nenhum EPI disponível.</p>
                      ) : (
                        ppes
                          .filter((p) => p.availability > 0)
                          .map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between border-b pb-2"
                            >
                              <div>
                                <p className="font-medium text-sm">{p.name}</p>
                                <p className="text-xs text-muted-foreground">{p.category}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRentalRequest(p, 'EPI')}
                              >
                                Solicitar
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase">
                      Equipamentos para Locação
                    </h3>
                    <div className="space-y-3">
                      {equipments.filter((e) => e.rentalStatus === 'Disponível').length === 0 ? (
                        <p className="text-xs text-muted-foreground">
                          Nenhum equipamento disponível.
                        </p>
                      ) : (
                        equipments
                          .filter((e) => e.rentalStatus === 'Disponível')
                          .map((e) => (
                            <div
                              key={e.id}
                              className="flex items-center justify-between border-b pb-2"
                            >
                              <div>
                                <p className="font-medium text-sm">{e.type}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {e.specs}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRentalRequest(e, 'Equipamento')}
                              >
                                Solicitar
                              </Button>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mensagens">
          <div className="max-w-3xl mx-auto">
            <ChatWindow
              projectId={project.id}
              currentUserType="client"
              projectName={project.name}
            />
          </div>
        </TabsContent>

        <TabsContent value="chamados">
          <Card className="bg-white border-none shadow-sm mb-6">
            <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Histórico de Chamados</CardTitle>
              <Button size="sm" className="gap-1" onClick={() => setIsTicketDialogOpen(true)}>
                <Plus className="h-4 w-4" /> Novo Chamado
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhum chamado de suporte registrado.
                </div>
              ) : (
                <div className="divide-y">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          #{ticket.id} - {new Date(ticket.dateOpened).toLocaleDateString('pt-BR')}
                        </span>
                        <Badge
                          variant="outline"
                          className={
                            ticket.status === 'Resolvido'
                              ? 'bg-green-50 text-green-700'
                              : ticket.status === 'Em andamento'
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-red-50 text-red-700'
                          }
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{ticket.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Novo Chamado</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateTicket} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Descreva o problema ou solicitação</Label>
              <Textarea
                required
                value={newTicketDesc}
                onChange={(e) => setNewTicketDesc(e.target.value)}
                placeholder="Ex: Identifiquei uma pequena infiltração..."
                className="min-h-[100px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Enviar Solicitação
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
