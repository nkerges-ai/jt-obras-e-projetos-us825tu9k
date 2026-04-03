import { useState, useEffect } from 'react'
import {
  getCloudProjects,
  createCloudProject,
  updateCloudProject,
  deleteCloudProject,
  type CloudProject,
} from '@/services/projects'
import { getCustomers, type Customer } from '@/services/customers'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { HardHat, Plus, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

const calculateProgress = (start: string, deadlineDays: number) => {
  if (!start || !deadlineDays) return 0
  const elapsedDays = Math.floor(
    (new Date().getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24),
  )
  if (elapsedDays < 0) return 0
  if (elapsedDays >= deadlineDays) return 100
  return Math.floor((elapsedDays / deadlineDays) * 100)
}

export function CloudProjectsTab() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<CloudProject[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<CloudProject>>({ status: 'Planning' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterClient, setFilterClient] = useState('all')

  const loadData = async () => {
    const [p, c] = await Promise.all([getCloudProjects(), getCustomers()])
    setProjects(p)
    setCustomers(c)
  }
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('projects', () => loadData())
  useRealtime('customers', () => loadData())

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    try {
      const payload = {
        ...formData,
        total_value: Number(formData.total_value),
        deadline_days: Number(formData.deadline_days),
        start_date: new Date(formData.start_date!).toISOString(),
      }
      if (isEditing && formData.id) await updateCloudProject(formData.id, payload)
      else await createCloudProject(payload)
      setIsOpen(false)
      toast({ title: 'Sucesso', description: 'Obra salva com sucesso.' })
    } catch (err) {
      setFieldErrors(extractFieldErrors(err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar esta obra?')) return
    try {
      await deleteCloudProject(id)
      toast({ title: 'Sucesso', description: 'Obra removida.' })
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao remover.', variant: 'destructive' })
    }
  }

  const openNew = () => {
    setFormData({ status: 'Planning', start_date: new Date().toISOString().split('T')[0] })
    setIsEditing(false)
    setFieldErrors({})
    setIsOpen(true)
  }
  const openEdit = (p: CloudProject) => {
    setFormData({ ...p, start_date: p.start_date.split('T')[0] })
    setIsEditing(true)
    setFieldErrors({})
    setIsOpen(true)
  }

  const inExecProjects = projects.filter((p) => p.status === 'In Execution')
  const filteredProjects = projects.filter(
    (p) =>
      (filterStatus === 'all' || p.status === filterStatus) &&
      (filterClient === 'all' || p.client_id === filterClient),
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HardHat className="h-5 w-5 text-primary" /> Obras e Projetos
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie o andamento e custos de cada projeto em tempo real.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 font-bold w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Nova Obra
        </Button>
      </div>

      {inExecProjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {inExecProjects.map((p) => {
            const prog = calculateProgress(p.start_date, p.deadline_days)
            return (
              <Card key={p.id} className="border-blue-200 bg-blue-50/30">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg text-brand-navy">{p.name}</h4>
                      <p className="text-xs text-muted-foreground">{p.expand?.client_id?.name}</p>
                    </div>
                    <Badge className="bg-blue-500">Em Execução</Badge>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Progresso Estimado</span>
                      <span>{prog}%</span>
                    </div>
                    <Progress value={prog} className="h-2" />
                  </div>
                  <div className="mt-4 text-sm font-semibold">
                    Valor: {formatCurrency(p.total_value)}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 bg-secondary/20">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] bg-white">
              <SelectValue placeholder="Filtrar Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Planning">Planejamento</SelectItem>
              <SelectItem value="In Execution">Em Execução</SelectItem>
              <SelectItem value="Paused">Pausada</SelectItem>
              <SelectItem value="Completed">Concluída</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterClient} onValueChange={setFilterClient}>
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Filtrar Cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Clientes</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Obra</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Início</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{p.expand?.client_id?.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      p.status === 'Planning'
                        ? 'bg-yellow-50 text-yellow-700'
                        : p.status === 'In Execution'
                          ? 'bg-blue-50 text-blue-700'
                          : p.status === 'Completed'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-50 text-gray-700'
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(p.start_date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">{formatCurrency(p.total_value)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(p)}
                      className="h-8 w-8 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(p.id)}
                      className="h-8 w-8 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma obra encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Obra' : 'Nova Obra'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Cliente Vinculado</Label>
                <Select
                  value={formData.client_id || ''}
                  onValueChange={(v) => setFormData({ ...formData, client_id: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente..." />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.client_id && (
                  <span className="text-xs text-red-500">{fieldErrors.client_id}</span>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Nome da Obra</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                {fieldErrors.name && (
                  <span className="text-xs text-red-500">{fieldErrors.name}</span>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Endereço da Obra</Label>
                <Input
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
                {fieldErrors.address && (
                  <span className="text-xs text-red-500">{fieldErrors.address}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
                {fieldErrors.start_date && (
                  <span className="text-xs text-red-500">{fieldErrors.start_date}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Prazo de Entrega (Dias)</Label>
                <Input
                  type="number"
                  value={formData.deadline_days || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline_days: Number(e.target.value) })
                  }
                  required
                />
                {fieldErrors.deadline_days && (
                  <span className="text-xs text-red-500">{fieldErrors.deadline_days}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Valor Total da Obra (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.total_value || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, total_value: Number(e.target.value) })
                  }
                  required
                />
                {fieldErrors.total_value && (
                  <span className="text-xs text-red-500">{fieldErrors.total_value}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planejamento</SelectItem>
                    <SelectItem value="In Execution">Em Execução</SelectItem>
                    <SelectItem value="Paused">Pausada</SelectItem>
                    <SelectItem value="Completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.status && (
                  <span className="text-xs text-red-500">{fieldErrors.status}</span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Salvar Obra
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
