import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Download, Trash, Edit, Plus, X, FileText } from 'lucide-react'

const formatCPF = (val: string) => {
  let v = val.replace(/\D/g, '')
  if (v.length > 11) v = v.slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return v
}

interface AttendanceEntry {
  id?: string
  name: string
  cpf: string
  presence: boolean
  observations: string
}

export function CertificatesTab() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('list')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    nr_type: 'NR-35',
    collaborator_name: '',
    collaborator_cpf: '',
    training_date: '',
    hours: 8,
    technician_cpf: '',
    technician_signature: null as File | null,
  })
  const [currentSignatureUrl, setCurrentSignatureUrl] = useState('')
  const [attendance, setAttendance] = useState<AttendanceEntry[]>([])

  const fetchCertificates = async () => {
    try {
      const records = await pb.collection('certificates').getFullList({ sort: '-created' })
      setCertificates(records)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const resetForm = () => {
    setFormData({
      nr_type: 'NR-35',
      collaborator_name: '',
      collaborator_cpf: '',
      training_date: '',
      hours: 8,
      technician_cpf: '',
      technician_signature: null,
    })
    setAttendance([])
    setEditingId(null)
    setCurrentSignatureUrl('')
    setErrors({})
  }

  const handleEdit = async (cert: any) => {
    setFormData({
      nr_type: cert.nr_type,
      collaborator_name: cert.collaborator_name,
      collaborator_cpf: cert.collaborator_cpf || '',
      training_date: cert.training_date ? cert.training_date.split('T')[0] : '',
      hours: cert.hours,
      technician_cpf: cert.technician_cpf || '',
      technician_signature: null,
    })
    setEditingId(cert.id)
    if (cert.technician_signature) {
      setCurrentSignatureUrl(pb.files.getUrl(cert, cert.technician_signature))
    } else {
      setCurrentSignatureUrl('')
    }

    try {
      const lists = await pb
        .collection('attendance_lists')
        .getFullList({ filter: `certificate_id="${cert.id}"` })
      setAttendance(
        lists.map((l) => ({
          id: l.id,
          name: l.name,
          cpf: l.cpf || '',
          presence: l.presence,
          observations: l.observations || '',
        })),
      )
    } catch (e) {
      console.error(e)
    }

    setActiveTab('new')
  }

  const handleSave = async (status: 'draft' | 'completed') => {
    setLoading(true)
    setErrors({})
    try {
      const data = new FormData()
      data.append('user_id', user.id)
      data.append('nr_type', formData.nr_type)
      data.append('collaborator_name', formData.collaborator_name)
      if (formData.collaborator_cpf) data.append('collaborator_cpf', formData.collaborator_cpf)
      data.append(
        'training_date',
        formData.training_date ? new Date(formData.training_date).toISOString() : '',
      )
      data.append('hours', String(formData.hours))
      if (formData.technician_cpf) data.append('technician_cpf', formData.technician_cpf)
      data.append('status', status)
      if (formData.technician_signature) {
        data.append('technician_signature', formData.technician_signature)
      }

      let record
      if (editingId) {
        record = await pb.collection('certificates').update(editingId, data)
        const oldLists = await pb
          .collection('attendance_lists')
          .getFullList({ filter: `certificate_id="${editingId}"` })
        await Promise.all(oldLists.map((old) => pb.collection('attendance_lists').delete(old.id)))
      } else {
        record = await pb.collection('certificates').create(data)
      }

      if (attendance.length > 0) {
        await Promise.all(
          attendance.map((att) =>
            pb.collection('attendance_lists').create({
              certificate_id: record.id,
              name: att.name,
              cpf: att.cpf,
              presence: att.presence,
              observations: att.observations,
            }),
          ),
        )
      }

      if (status === 'completed') {
        await pb.send(`/backend/v1/certificates/${record.id}/generate-pdf`, { method: 'POST' })
      }

      toast({
        title: 'Sucesso',
        description: `Certificado salvo como ${status === 'draft' ? 'rascunho' : 'concluído'}.`,
      })
      fetchCertificates()
      resetForm()
      setActiveTab('list')
    } catch (e: any) {
      const fieldErrors = extractFieldErrors(e)
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors)
        toast({
          title: 'Erro de Validação',
          description: 'Verifique os campos em vermelho.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Erro',
          description: e.message || 'Falha ao salvar.',
          variant: 'destructive',
        })
      }
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este certificado?')) return
    try {
      await pb.collection('certificates').delete(id)
      fetchCertificates()
      toast({ title: 'Excluído com sucesso' })
    } catch (e) {
      toast({ title: 'Erro', description: 'Não foi possível excluir.', variant: 'destructive' })
    }
  }

  const updateAttendance = (index: number, field: keyof AttendanceEntry, value: any) => {
    setAttendance((prev) => {
      const newAtt = [...prev]
      newAtt[index] = { ...newAtt[index], [field]: value }
      return newAtt
    })
  }

  const addAttendance = () =>
    setAttendance((prev) => [...prev, { name: '', cpf: '', presence: true, observations: '' }])
  const removeAttendance = (index: number) =>
    setAttendance((prev) => prev.filter((_, i) => i !== index))

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">Gerenciador de Certificados NR</h2>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v)
          if (v === 'new' && !editingId) resetForm()
        }}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-200">
          <TabsTrigger value="list" className="data-[state=active]:bg-white text-sm font-medium">
            Lista de Certificados
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-white text-sm font-medium">
            {editingId ? 'Editar Certificado' : 'Novo Certificado'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Colaborador (Principal)</TableHead>
                    <TableHead>Tipo (NR)</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {certificates.map((cert) => (
                    <TableRow key={cert.id}>
                      <TableCell className="font-medium">{cert.collaborator_name}</TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                          {cert.nr_type}
                        </span>
                      </TableCell>
                      <TableCell>
                        {cert.training_date
                          ? new Date(cert.training_date).toLocaleDateString('pt-BR')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${cert.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                        >
                          {cert.status === 'completed' ? 'Concluído' : 'Rascunho'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 items-center">
                          {cert.pdf_url && cert.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <a
                                href={pb.files.getUrl(cert, cert.pdf_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-3.5 w-3.5" /> PDF
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-500 hover:text-blue-600"
                            onClick={() => handleEdit(cert)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500"
                            onClick={() => handleDelete(cert.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {certificates.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                        <FileText className="h-8 w-8 mx-auto text-slate-300 mb-3" />
                        Nenhum certificado registrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-8">
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              {/* Dados do Treinamento */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-800">
                  Dados do Treinamento
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Tipo de NR <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.nr_type}
                      onValueChange={(v) => setFormData({ ...formData, nr_type: v })}
                    >
                      <SelectTrigger className={errors.nr_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NR-06">NR-06 (EPIs)</SelectItem>
                        <SelectItem value="NR-10">NR-10 (Eletricidade)</SelectItem>
                        <SelectItem value="NR-18">NR-18 (Construção Civil)</SelectItem>
                        <SelectItem value="NR-35">NR-35 (Trabalho em Altura)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.nr_type && <p className="text-red-500 text-xs">{errors.nr_type}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Carga Horária <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                      className={errors.hours ? 'border-red-500' : ''}
                    />
                    {errors.hours && <p className="text-red-500 text-xs">{errors.hours}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Data de Conclusão <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={formData.training_date}
                      onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                      className={errors.training_date ? 'border-red-500' : ''}
                    />
                    {errors.training_date && (
                      <p className="text-red-500 text-xs">{errors.training_date}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados do Colaborador Principal */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-800">
                  Colaborador (Titular do Certificado)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.collaborator_name}
                      onChange={(e) =>
                        setFormData({ ...formData, collaborator_name: e.target.value })
                      }
                      placeholder="Ex: João da Silva"
                      className={errors.collaborator_name ? 'border-red-500' : ''}
                    />
                    {errors.collaborator_name && (
                      <p className="text-red-500 text-xs">{errors.collaborator_name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={formData.collaborator_cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, collaborator_cpf: formatCPF(e.target.value) })
                      }
                      placeholder="000.000.000-00"
                      className={errors.collaborator_cpf ? 'border-red-500' : ''}
                    />
                    {errors.collaborator_cpf && (
                      <p className="text-red-500 text-xs">{errors.collaborator_cpf}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dados do Técnico / Instrutor */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-slate-800">
                  Responsável Técnico / Instrutor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CPF do Técnico</Label>
                    <Input
                      value={formData.technician_cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, technician_cpf: formatCPF(e.target.value) })
                      }
                      placeholder="000.000.000-00"
                      className={errors.technician_cpf ? 'border-red-500' : ''}
                    />
                    {errors.technician_cpf && (
                      <p className="text-red-500 text-xs">{errors.technician_cpf}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Assinatura (Imagem)</Label>
                    {currentSignatureUrl && (
                      <div className="mb-2 p-2 border rounded bg-slate-50 inline-block">
                        <img
                          src={currentSignatureUrl}
                          alt="Assinatura Atual"
                          className="h-8 object-contain"
                        />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          technician_signature: e.target.files?.[0] || null,
                        }))
                      }
                      className={errors.technician_signature ? 'border-red-500' : ''}
                    />
                    {errors.technician_signature && (
                      <p className="text-red-500 text-xs">{errors.technician_signature}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de Presença */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 mb-4 gap-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Lista de Presença Adicional
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAttendance}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Participante
                  </Button>
                </div>
                {attendance.length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    Nenhum participante adicional registrado. Clique acima para adicionar.
                  </p>
                )}
                <div className="space-y-4">
                  {attendance.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-slate-50 relative"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 md:-right-2 md:-top-2 bg-white border shadow-sm text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full h-6 w-6"
                        onClick={() => removeAttendance(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Nome do Participante</Label>
                        <Input
                          value={att.name}
                          onChange={(e) => updateAttendance(idx, 'name', e.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="w-full md:w-40 space-y-2">
                        <Label className="text-xs">CPF</Label>
                        <Input
                          value={att.cpf}
                          onChange={(e) => updateAttendance(idx, 'cpf', formatCPF(e.target.value))}
                          placeholder="000.000.000-00"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs">Observações</Label>
                        <Input
                          value={att.observations}
                          onChange={(e) => updateAttendance(idx, 'observations', e.target.value)}
                          placeholder="Opcional"
                        />
                      </div>
                      <div className="w-full md:w-28 space-y-2 flex flex-col justify-end pb-2">
                        <div className="flex items-center space-x-2 bg-white border p-2 rounded-md justify-center">
                          <Checkbox
                            id={`presence-${idx}`}
                            checked={att.presence}
                            onCheckedChange={(checked) =>
                              updateAttendance(idx, 'presence', !!checked)
                            }
                          />
                          <Label htmlFor={`presence-${idx}`} className="text-sm cursor-pointer">
                            Presente
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm()
                    setActiveTab('list')
                  }}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                  className="w-full sm:w-auto bg-slate-200 hover:bg-slate-300"
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-auto bg-brand-navy hover:bg-brand-navy/90 text-white"
                  onClick={() => handleSave('completed')}
                  disabled={loading}
                >
                  Salvar e Gerar PDF
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
