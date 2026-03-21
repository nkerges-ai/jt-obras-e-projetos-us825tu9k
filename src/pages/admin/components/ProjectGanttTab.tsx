import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Project, ProjectPhase } from '@/lib/storage'
import { Plus, Trash2 } from 'lucide-react'
import { GanttChart } from '@/components/GanttChart'

interface ProjectGanttTabProps {
  project: Project
  onUpdate: (updated: Project) => void
}

export function ProjectGanttTab({ project, onUpdate }: ProjectGanttTabProps) {
  const phases = project.phases || []

  const [newPhase, setNewPhase] = useState<Partial<ProjectPhase>>({
    name: 'Fundação',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    progress: 0,
  })

  const handleAddPhase = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPhase.name || !newPhase.startDate || !newPhase.endDate) return

    const phase: ProjectPhase = {
      id: `ph_${Date.now()}`,
      name: newPhase.name,
      startDate: newPhase.startDate,
      endDate: newPhase.endDate,
      progress: Number(newPhase.progress) || 0,
    }

    onUpdate({ ...project, phases: [...phases, phase] })
    setNewPhase({
      name: '',
      startDate: phase.endDate,
      endDate: '',
      progress: 0,
    })
  }

  const handleDeletePhase = (id: string) => {
    onUpdate({ ...project, phases: phases.filter((p) => p.id !== id) })
  }

  const handleUpdateProgress = (id: string, progress: number) => {
    const updatedPhases = phases.map((p) => (p.id === id ? { ...p, progress } : p))
    onUpdate({ ...project, phases: updatedPhases })
  }

  return (
    <div className="space-y-8 pt-4">
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-brand-navy">Cronograma Visual (Gantt)</h3>
        <GanttChart phases={phases} />
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-secondary/30">
          <h4 className="font-bold text-brand-navy">Fases do Projeto</h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fase</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead>Progresso (%)</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phases.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Adicione as fases abaixo para construir o cronograma.
                </TableCell>
              </TableRow>
            )}
            {phases.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>{new Date(p.startDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{new Date(p.endDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={p.progress}
                    onChange={(e) => handleUpdateProgress(p.id, Number(e.target.value))}
                    className="w-20 h-8 text-center"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePhase(p.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <form
        onSubmit={handleAddPhase}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end bg-secondary/20 p-4 rounded-xl border border-dashed"
      >
        <div className="space-y-2 md:col-span-2">
          <Label>Nome da Fase (Ex: Alvenaria)</Label>
          <Input
            value={newPhase.name}
            onChange={(e) => setNewPhase({ ...newPhase, name: e.target.value })}
            required
            placeholder="Ex: Fundação"
          />
        </div>
        <div className="space-y-2">
          <Label>Data de Início</Label>
          <Input
            type="date"
            value={newPhase.startDate}
            onChange={(e) => setNewPhase({ ...newPhase, startDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Data Final</Label>
          <Input
            type="date"
            value={newPhase.endDate}
            onChange={(e) => setNewPhase({ ...newPhase, endDate: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2">
          <Plus className="h-4 w-4" /> Adicionar
        </Button>
      </form>
    </div>
  )
}
