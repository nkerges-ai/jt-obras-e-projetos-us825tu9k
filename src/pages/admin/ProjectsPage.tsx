import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getCloudProjects, CloudProject, deleteCloudProject } from '@/services/projects'
import { getCustomers, Customer } from '@/services/customers'
import { useRealtime } from '@/hooks/use-realtime'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import { ProgressCards } from '@/components/admin/ProgressCards'
import { useToast } from '@/components/ui/use-toast'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<CloudProject[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [clientFilter, setClientFilter] = useState<string>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<CloudProject | null>(null)
  const { toast } = useToast()

  const loadData = async () => {
    try {
      const [projs, custs] = await Promise.all([getCloudProjects(), getCustomers()])
      setProjects(projs)
      setCustomers(custs)
    } catch (err) {
      console.error('Failed to load projects/customers', err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('projects', () => loadData())
  useRealtime('customers', () => loadData())

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      const matchClient = clientFilter === 'all' || p.client_id === clientFilter
      return matchSearch && matchStatus && matchClient
    })
  }, [projects, search, statusFilter, clientFilter])

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir esta obra? Esta ação é irreversível.'))
      return
    try {
      await deleteCloudProject(id)
      toast({ title: 'Obra excluída com sucesso.' })
    } catch (err) {
      toast({ title: 'Erro ao excluir obra.', variant: 'destructive' })
    }
  }

  const handleEdit = (project: CloudProject) => {
    setEditingProject(project)
    setIsFormOpen(true)
  }

  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in-up bg-[#0f172a] min-h-screen text-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HardHat className="h-8 w-8 text-[#3498db]" />
            Obras e Projetos
          </h1>
          <p className="text-slate-400 mt-2">
            Gerencie todas as obras ativas e concluídas de seus clientes.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProject(null)
            setIsFormOpen(true)
          }}
          className="w-full sm:w-auto bg-[#3498db] hover:bg-[#2980b9] text-white shadow-md h-10 px-5"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Obra
        </Button>
      </div>

      <ProgressCards projects={projects} />

      <div className="bg-[#1e293b] p-5 rounded-xl shadow-sm border border-slate-800 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome da obra..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-800 border-slate-700 text-white"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Planning">Planejamento</SelectItem>
              <SelectItem value="In Execution">Em Execução</SelectItem>
              <SelectItem value="Paused">Pausada</SelectItem>
              <SelectItem value="Completed">Concluída</SelectItem>
            </SelectContent>
          </Select>
          <Select value={clientFilter} onValueChange={setClientFilter}>
            <SelectTrigger className="w-full md:w-[250px] bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Cliente" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all">Todos os Clientes</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProjectsTable projects={filteredProjects} onEdit={handleEdit} onDelete={handleDelete} />

      {isFormOpen && (
        <ProjectForm
          project={editingProject}
          customers={customers}
          onClose={() => {
            setIsFormOpen(false)
            setEditingProject(null)
          }}
        />
      )}
    </div>
  )
}
