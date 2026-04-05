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
import { Download, Trash, Printer } from 'lucide-react'
import logo from '@/assets/logotipo-c129e.jpg'

export default function Certificates() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [printDoc, setPrintDoc] = useState<any>(null)
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
    } catch (e) {
      console.error(e)
    }
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
          <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
            <Table className="min-w-[600px]">
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
                            className="h-11 w-11 sm:h-10 sm:w-10"
                            onClick={() => setPrintDoc(cert)}
                          >
                            <Printer className="h-4 w-4 text-[#3498db]" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 sm:h-10 sm:w-10"
                          onClick={() => handleDelete(cert.id)}
                        >
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
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 max-w-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-[44px]"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  className="bg-[#3498db] hover:bg-[#2980b9] text-white flex-1 min-h-[44px]"
                  onClick={() => handleSave('completed')}
                  disabled={loading}
                >
                  Gerar PDF do Certificado
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>

      {printDoc && (
        <div className="fixed inset-0 bg-black/60 z-[100] overflow-y-auto print:bg-white print:overflow-visible">
          <style>{`
            @media print {
              @page { size: A4 landscape !important; margin: 0 !important; }
              html, body { margin: 0 !important; padding: 0 !important; background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              header, footer, nav, .print\\:hidden { display: none !important; }
              #certificate-print-area { width: 297mm !important; margin: 0 !important; padding: 0 !important; }
            }
          `}</style>
          <div className="min-h-screen py-8 px-4 print:p-0 print:m-0 flex flex-col items-center">
            <div className="bg-white p-4 w-full max-w-[1040px] flex justify-between items-center rounded-t-lg print:hidden shrink-0 shadow-lg">
              <h2 className="font-bold text-lg">Visualização do Certificado</h2>
              <div className="flex gap-2">
                <Button onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Imprimir PDF
                </Button>
                <Button variant="ghost" onClick={() => setPrintDoc(null)}>
                  Fechar
                </Button>
              </div>
            </div>

            <div
              id="certificate-print-area"
              className="w-full max-w-[1040px] flex justify-center bg-white relative aspect-[1.414/1] md:h-[735px] shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] overflow-hidden p-4"
            >
              <div className="absolute inset-4 border-[14px] border-[#005A9C] z-10 opacity-90 pointer-events-none"></div>
              <div className="absolute inset-[24px] border-[2px] border-[#009FE3] z-10 opacity-70 pointer-events-none"></div>

              <div className="w-full h-full pt-12 pb-10 px-16 md:px-24 flex flex-col items-center text-center relative z-0">
                <div className="flex items-center justify-center mb-6 h-[70px]">
                  <img
                    src={
                      user?.company_logo
                        ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.company_logo}`
                        : logo
                    }
                    alt="Company Logo"
                    className="h-full object-contain max-w-[200px]"
                  />
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-[0.2em] text-[#005A9C] uppercase">
                  CERTIFICADO
                </h1>
                <h2 className="text-xl md:text-2xl font-bold italic mb-6 text-gray-800">
                  Treinamento {printDoc.nr_type}
                </h2>

                <div className="text-base md:text-lg leading-[2] text-justify mb-8 text-gray-800 w-full px-12">
                  <span className="inline">Certificamos que </span>
                  <span className="font-bold uppercase border-b border-black inline px-2">
                    {printDoc.collaborator_name}
                  </span>
                  <span className="inline"> participou do treinamento de </span>
                  <span className="font-bold inline">{printDoc.nr_type}</span>
                  <span className="inline">, com carga horária de </span>
                  <span className="font-bold">{printDoc.hours}</span>
                  <span className="inline">
                    {' '}
                    horas, realizado em{' '}
                    {new Date(printDoc.training_date).toLocaleDateString('pt-BR')}.
                  </span>
                </div>

                <p className="text-base font-bold mt-auto mb-10 text-gray-800">
                  São Paulo, {new Date(printDoc.training_date).toLocaleDateString('pt-BR')}.
                </p>

                <div className="mt-8 flex flex-col items-center w-full max-w-sm relative">
                  {user?.signature && (
                    <img
                      src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.signature}`}
                      className="absolute -top-12 h-16 mix-blend-multiply z-10"
                      alt="Assinatura"
                    />
                  )}
                  <div className="w-full border-t border-black mb-2"></div>
                  <p className="font-bold text-base text-gray-900">
                    {user?.name || 'Responsável Técnico'}
                  </p>
                  <p className="text-sm font-semibold text-gray-700">
                    {user?.company || 'JT OBRAS E MANUTENÇÕES LTDA'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
