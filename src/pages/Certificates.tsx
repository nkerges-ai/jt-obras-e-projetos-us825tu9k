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
import { Download, Trash } from 'lucide-react'

export default function Certificates() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [formData, setFormData] = useState({
    nr_type: 'NR-35',
    collaborator_name: '',
    training_date: '',
    hours: 8,
  })
  const [loading, setLoading] = useState(false)

  const fetchCertificates = async () => {
    try {
      const records = await pb.collection('certificates').getFullList({ sort: '-created' })
      setCertificates(records)
    } catch (e) {}
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const handleSave = async (status: 'draft' | 'completed') => {
    setLoading(true)
    try {
      const record = await pb.collection('certificates').create({
        ...formData,
        user_id: user.id,
        status,
      })
      if (status === 'completed') {
        await pb.send(`/backend/v1/certificates/${record.id}/generate-pdf`, { method: 'POST' })
      }
      toast({
        title: 'Sucesso',
        description: `Certificado salvo como ${status === 'draft' ? 'rascunho' : 'concluído'}.`,
      })
      fetchCertificates()
      setFormData({ nr_type: 'NR-35', collaborator_name: '', training_date: '', hours: 8 })
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar certificado.', variant: 'destructive' })
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este certificado?')) return
    await pb.collection('certificates').delete(id)
    fetchCertificates()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Certificados NR</h1>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-slate-200">
          <TabsTrigger value="list" className="data-[state=active]:bg-white">
            Lista de Certificados
          </TabsTrigger>
          <TabsTrigger value="new" className="data-[state=active]:bg-white">
            Novo Certificado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Colaborador</TableHead>
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
                    <TableCell>{cert.nr_type}</TableCell>
                    <TableCell>
                      {new Date(cert.training_date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${cert.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                      >
                        {cert.status === 'completed' ? 'Concluído' : 'Rascunho'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {cert.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toast({ description: 'Download PDF em breve...' })}
                          >
                            <Download className="h-4 w-4 text-[#3498db]" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cert.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {certificates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum certificado registrado no momento.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Tipo de Norma Regulamentadora</Label>
                  <Select
                    value={formData.nr_type}
                    onValueChange={(v) => setFormData({ ...formData, nr_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NR-06">NR-06 (EPIs)</SelectItem>
                      <SelectItem value="NR-10">NR-10 (Eletricidade)</SelectItem>
                      <SelectItem value="NR-18">NR-18 (Construção Civil)</SelectItem>
                      <SelectItem value="NR-35">NR-35 (Trabalho em Altura)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Carga Horária (horas)</Label>
                  <Input
                    type="number"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nome do Colaborador</Label>
                <Input
                  value={formData.collaborator_name}
                  onChange={(e) => setFormData({ ...formData, collaborator_name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div className="space-y-2">
                <Label>Data de Conclusão do Treinamento</Label>
                <Input
                  type="date"
                  value={formData.training_date}
                  onChange={(e) => setFormData({ ...formData, training_date: e.target.value })}
                />
              </div>

              <div className="flex gap-4 pt-6 border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSave('completed')}
                  disabled={loading}
                  className="bg-[#3498db] hover:bg-[#2980b9] text-white flex-1"
                >
                  Gerar PDF do Certificado
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
