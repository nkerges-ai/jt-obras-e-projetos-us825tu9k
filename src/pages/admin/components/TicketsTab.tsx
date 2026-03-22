import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Headset, Plus, ExternalLink } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getTickets,
  saveTickets,
  Ticket,
  TicketStatus,
  getProjects,
  Project,
  addLog,
} from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function TicketsTab() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)

  const [newTicket, setNewTicket] = useState<Partial<Ticket>>({
    clientName: '',
    projectId: '',
    description: '',
  })

  useEffect(() => {
    setTickets(getTickets())
    setProjects(getProjects())
  }, [])

  const handleUpdateTicket = (updated: Ticket) => {
    const oldTicket = tickets.find((t) => t.id === updated.id)
    const newList = tickets.map((t) => (t.id === updated.id ? updated : t))
    setTickets(newList)
    saveTickets(newList)
    setSelectedTicket(updated)

    if (oldTicket && oldTicket.status !== updated.status) {
      addLog({
        type: 'WhatsApp',
        recipient: updated.clientName,
        message: `Aviso Automático: O status do seu chamado #${updated.id} mudou para: ${updated.status}.`,
        status: 'Enviado',
      })
    }

    toast({
      title: 'Chamado Atualizado',
      description: 'As alterações foram salvas e notificadas.',
    })
  }

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicket.clientName || !newTicket.projectId || !newTicket.description) return

    const ticket: Ticket = {
      id: `t_${Date.now()}`,
      clientName: newTicket.clientName,
      projectId: newTicket.projectId,
      description: newTicket.description,
      dateOpened: new Date().toISOString(),
      status: 'Aberto',
      internalNotes: '',
    }

    const updated = [ticket, ...tickets]
    setTickets(updated)
    saveTickets(updated)
    setIsNewDialogOpen(false)
    setNewTicket({ clientName: '', projectId: '', description: '' })
    toast({
      title: 'Chamado Registrado',
      description: 'Novo ticket de suporte criado com sucesso.',
    })
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Resolvido':
        return 'bg-green-100 text-green-800'
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-red-100 text-red-800'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Headset className="h-5 w-5 text-primary" /> Sistema de Chamados e Suporte
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie requisições de manutenção pós-obra e agendamentos de reparos.
          </p>
        </div>
        <Button
          onClick={() => setIsNewDialogOpen(true)}
          className="gap-2 font-bold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Novo Chamado
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Protocolo / Data</TableHead>
              <TableHead>Cliente e Obra</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum chamado registrado.
                </TableCell>
              </TableRow>
            )}
            {tickets.map((ticket) => {
              const project = projects.find((p) => p.id === ticket.projectId)
              return (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="font-medium text-xs text-muted-foreground">#{ticket.id}</div>
                    <div className="text-sm">
                      {new Date(ticket.dateOpened).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.clientName}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {project?.name || 'Obra não encontrada'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-semibold',
                        getStatusColor(ticket.status),
                      )}
                    >
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTicket(ticket)}
                      className="text-primary gap-1"
                    >
                      Gerenciar <ExternalLink className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abertura de Novo Chamado</DialogTitle>
            <DialogDescription>Preencha os dados da requisição do cliente.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateTicket} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Cliente / Solicitante</Label>
              <Input
                required
                value={newTicket.clientName}
                onChange={(e) => setNewTicket({ ...newTicket, clientName: e.target.value })}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div className="space-y-2">
              <Label>Referente à Obra</Label>
              <Select
                required
                value={newTicket.projectId}
                onValueChange={(v) => setNewTicket({ ...newTicket, projectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o projeto" />
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
            <div className="space-y-2">
              <Label>Descrição do Problema</Label>
              <Textarea
                required
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Descreva o que precisa ser verificado/reparado..."
              />
            </div>
            <Button type="submit" className="w-full">
              Registrar Chamado
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        {selectedTicket && (
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between pr-8">
                <span>Chamado #{selectedTicket.id}</span>
                <span
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-semibold',
                    getStatusColor(selectedTicket.status),
                  )}
                >
                  {selectedTicket.status}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-lg">
                <div>
                  <span className="text-muted-foreground block mb-1">Cliente:</span>
                  <span className="font-semibold">{selectedTicket.clientName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block mb-1">Obra Referência:</span>
                  <span className="font-semibold">
                    {projects.find((p) => p.id === selectedTicket.projectId)?.name || 'N/A'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block mb-1">Descrição Registrada:</span>
                  <p className="bg-white p-3 rounded border text-gray-700 whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold border-b pb-2">Gestão do Chamado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Atualizar Status</Label>
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(v) =>
                        handleUpdateTicket({ ...selectedTicket, status: v as TicketStatus })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aberto">Aberto (Não iniciado)</SelectItem>
                        <SelectItem value="Em andamento">Em andamento</SelectItem>
                        <SelectItem value="Resolvido">Resolvido / Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Anotações Internas da Equipe (Opcional)</Label>
                  <Textarea
                    value={selectedTicket.internalNotes}
                    onChange={(e) =>
                      handleUpdateTicket({ ...selectedTicket, internalNotes: e.target.value })
                    }
                    placeholder="Adicione notas sobre a resolução, materiais extras necessários, etc..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  className="gap-2 text-[#25D366] border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#20b858]"
                  onClick={() => {
                    const text = encodeURIComponent(
                      `Olá ${selectedTicket.clientName}! Somos da JT Obras. Recebemos o seu chamado referente à manutenção.`,
                    )
                    window.open(`https://wa.me/?text=${text}`, '_blank')
                  }}
                >
                  <WhatsAppIcon className="h-4 w-4" /> Contatar Cliente
                </Button>
                <Button onClick={() => setSelectedTicket(null)}>Fechar</Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
