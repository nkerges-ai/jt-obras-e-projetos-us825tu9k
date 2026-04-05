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

  const handleSave = async (status: 'draft' | 'completed') => {
    setLoading(true)
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

      if (status === 'completed') {
        await pb.send(`/backend/v1/documents/certificates/${record.id}/generate-pdf`, {
          method: 'POST',
        })
      }

      toast({
        title: 'Sucesso',
        description: `Certificado salvo como ${status === 'draft' ? 'rascunho' : 'concluído'}.`,
      })
      fetchCertificates()
      resetForm()
      setActiveTab('list')
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar certificado.', variant: 'destructive' })
    }
    setLoading(false)
  }

  const resetForm = () => {
    setFormData({ ...initialForm, technician_cpf: user?.cpf || '' })
    setEditingId(null)
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
        <h1 className="text-3xl font-bold text-white">Certificados NR</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
          >
            Lista de Certificados
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            onClick={resetForm}
          >
            {editingId ? 'Editar Certificado' : 'Novo Certificado'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 overflow-x-auto">
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
                        className={`px-3 py-1 rounded-full text-xs font-medium ${cert.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}
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
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 p-4 sm:p-6 max-w-3xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Tipo de Norma Regulamentadora</Label>
                  <Select
                    value={formData.nr_type}
                    onValueChange={(v) => setFormData({ ...formData, nr_type: v })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
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
                    className="bg-slate-800 border-slate-700 text-white"
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
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">CPF do Colaborador</Label>
                  <Input
                    value={formData.collaborator_cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, collaborator_cpf: formatCpf(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-slate-300">Data de Conclusão do Treinamento</Label>
                  <Input
                    type="date"
                    value={formData.training_date}
                    onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">CPF do Responsável Técnico</Label>
                  <Input
                    value={formData.technician_cpf}
                    onChange={(e) =>
                      setFormData({ ...formData, technician_cpf: formatCpf(e.target.value) })
                    }
                    placeholder="000.000.000-00"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-slate-800 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[44px] bg-transparent border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                >
                  {editingId ? 'Atualizar Rascunho' : 'Salvar Rascunho'}
                </Button>
                <Button
                  type="button"
                  className="bg-[#3498db] hover:bg-[#2980b9] text-white flex-1 min-h-[44px]"
                  onClick={() => handleSave('completed')}
                  disabled={loading}
                >
                  {editingId ? 'Atualizar e Gerar PDF' : 'Salvar e Gerar PDF'}
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
