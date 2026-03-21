import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Project, ConstructionReport, addLog } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import {
  MessageCircle,
  Upload,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  RefreshCw,
  FileText,
  SplitSquareHorizontal,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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

  const [comparisons, setComparisons] = useState<
    { id: string; before: string; after: string; label: string }[]
  >([])
  const [selectedReports, setSelectedReports] = useState<string[]>([])
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

  const handleComparisonChange = (index: number, type: 'before' | 'after', file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const newCmp = [...comparisons]
      newCmp[index][type] = e.target?.result as string
      setComparisons(newCmp)
    }
    reader.readAsDataURL(file)
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
      comparisons: comparisons.filter((c) => c.before && c.after),
      status: 'Pendente',
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
    setComparisons([])
    toast({
      title: 'Relatório Criado',
      description: 'O relatório foi salvo e está aguardando validação do cliente.',
    })
  }

  const handleDeleteReport = (id: string) => {
    onUpdate({ ...project, reports: (project.reports || []).filter((r) => r.id !== id) })
    setSelectedReports(selectedReports.filter((rId) => rId !== id))
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
        `Por favor, acesse a Área do Cliente para validar o relatório e ver as fotos completas:\n${link}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
    addLog({
      type: 'WhatsApp',
      recipient: project.client,
      message: `Relatório de Obra enviado solicitando aprovação (Progresso: ${report.progress}%)`,
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

        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-bold text-brand-navy">Comparações Antes e Depois</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() =>
                setComparisons([
                  ...comparisons,
                  { id: `cmp_${Date.now()}`, before: '', after: '', label: '' },
                ])
              }
            >
              <SplitSquareHorizontal className="h-4 w-4 mr-2" /> Adicionar Par
            </Button>
          </div>
          {comparisons.map((cmp, index) => (
            <div
              key={cmp.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="space-y-2">
                <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Situação Inicial (Antes)
                </Label>
                <div className="border border-dashed rounded p-2 text-center relative hover:bg-gray-50 transition-colors h-28">
                  {cmp.before ? (
                    <img src={cmp.before} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      Upload Antes
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    accept="image/*"
                    onChange={(e) => handleComparisonChange(index, 'before', e.target.files?.[0])}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-brand-light uppercase tracking-wider">
                  Situação Atual (Depois)
                </Label>
                <div className="border border-dashed rounded p-2 text-center relative hover:bg-gray-50 transition-colors h-28">
                  {cmp.after ? (
                    <img src={cmp.after} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      Upload Depois
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    accept="image/*"
                    onChange={(e) => handleComparisonChange(index, 'after', e.target.files?.[0])}
                  />
                </div>
              </div>
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <Label className="text-xs">Descrição do Local/Atividade</Label>
                  <Input
                    value={cmp.label}
                    onChange={(e) => {
                      const newCmp = [...comparisons]
                      newCmp[index].label = e.target.value
                      setComparisons(newCmp)
                    }}
                    placeholder="Ex: Fachada Sul - Pintura"
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 self-end"
                  onClick={() => setComparisons(comparisons.filter((_, i) => i !== index))}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Remover Par
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t border-gray-200">
          <Label className="text-sm font-bold text-brand-navy">Galeria de Imagens Livres</Label>
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
              {isUploading ? 'Carregando...' : 'Selecionar Fotos Extras'}
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
        <div className="pt-4 flex justify-end">
          <Button type="submit" className="gap-2 h-11 px-8">
            <CheckCircle2 className="h-4 w-4" /> Salvar Relatório
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="font-bold text-lg text-brand-navy border-b pb-2">Histórico e Validações</h3>

        {selectedReports.length > 0 && (
          <div className="bg-brand-navy p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center text-white mb-6 shadow-md gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3 font-semibold">
              <FileText className="h-5 w-5 text-brand-light" />
              <span>
                {selectedReports.length}{' '}
                {selectedReports.length === 1 ? 'relatório selecionado' : 'relatórios selecionados'}
              </span>
            </div>
            <Button
              className="bg-brand-light hover:bg-[#008cc9] text-white whitespace-nowrap"
              asChild
            >
              <Link
                to={`/admin/print/dossier/${project.id}?reports=${selectedReports.join(',')}`}
                target="_blank"
              >
                Gerar Dossiê da Obra (PDF)
              </Link>
            </Button>
          </div>
        )}

        {!project.reports || project.reports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-xl">
            Nenhum relatório gerado para esta obra ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {project.reports
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((report) => (
                <div
                  key={report.id}
                  className={cn(
                    'bg-white border-2 rounded-xl p-5 shadow-sm transition-all',
                    selectedReports.includes(report.id) ? 'border-primary' : 'border-gray-100',
                  )}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b pb-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedReports([...selectedReports, report.id])
                          else setSelectedReports(selectedReports.filter((id) => id !== report.id))
                        }}
                        className="h-5 w-5 data-[state=checked]:bg-primary"
                      />
                      <div className="bg-primary/10 p-2 rounded-lg text-primary ml-1">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-base text-brand-navy flex items-center gap-2">
                          Relatório de {new Date(report.date).toLocaleDateString('pt-BR')}
                          {report.syncStatus === 'pending' && (
                            <Badge className="bg-amber-500 hover:bg-amber-600 text-black text-[9px] h-5 px-1.5 shadow-none gap-1">
                              <RefreshCw className="h-2.5 w-2.5" />
                            </Badge>
                          )}
                        </h5>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                            Progresso: {report.progress}%
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-[10px] uppercase tracking-wider',
                              report.status === 'Aprovado'
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-yellow-50 text-yellow-700 border-yellow-200',
                            )}
                          >
                            {report.status || 'Pendente'}
                          </Badge>
                          {report.signature && (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-blue-50 text-blue-700 border-blue-200 uppercase tracking-wider"
                            >
                              Termo de Visita
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {report.signature && (
                        <Button variant="outline" size="sm" asChild className="h-9">
                          <Link
                            to={`/admin/print/termo/${project.id}?reportId=${report.id}`}
                            target="_blank"
                          >
                            Imprimir Termo
                          </Link>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 border-green-200 hover:bg-green-50 flex-1 sm:flex-none h-9"
                        onClick={() => handleSendWhatsApp(report)}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" /> Enviar para Validação
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9 w-9"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap mb-4">{report.summary}</p>

                  {report.comparisons && report.comparisons.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        Evolução (Antes e Depois)
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {report.comparisons.map((cmp) => (
                          <div
                            key={cmp.id}
                            className="bg-gray-50 rounded border p-1.5 flex gap-1 items-center justify-center relative group overflow-hidden"
                          >
                            <img src={cmp.before} className="w-1/2 h-16 object-cover rounded-sm" />
                            <img src={cmp.after} className="w-1/2 h-16 object-cover rounded-sm" />
                            {cmp.label && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity p-2 text-center">
                                {cmp.label}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.photos && report.photos.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                        Galeria de Imagens
                      </p>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
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
