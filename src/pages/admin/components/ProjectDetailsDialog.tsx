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
import { ProjectReportsTab } from './ProjectReportsTab'

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
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl text-brand-navy">{project.name}</DialogTitle>
          <DialogDescription>
            Cliente: {project.client} | Status: {project.status}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-4 pb-4">
          <Tabs defaultValue="detalhes" className="w-full">
            <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 mb-4 h-auto">
              <TabsTrigger value="detalhes" className="py-2">
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="custos" className="py-2">
                Financeiro
              </TabsTrigger>
              <TabsTrigger value="cronograma" className="py-2">
                Cronograma
              </TabsTrigger>
              <TabsTrigger value="galeria" className="py-2">
                Galeria
              </TabsTrigger>
              <TabsTrigger value="relatorios" className="py-2 col-span-2 md:col-span-1">
                Relatórios
              </TabsTrigger>
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

            <TabsContent value="relatorios" className="m-0">
              <ProjectReportsTab project={project} onUpdate={onUpdateProject} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
