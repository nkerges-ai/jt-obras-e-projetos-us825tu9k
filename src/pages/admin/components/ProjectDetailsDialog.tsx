import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Project } from '@/lib/storage'
import { ProjectCostsTab } from './ProjectCostsTab'
import { ProjectGalleryTab } from './ProjectGalleryTab'
import { ProjectGanttTab } from './ProjectGanttTab'
import { ProjectInfoTab } from './ProjectInfoTab'

interface ProjectDetailsDialogProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateProject: (updated: Project) => void
}

export function ProjectDetailsDialog({
  project,
  open,
  onOpenChange,
  onUpdateProject,
}: ProjectDetailsDialogProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-brand-navy">{project.name}</DialogTitle>
          <DialogDescription>
            Cliente: {project.client} | Status: {project.status}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 mt-4">
          <Tabs defaultValue="detalhes" className="w-full">
            <TabsList className="w-full grid grid-cols-4 mb-4">
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="custos">Financeiro</TabsTrigger>
              <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
              <TabsTrigger value="galeria">Galeria</TabsTrigger>
            </TabsList>

            <TabsContent value="detalhes" className="m-0">
              <ProjectInfoTab project={project} onUpdate={onUpdateProject} />
            </TabsContent>

            <TabsContent value="custos" className="m-0">
              <ProjectCostsTab project={project} onUpdate={onUpdateProject} />
            </TabsContent>

            <TabsContent value="cronograma" className="m-0">
              <ProjectGanttTab project={project} onUpdate={onUpdateProject} />
            </TabsContent>

            <TabsContent value="galeria" className="m-0">
              <ProjectGalleryTab project={project} onUpdate={onUpdateProject} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
