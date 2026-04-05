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

const CERTIFICATE_TEMPLATES: Record<
  string,
  { courseName: string; courseDesc: string; workload: string; syllabus: string }
> = {
  'NR-06': {
    courseName: 'NR-06 EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL - EPI',
    courseDesc:
      '<p>Treinamento sobre o uso adequado, guarda e conservação de Equipamentos de Proteção Individual (EPI), conforme as diretrizes da Norma Regulamentadora NR-06.</p>',
    workload: '04',
    syllabus:
      '<ul><li>Importância do EPI</li><li>Seleção do EPI adequado</li><li>Uso correto</li><li>Manutenção e conservação</li><li>Responsabilidades do empregador e do empregado</li></ul>',
  },
  'NR-10': {
    courseName: 'NR-10 SEGURANÇA EM INSTALAÇÕES E SERVIÇOS EM ELETRICIDADE',
    courseDesc:
      '<p>Treinamento Básico de Segurança em Instalações e Serviços com Eletricidade, abordando os riscos elétricos, medidas de controle e primeiros socorros, em conformidade com a Norma Regulamentadora NR-10.</p>',
    workload: '40',
    syllabus:
      '<ul><li>Introdução à segurança com eletricidade</li><li>Riscos em instalações e serviços com eletricidade</li><li>Técnicas de análise de risco</li><li>Medidas de controle do risco elétrico</li><li>EPI/EPC (Equipamentos de Proteção Individual e Coletiva)</li><li>Procedimentos e rotinas de trabalho</li><li>Noções de combate a incêndio</li><li>Noções de primeiros socorros</li></ul>',
  },
  'NR-18': {
    courseName: 'NR-18 CONDIÇÕES DE SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO',
    courseDesc:
      '<p>Treinamento admissional/periódico abordando os riscos inerentes à função, condições do ambiente de trabalho, uso de EPI e EPC, de acordo com a Norma Regulamentadora NR-18.</p>',
    workload: '06',
    syllabus:
      '<ul><li>Condições do ambiente de trabalho</li><li>Medidas de proteção coletiva</li><li>Equipamentos de proteção individual</li><li>Sinalização de segurança</li><li>Procedimentos operacionais para a fase específica da obra</li></ul>',
  },
  'NR-35': {
    courseName: 'NR-35 SEGURANÇA E SAÚDE NOS TRABALHOS EM ALTURA',
    courseDesc:
      '<p>Curso de capacitação para trabalhos em altura, englobando normas, análise de risco, sistemas de proteção contra quedas e condutas em situações de emergência, conforme estabelecido pela Norma Regulamentadora NR-35.</p>',
    workload: '08',
    syllabus:
      '<ul><li>Normas e regulamentos aplicáveis</li><li>Análise de risco e condições impeditivas</li><li>Riscos potenciais inerentes ao trabalho em altura</li><li>Sistemas, equipamentos e procedimentos de proteção coletiva</li><li>Equipamentos de Proteção Individual para trabalho em altura</li><li>Condutas em situações de emergência e noções de resgate e primeiros socorros</li></ul>',
  },
}

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
  const [activeTab, setActiveTab] = useState('list')

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
      setActiveTab('list')
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

      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          if (v !== activeTab) {
            setActiveTab(v)
            if (v === 'new')
              setFormData({ nr_type: 'NR-35', collaborator_name: '', training_date: '', hours: 8 })
          }
        }}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 bg-slate-200 p-1">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-white text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-xs sm:text-sm font-medium"
          >
            Lista de Certificados
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-white text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-xs sm:text-sm font-medium"
          >
            Novo Certificado
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border w-full overflow-hidden">
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[700px] md:min-w-full">
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
                        <div className="flex justify-end gap-2 items-center">
                          {cert.pdf_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-9 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <a
                                href={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${cert.collectionId}/${cert.id}/${cert.pdf_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-4 w-4" /> PDF
                              </a>
                            </Button>
                          )}
                          {cert.status === 'completed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-11 w-11 sm:h-9 sm:w-9 text-slate-700 hover:text-[#3498db] hover:bg-blue-50"
                              onClick={() => setPrintDoc(cert)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-11 w-11 sm:h-9 sm:w-9 text-slate-400 hover:text-red-500 hover:bg-red-50"
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
                      <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                        Nenhum certificado registrado no momento.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
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

              <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t mt-4 w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[44px] shrink-0"
                  onClick={() => handleSave('draft')}
                  disabled={loading}
                >
                  Salvar Rascunho
                </Button>
                <Button
                  type="button"
                  className="w-full sm:flex-1 bg-[#3498db] hover:bg-[#2980b9] text-white min-h-[44px] shrink-0"
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
              .print-page-break { page-break-after: always !important; break-after: page !important; }
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
              className="w-full max-w-[1040px] flex flex-col items-center gap-12 print:gap-0 print:block"
            >
              {/* Front Page */}
              <div className="relative bg-white w-full md:w-[1040px] h-[735px] shrink-0 shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] print:overflow-hidden p-4 select-none print-page-break mb-8 print:mb-0">
                <div className="absolute inset-6 border-[6px] border-[#005A9C] pointer-events-none z-10 opacity-100 rounded-sm print:inset-8"></div>

                {/* Rivets */}
                <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:top-5 print:left-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
                </div>
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:top-5 print:right-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
                </div>
                <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:bottom-5 print:left-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
                </div>
                <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:bottom-5 print:right-5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
                </div>

                <div className="w-full h-full pt-16 pb-12 px-16 md:px-24 flex flex-col items-center text-center relative z-0 print:pt-20 print:pb-16 print:px-28">
                  <div className="flex items-center justify-center mb-6 h-[80px]">
                    <img
                      src={logo}
                      alt="JT Obras e Manutenções"
                      className="h-full object-contain max-w-[200px]"
                    />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-[0.2em] text-[#005A9C] uppercase">
                    CERTIFICADO
                  </h1>
                  <h2 className="text-xl md:text-xl font-bold italic mb-8 text-gray-800 uppercase">
                    "
                    {CERTIFICATE_TEMPLATES[printDoc.nr_type]?.courseName ||
                      CERTIFICATE_TEMPLATES['NR-35'].courseName}
                    "
                  </h2>

                  <div className="text-base leading-[2] text-justify mb-8 text-gray-800 w-full px-4 md:px-12 print:px-12">
                    <span className="inline">Certificamos que o colaborador </span>
                    <span className="font-bold uppercase border-b border-black inline-block min-w-[250px] text-center px-2">
                      {printDoc.collaborator_name}
                    </span>
                    <span className="inline">, da empresa </span>
                    <span className="font-bold uppercase inline">JT OBRAS E MANUTENÇÕES LTDA</span>
                    <span className="inline">
                      , CNPJ 63.243.791/0001-09 participou do seguinte programa:
                    </span>
                  </div>

                  <div
                    className="text-sm md:text-base leading-relaxed text-center mb-6 text-gray-800 w-full px-10 md:px-20 font-medium print:px-20"
                    dangerouslySetInnerHTML={{
                      __html:
                        CERTIFICATE_TEMPLATES[printDoc.nr_type]?.courseDesc ||
                        CERTIFICATE_TEMPLATES['NR-35'].courseDesc,
                    }}
                  />

                  <div className="text-base text-center mb-10 text-gray-800 w-full">
                    <span className="inline">
                      conforme estabelecido nas Normas Regulamentadoras, com carga horária de{' '}
                    </span>
                    <span className="font-bold">{String(printDoc.hours).padStart(2, '0')}</span>
                    <span className="inline"> horas.</span>
                  </div>

                  <p className="text-base font-bold mt-auto mb-12 text-gray-800">
                    São Paulo,{' '}
                    {new Date(printDoc.training_date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    .
                  </p>

                  <div className="flex flex-col items-center w-full max-w-[280px] relative">
                    {user?.signature ? (
                      <img
                        src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.signature}`}
                        className="absolute -top-16 h-20 mix-blend-multiply z-10"
                        alt="Assinatura"
                      />
                    ) : null}
                    <div className="w-full border-t border-black mb-2"></div>
                    <p className="font-bold text-sm text-gray-900">João Vitor Araujo Pessoa</p>
                    <p className="text-xs font-semibold text-gray-700">Téc. Seg. do Trabalho</p>
                    <p className="text-[10px] font-bold text-gray-800 mt-1">MTE/SP: 0106195</p>
                    <p className="text-[10px] font-bold text-gray-800">CREA: 5070806995</p>
                  </div>
                </div>
              </div>

              {/* Back Page */}
              <div className="relative bg-white w-full md:w-[1040px] h-[735px] shrink-0 shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] print:overflow-hidden p-16 md:p-24 select-none flex flex-col print:p-24">
                <div className="flex items-center justify-between mb-10 border-b-2 border-[#005A9C] pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#005A9C] tracking-wide uppercase">
                      CONTEÚDO PROGRAMÁTICO
                    </h2>
                    <p className="text-sm text-[#005A9C] font-bold mt-1 uppercase">
                      {CERTIFICATE_TEMPLATES[printDoc.nr_type]?.courseName ||
                        CERTIFICATE_TEMPLATES['NR-35'].courseName}
                    </p>
                  </div>
                  <img src={logo} alt="JT Obras" className="h-16 object-contain" />
                </div>

                <div className="flex-1 w-full text-gray-800">
                  <div
                    className="prose prose-blue max-w-none text-sm md:text-base leading-relaxed prose-li:my-1.5 prose-ul:list-disc prose-ul:pl-5"
                    dangerouslySetInnerHTML={{
                      __html:
                        CERTIFICATE_TEMPLATES[printDoc.nr_type]?.syllabus ||
                        CERTIFICATE_TEMPLATES['NR-35'].syllabus,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
