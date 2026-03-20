import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
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
} from 'lucide-react'
import { getProjects, getTickets, saveTickets, Project, Ticket } from '@/lib/storage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export default function ClientDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const projectId = sessionStorage.getItem('client_project_id')

  const [project, setProject] = useState<Project | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [newTicketDesc, setNewTicketDesc] = useState('')

  useEffect(() => {
    if (projectId) {
      const p = getProjects().find((p) => p.id === projectId)
      if (p) setProject(p)
      const allTickets = getTickets()
      setTickets(allTickets.filter((t) => t.projectId === projectId))
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

  const antes = project.photos.filter((p) => p.type === 'Antes')
  const depois = project.photos.filter((p) => p.type === 'Depois')

  const mockDocs = [
    {
      id: 1,
      name: 'Contrato_Prestacao_Servicos_Assinado.pdf',
      date: project.startDate,
      size: '2.4 MB',
    },
    { id: 2, name: 'ART_Projeto_Estrutural.pdf', date: project.startDate, size: '1.1 MB' },
  ]

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen max-w-5xl">
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

      <Tabs defaultValue="resumo" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
          <TabsTrigger
            value="resumo"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" /> Resumo e Fotos
          </TabsTrigger>
          <TabsTrigger
            value="documentos"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <FileText className="h-4 w-4 mr-2" /> Meus Documentos
          </TabsTrigger>
          <TabsTrigger
            value="chamados"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <Headset className="h-4 w-4 mr-2" /> Chamados e Suporte
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="documentos">
          <Card className="bg-white border-none shadow-sm">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Documentos Associados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {mockDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium text-brand-navy">{doc.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Enviado em {new Date(doc.date).toLocaleDateString('pt-BR')} • {doc.size}
                        </p>
                      </div>
                    </div>
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
