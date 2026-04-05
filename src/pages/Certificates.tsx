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
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Download, Trash, MoreVertical, Edit, Mail, Eye } from 'lucide-react'
import { EmailSenderDialog } from '@/components/EmailSenderDialog'

const initialForm = {
  nr_type: 'NR-35',
  collaborator_name: '',
  collaborator_cpf: '',
  technician_cpf: '',
  training_date: '',
  hours: 8,
}

export default function Certificates() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [emailOpen, setEmailOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

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
    if (user?.cpf) {
      setFormData((prev) => ({ ...prev, technician_cpf: user.cpf }))
    }
  }, [user])

  const formatCpf = (v: string) => {
    let val = v.replace(/\D/g, '')
    if (val.length > 11) val = val.slice(0, 11)
    val = val.replace(/(\d{3})(\d)/, '$1.$2')
    val = val.replace(/(\d{3})(\d)/, '$1.$2')
    val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return val
  }

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSave = async (status: 'draft' | 'completed', shouldSend: boolean = false) => {
    setLoading(true)
    const errs: Record<string, string> = {}

    if (!formData.collaborator_cpf || formData.collaborator_cpf.length < 14) {
      errs.collaborator_cpf = 'CPF inválido ou não informado.'
    }
    if (!formData.technician_cpf || formData.technician_cpf.length < 14) {
      errs.technician_cpf = 'CPF do responsável técnico é obrigatório.'
    }
    if (!formData.collaborator_name) {
      errs.collaborator_name = 'Nome do colaborador é obrigatório.'
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      setLoading(false)
      toast({
        title: 'Atenção',
        description: 'Preencha todos os campos obrigatórios corretamente.',
        variant: 'destructive',
      })
      return
    }

    setFieldErrors({})

    try {
      const payload = {
        ...formData,
        user_id: user.id,
        status,
      }

      let record
      if (editingId) {
        record = await pb.collection('certificates').update(editingId, payload)
      } else {
        record = await pb.collection('certificates').create(payload)
      }

      if (status === 'completed' || shouldSend) {
        await pb.send(`/backend/v1/documents/certificates/${record.id}/generate-pdf`, {
          method: 'POST',
        })
      }

      toast({
        title: 'Sucesso',
        description: `Certificado salvo como ${status === 'draft' ? 'rascunho' : 'concluído'}.`,
      })

      if (shouldSend) {
        setSelectedDoc(record)
        setEmailOpen(true)
      }

      fetchCertificates()
      resetForm()
      setActiveTab('list')
    } catch (e: any) {
      const errors = e.response?.data || {}
      const extracted: Record<string, string> = {}
      for (const key in errors) extracted[key] = errors[key].message
      setFieldErrors(extracted)
      toast({
        title: 'Erro',
        description: 'Falha ao salvar certificado.',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ ...initialForm, technician_cpf: user?.cpf || '' })
    setEditingId(null)
    setFieldErrors({})
  }

  const handleEdit = (cert: any) => {
    setFormData({
      nr_type: cert.nr_type,
      collaborator_name: cert.collaborator_name,
      collaborator_cpf: cert.collaborator_cpf || '',
      technician_cpf: cert.technician_cpf || user?.cpf || '',
      training_date: cert.training_date.split(' ')[0],
      hours: cert.hours,
    })
    setEditingId(cert.id)
    setActiveTab('new')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este certificado?')) return
    try {
      await pb.collection('certificates').delete(id)
      fetchCertificates()
      toast({ title: 'Excluído', description: 'Certificado removido.' })
    } catch {
      toast({ title: 'Erro', description: 'Falha ao excluir.', variant: 'destructive' })
    }
  }

  const handleGeneratePdf = async (id: string) => {
    toast({ title: 'Gerando PDF', description: 'Aguarde um momento...' })
    try {
      await pb.send(`/backend/v1/documents/certificates/${id}/generate-pdf`, { method: 'POST' })
      toast({ title: 'Sucesso', description: 'PDF gerado.' })
      fetchCertificates()
    } catch {
      toast({ title: 'Erro', description: 'Falha ao gerar PDF.', variant: 'destructive' })
    }
  }

  const handleSendEmail = (doc: any) => {
    setSelectedDoc(doc)
    setEmailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Certificados NR</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800 w-full sm:w-auto grid grid-cols-2 sm:block h-auto">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 py-3 sm:py-1.5"
          >
            Lista de Certificados
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 py-3 sm:py-1.5"
            onClick={resetForm}
          >
            {editingId ? 'Editar Certificado' : 'Novo Certificado'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Colaborador</TableHead>
                  <TableHead className="text-slate-300">CPF</TableHead>
                  <TableHead className="text-slate-300">Tipo (NR)</TableHead>
                  <TableHead className="text-slate-300">Data</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-right text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">
                      {cert.collaborator_name}
                    </TableCell>
                    <TableCell className="text-slate-400">{cert.collaborator_cpf || '-'}</TableCell>
                    <TableCell className="text-slate-300">{cert.nr_type}</TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(cert.training_date).toLocaleDateString('pt-BR', {
                        timeZone: 'UTC',
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cert.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                      >
                        {cert.status === 'completed' ? 'Concluído' : 'Rascunho'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#0f172a] border-slate-800 text-slate-200 w-48"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEdit(cert)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGeneratePdf(cert.id)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" /> Gerar PDF
                          </DropdownMenuItem>
                          {cert.status === 'completed' && (
                            <DropdownMenuItem
                              onClick={() => handleSendEmail(cert)}
                              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                            >
                              <Mail className="h-4 w-4 mr-2" /> Enviar Email
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(cert.id)}
                            className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-300 focus:bg-red-950 focus:text-red-300"
                          >
                            <Trash className="h-4 w-4 mr-2" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {certificates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                      Nenhum certificado registrado no momento.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1">
                      {cert.collaborator_name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-1">
                      CPF: {cert.collaborator_cpf || 'Não informado'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {cert.nr_type}
                      </span>
                      <span>
                        {new Date(cert.training_date).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                        })}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap ${cert.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
                  >
                    {cert.status === 'completed' ? 'Concluído' : 'Rascunho'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(cert)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px]"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleGeneratePdf(cert.id)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px]"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {cert.status === 'completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSendEmail(cert)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px]"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(cert.id)}
                    className="flex-none text-red-400 hover:text-red-300 hover:bg-red-950/50 px-3 min-h-[40px]"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {certificates.length === 0 && (
              <div className="text-center py-10 bg-[#1e293b] rounded-xl border border-slate-800 text-slate-500">
                Nenhum certificado registrado no momento.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 p-4 sm:p-6 max-w-3xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Norma Regulamentadora</Label>
                  <Select
                    value={formData.nr_type}
                    onValueChange={(v) => setFormData({ ...formData, nr_type: v })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white min-h-[44px]">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="NR-06">NR-06 (EPIs)</SelectItem>
                      <SelectItem value="NR-10">NR-10 (Eletricidade)</SelectItem>
                      <SelectItem value="NR-18">NR-18 (Construção Civil)</SelectItem>
                      <SelectItem value="NR-35">NR-35 (Trabalho em Altura)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Carga Horária (horas)</Label>
                  <Input
                    type="number"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Nome do Colaborador</Label>
                  <Input
                    value={formData.collaborator_name}
                    onChange={(e) =>
                      setFormData({ ...formData, collaborator_name: e.target.value })
                    }
                    placeholder="Nome completo"
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px]"
                  />
                  {fieldErrors.collaborator_name && (
                    <p className="text-xs text-red-400">{fieldErrors.collaborator_name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    CPF do Colaborador <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={formData.collaborator_cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, collaborator_cpf: formatCpf(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px]"
                  />
                  {fieldErrors.collaborator_cpf && (
                    <p className="text-xs text-red-400">{fieldErrors.collaborator_cpf}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Data de Conclusão do Treinamento</Label>
                  <Input
                    type="date"
                    value={formData.training_date}
                    onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px] appearance-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">
                    CPF do Responsável Técnico <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={formData.technician_cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, technician_cpf: formatCpf(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px]"
                  />
                  {fieldErrors.technician_cpf && (
                    <p className="text-xs text-red-400">{fieldErrors.technician_cpf}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[48px] w-full sm:w-auto bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => handleSave('draft', false)}
                  disabled={loading}
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  className="bg-slate-700 hover:bg-slate-600 text-white min-h-[48px] w-full sm:w-auto"
                  onClick={() => handleSave('completed', false)}
                  disabled={loading}
                >
                  Salvar e Gerar PDF
                </Button>
                <Button
                  type="button"
                  className="bg-[#3498db] hover:bg-[#2980b9] text-white min-h-[48px] w-full sm:w-auto sm:ml-auto"
                  onClick={() => handleSave('completed', true)}
                  disabled={loading}
                >
                  Salvar e Enviar Email
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>

      {selectedDoc && (
        <EmailSenderDialog
          open={emailOpen}
          onOpenChange={setEmailOpen}
          documentName={`Certificado ${selectedDoc.nr_type} - ${selectedDoc.collaborator_name}`}
        />
      )}
    </div>
  )
}
