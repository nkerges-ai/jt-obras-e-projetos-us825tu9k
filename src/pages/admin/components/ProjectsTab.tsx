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
import { Plus, Briefcase, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { getProjects, saveProjects, Project, ProjectStatus, addLog } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { ProjectDetailsDialog } from './ProjectDetailsDialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false)
  const { toast } = useToast()

  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Em orçamento' as ProjectStatus,
  })

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    const project = projects.find((p) => p.id === projectId)
    const updated = projects.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p))
    setProjects(updated)
    saveProjects(updated)

    if (project && project.status !== newStatus) {
      addLog({
        type: 'WhatsApp',
        recipient: project.client,
        message: `Aviso Automático: O status da obra "${project.name}" foi atualizado para: ${newStatus}.`,
        status: 'Enviado',
      })
    }

    toast({
      title: 'Status atualizado',
      description: 'O andamento da obra foi modificado e o cliente notificado.',
    })
  }

  const handleUpdateProject = (updatedProject: Project) => {
    const updatedList = projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    setProjects(updatedList)
    saveProjects(updatedList)
    setSelectedProject(updatedProject)
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name || !newProject.client || !newProject.startDate) return

    const proj: Project = {
      id: Date.now().toString(),
      name: newProject.name,
      client: newProject.client,
      startDate: newProject.startDate,
      status: newProject.status,
      budget: 0,
      expenses: [],
      photos: [],
      phases: [],
    }

    const updated = [proj, ...projects]
    setProjects(updated)
    saveProjects(updated)
    setIsNewProjectOpen(false)
    setNewProject({
      name: '',
      client: '',
      startDate: new Date().toISOString().split('T')[0],
      status: 'Em orçamento',
    })
    toast({ title: 'Projeto Adicionado', description: 'Novo projeto incluído no painel.' })

    // Simulate Push Notification
    if ('Notification' in window) {
      const showNotification = () => {
        const notification = new Notification('Nova Obra Atribuída', {
          body: `Equipe designada para a obra: ${proj.name}. Toque para abrir os detalhes.`,
          icon: 'https://img.usecurling.com/i?q=building&color=orange&shape=fill',
        })
        notification.onclick = () => {
          window.focus()
          setSelectedProject(proj)
        }
      }

      if (Notification.permission === 'granted') {
        showNotification()
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            showNotification()
          }
        })
      }
    }
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
        <Button
          onClick={() => setIsNewProjectOpen(true)}
          className="gap-2 font-bold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Novo Projeto
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm w-full overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[600px] md:min-w-full">
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
                    Nenhum projeto encontrado.
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
                    <div className="flex justify-end gap-2 items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => {
                          const link = `${window.location.origin}/projeto/${project.id}/galeria`
                          navigator.clipboard.writeText(link)
                          toast({
                            title: 'Link Copiado',
                            description: 'O link de Atualização da Obra foi copiado.',
                          })
                        }}
                        title="Copiar Link de Atualização da Obra"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                        className="text-primary gap-1 px-2"
                      >
                        Gerenciar <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProjectDetailsDialog
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onUpdateProject={handleUpdateProject}
      />

      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Projeto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Projeto / Obra</Label>
              <Input
                required
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Ex: Reforma Predial Bloco A"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome do Cliente</Label>
              <Input
                required
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                placeholder="Ex: Condomínio Residencial"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Input
                  type="date"
                  required
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status Inicial</Label>
                <Select
                  required
                  value={newProject.status}
                  onValueChange={(v) =>
                    setNewProject({ ...newProject, status: v as ProjectStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Em orçamento">Em orçamento</SelectItem>
                    <SelectItem value="Em andamento">Em andamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Criar Projeto
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
