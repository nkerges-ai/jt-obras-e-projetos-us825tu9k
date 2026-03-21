import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Project, ProjectStatus } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Save } from 'lucide-react'

interface ProjectInfoTabProps {
  project: Project
  onUpdate: (updated: Project) => void
}

export function ProjectInfoTab({ project, onUpdate }: ProjectInfoTabProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: project.name,
    client: project.client,
    startDate: project.startDate,
    endDate: project.endDate || '',
    description: project.description || '',
    technicalResponsible: project.technicalResponsible || '',
    status: project.status,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.client || !formData.startDate || !formData.status) {
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    onUpdate({
      ...project,
      ...formData,
    })

    toast({
      title: 'Alterações Salvas',
      description: 'As informações do projeto foram atualizadas.',
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 pt-4 bg-white p-6 rounded-xl border shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>
            Nome do Projeto <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Reforma da Fachada"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Nome do Cliente <span className="text-red-500">*</span>
          </Label>
          <Input
            required
            value={formData.client}
            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
            placeholder="Ex: Condomínio Edifício XYZ"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Data de Início <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Data Fim (Estimada)</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>
            Status do Projeto <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(v) => setFormData({ ...formData, status: v as ProjectStatus })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Em orçamento">Em orçamento</SelectItem>
              <SelectItem value="Em andamento">Em andamento</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Responsável Técnico (Profissional)</Label>
          <Input
            value={formData.technicalResponsible}
            onChange={(e) => setFormData({ ...formData, technicalResponsible: e.target.value })}
            placeholder="Ex: Eng. João Silva"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Descrição do Projeto</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Forneça os detalhes principais sobre o escopo, condições e observações..."
            className="min-h-[120px]"
          />
        </div>
      </div>
      <div className="flex justify-end pt-4 border-t">
        <Button type="submit" className="gap-2 font-bold px-8">
          <Save className="h-4 w-4" /> Salvar Alterações
        </Button>
      </div>
    </form>
  )
}
