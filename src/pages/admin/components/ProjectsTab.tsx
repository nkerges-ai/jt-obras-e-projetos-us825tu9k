import { useState, useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import { Plus, Briefcase, ExternalLink } from 'lucide-react'
import { getProjects, saveProjects, Project, ProjectStatus } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { ProjectDetailsDialog } from './ProjectDetailsDialog'

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const updated = projects.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    setProjects(updated)
    saveProjects(updated)
    toast({ title: 'Status atualizado', description: 'O andamento da obra foi modificado.' })
  }

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    setProjects(updatedList)
    saveProjects(updatedList)
    setSelectedProject(updatedProject)
  }

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Em orçamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const addMockProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'Nova Obra Residencial',
      client: 'Novo Cliente',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Em orçamento',
      budget: 0,
      expenses: [],
      photos: [],
    }
    const updated = [newProject, ...projects]
    setProjects(updated)
    saveProjects(updated)
    toast({ title: 'Projeto Adicionado', description: 'Novo projeto incluído no painel.' })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" /> Painel de Obras
          </h3>
          <p className="text-muted-foreground text-sm">
            Acompanhe custos, evolução e status dos projetos.
          </p>
        </div>
        <Button onClick={addMockProject} className="gap-2 font-bold w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhuma obra cadastrada.
                </TableCell>
              </TableRow>
            )}
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={project.status}
                    onValueChange={(val) => handleStatusChange(project.id, val as ProjectStatus)}
                  >
                    <SelectTrigger
                      className={`w-[150px] h-8 text-xs font-semibold rounded-full border ${getStatusColor(project.status)}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Em orçamento">Em orçamento</SelectItem>
                      <SelectItem value="Em andamento">Em andamento</SelectItem>
                      <SelectItem value="Concluído">Concluído</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(project)}
                    className="text-primary gap-1"
                  >
                    Gerenciar <ExternalLink className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProjectDetailsDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onUpdateProject={handleUpdateProject}
      />
    </div>
  )
}
