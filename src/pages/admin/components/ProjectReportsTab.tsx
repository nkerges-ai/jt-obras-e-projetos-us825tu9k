import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Project, ConstructionReport, addLog } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import {
  MessageCircle,
  Upload,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ProjectReportsTabProps {
  project: Project
  onUpdate: (updated: Project) => void
}

export function ProjectReportsTab({ project, onUpdate }: ProjectReportsTabProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [newReport, setNewReport] = useState<Partial<ConstructionReport>>({
    date: new Date().toISOString().split('T')[0],
    progress:
      project.phases && project.phases.length > 0
        ? Math.round(project.phases.reduce((acc, p) => acc + p.progress, 0) / project.phases.length)
        : 0,
    summary: '',
    photos: [],
  })

  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setIsUploading(true)

    const newPhotos: string[] = []
    let loaded = 0

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        newPhotos.push(event.target?.result as string)
        loaded++
        if (loaded === files.length) {
          setNewReport((prev) => ({ ...prev, photos: [...(prev.photos || []), ...newPhotos] }))
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReport.summary || !newReport.date) return

    const report: ConstructionReport = {
      id: `rep_${Date.now()}`,
      date: newReport.date,
      progress: Number(newReport.progress) || 0,
      summary: newReport.summary,
      photos: newReport.photos || [],
      syncStatus: navigator.onLine ? 'synced' : 'pending',
    }

    onUpdate({ ...project, reports: [report, ...(project.reports || [])] })
    window.dispatchEvent(new Event('jt_reports_updated'))

    setNewReport({
      date: new Date().toISOString().split('T')[0],
      progress: report.progress,
      summary: '',
      photos: [],
    })
    toast({
      title: 'Relatório Criado',
      description: 'O relatório foi salvo e pode ser enviado ao cliente.',
    })
  }

  const handleDeleteReport = (id: string) => {
    onUpdate({ ...project, reports: (project.reports || []).filter((r) => r.id !== id) })
    window.dispatchEvent(new Event('jt_reports_updated'))
    toast({ title: 'Relatório Removido', description: 'O relatório foi apagado do histórico.' })
  }

  const handleSendWhatsApp = (report: ConstructionReport) => {
    const link = `${window.location.origin}/projeto/${project.id}/galeria`
    const text = encodeURIComponent(
      `Olá! Segue a atualização da obra *${project.name}*:\n\n` +
        `📅 *Data:* ${new Date(report.date).toLocaleDateString('pt-BR')}\n` +
        `📈 *Progresso Geral:* ${report.progress}%\n\n` +
        `📝 *Resumo do Período:*\n${report.summary}\n\n` +
        `Acesse a Área do Cliente para ver as fotos e detalhes completos:\n${link}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
    addLog({
      type: 'WhatsApp',
      recipient: project.client,
      message: `Relatório de Obra enviado (Progresso: ${report.progress}%)`,
      status: 'Enviado',
    })
  }

  return (
    <div className="space-y-8 pt-4">
      <form
        onSubmit={handleAddReport}
        className="bg-secondary/20 p-5 rounded-xl border border-dashed space-y-4"
      >
        <h4 className="font-bold text-brand-navy flex items-center gap-2">
          <Plus className="h-4 w-4" /> Novo Relatório de Acompanhamento
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Data do Relatório</Label>
            <Input
              type="date"
              required
              value={newReport.date}
              onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <Label>Progresso Geral da Obra (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              required
              value={newReport.progress}
              onChange={(e) => setNewReport({ ...newReport, progress: Number(e.target.value) })}
              className="bg-white"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Resumo Descritivo das Atividades</Label>
          <Textarea
            required
            value={newReport.summary}
            onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
            placeholder="Descreva o que foi realizado neste período, os próximos passos e eventuais pendências..."
            className="min-h-[100px] bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label>Anexar Fotos ao Relatório</Label>
          <div className="flex gap-4 items-start flex-col sm:flex-row">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              multiple
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="bg-white shrink-0"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Carregando...' : 'Selecionar Fotos'}
            </Button>
            {newReport.photos && newReport.photos.length > 0 && (
              <div className="flex gap-2 overflow-x-auto w-full pb-2">
                {newReport.photos.map((p, i) => (
                  <div key={i} className="relative w-16 h-16 rounded border shrink-0">
                    <img src={p} alt="Anexo" className="w-full h-full object-cover rounded" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="pt-2 border-t flex justify-end">
          <Button type="submit" className="gap-2">
            <CheckCircle2 className="h-4 w-4" /> Salvar Relatório
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Histórico de Relatórios</h3>

        {!project.reports || project.reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-xl">
            Nenhum relatório gerado para esta obra ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {project.reports
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((report) => (
                <div key={report.id} className="bg-white border rounded-xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-base text-brand-navy flex items-center gap-2">
                          Relatório de {new Date(report.date).toLocaleDateString('pt-BR')}
                          {report.syncStatus === 'pending' && (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-black text-[9px] h-5 px-1.5 shadow-none gap-1">
                              <RefreshCw className="h-2.5 w-2.5" /> Pendente
                            </Badge>
                          )}
                        </h5>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200 mt-1 inline-block">
                          Progresso: {report.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 flex-1 sm:flex-none"
                        onClick={() => handleSendWhatsApp(report)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" /> Enviar Cliente
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{report.summary}</p>

                  {report.photos && report.photos.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {report.photos.map((photo, i) => (
                        <div key={i} className="aspect-square rounded border overflow-hidden">
                          <img
                            src={photo}
                            alt="Foto Relatório"
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
