import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { RichTextEditor } from '@/components/RichTextEditor'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Trash,
  MoreVertical,
  Edit,
  Mail,
  Eye,
  FileSignature,
  CheckCircle,
  FileText,
  LayoutTemplate,
  Briefcase,
  RefreshCw,
} from 'lucide-react'
import { EmailSenderDialog } from '@/components/EmailSenderDialog'

export default function Contracts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])

  const [clientName, setClientName] = useState('')
  const [collaboratorCpf, setCollaboratorCpf] = useState('')
  const [technicianCpf, setTechnicianCpf] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string>('none')

  const [activeTab, setActiveTab] = useState('list')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [emailOpen, setEmailOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const fetchContracts = async () => {
    try {
      const records = await pb.collection('contracts').getFullList({ sort: '-created' })
      setContracts(records)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchProjects = async () => {
    try {
      const records = await pb
        .collection('projects')
        .getFullList({ sort: '-created', expand: 'client_id' })
      setProjects(records)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchContracts()
    fetchProjects()
    if (user?.cpf) {
      setTechnicianCpf(user.cpf)
    }
  }, [user])

  const formatCpfCnpj = (v: string) => {
    let val = v.replace(/\D/g, '')
    if (val.length <= 11) {
      val = val.replace(/(\d{3})(\d)/, '$1.$2')
      val = val.replace(/(\d{3})(\d)/, '$1.$2')
      val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else {
      if (val.length > 14) val = val.slice(0, 14)
      val = val.replace(/^(\d{2})(\d)/, '$1.$2')
      val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      val = val.replace(/\.(\d{3})(\d)/, '.$1/$2')
      val = val.replace(/(\d{4})(\d)/, '$1-$2')
    }
    return val
  }

  const loadTemplate = (projectId: string) => {
    let p = projectId && projectId !== 'none' ? projects.find((x) => x.id === projectId) : null
    let client = p?.expand?.client_id

    const formatCurrency = (val: number) => {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
    }
    const formatDate = (d: string) => {
      if (!d) return '___/___/____'
      return new Date(d).toLocaleDateString('pt-BR')
    }

    const cCnpj = user?.cnpj || '[CNPJ DA JT OBRAS E REFORMAS]'
    const cEndereco = user?.address || '[ENDEREÇO COMPLETO DA JT OBRAS E REFORMAS]'
    const cNome = user?.name || '[NOME DO REPRESENTANTE]'
    const cRg = user?.rg || '[RG DO REPRESENTANTE]'
    const cCpf = user?.cpf || '[CPF DO REPRESENTANTE]'

    const cliNome = client?.name || '[NOME COMPLETO OU RAZÃO SOCIAL DA CONTRATADA]'
    const cliDoc = client?.tax_id || '[NÚMERO DO CNPJ/CPF DA CONTRATADA]'

    let cliEnd = '[ENDEREÇO COMPLETO DA CONTRATADA]'
    if (client) {
      cliEnd = `${client.address_street || ''}, ${client.address_number || ''}`
      if (client.address_complement) cliEnd += ` - ${client.address_complement}`
      cliEnd += `, ${client.address_city || ''} - ${client.address_state || ''}, CEP: ${client.address_zip || ''}`
    }

    const projDesc = p?.description || '[TIPO DE SERVIÇO]'
    let projEnd = '[ENDEREÇO COMPLETO DA OBRA]'
    if (p) {
      projEnd = `${p.address_street || ''}, ${p.address_number || ''}`
      if (p.address_complement) projEnd += ` - ${p.address_complement}`
      projEnd += `, ${p.address_city || ''} - ${p.address_state || ''}, CEP: ${p.address_zip || ''}`
    }
    const projVal = p ? formatCurrency(p.total_value) : '[VALOR TOTAL DA OBRA]'
    const projPrazo = p?.deadline_days ? `${p.deadline_days} dias` : '[PRAZO TOTAL]'
    const projData = p ? formatDate(p.start_date) : '[DATA DE INÍCIO]'

    const template = `<h2 style="text-align: center;"><strong>JT OBRAS E REFORMAS - CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE OBRAS E REFORMAS</strong></h2>
<p><br/></p>
<p>Pelo presente instrumento particular, de um lado:</p>
<p><strong>CONTRATADA:</strong> JT OBRAS E MANUTENÇÕES LTDA, inscrita no CNPJ sob o nº ${cCnpj}, sediada à ${cEndereco}, neste ato representada por ${cNome}, portador(a) do RG nº ${cRg} e CPF nº ${cCpf}.</p>
<p><strong>CONTRATANTE:</strong> ${cliNome}, inscrito(a) no CPF/CNPJ sob o nº ${cliDoc}, residente/sediado(a) à ${cliEnd}.</p>
<p><br/></p>
<h3>1. QUALIFICAÇÃO</h3>
<p>As partes acima qualificadas têm entre si justo e acertado o presente contrato, que se regerá pelas cláusulas a seguir e pelas disposições legais aplicáveis.</p>
<p><br/></p>
<h3>2. OBJETO</h3>
<p>O presente contrato tem por objeto a prestação de serviços de ${projDesc}, a serem realizados no endereço: ${projEnd}.</p>
<p><br/></p>
<h3>3. RESPONSABILIDADES DA CONTRATADA</h3>
<p>A CONTRATADA compromete-se a executar os serviços com zelo, fornecendo a mão de obra necessária e cumprindo as normas técnicas vigentes (incluindo NR-01, NR-18, NR-35 conforme aplicável).</p>
<p><br/></p>
<h3>4. RESPONSABILIDADES DO CONTRATANTE</h3>
<p>O CONTRATANTE compromete-se a fornecer livre acesso ao local da obra, garantir as condições básicas para execução e efetuar os pagamentos conforme acordado.</p>
<p><br/></p>
<h3>5. VALOR E FORMA DE PAGAMENTO</h3>
<p>O valor total da obra é de ${projVal}. A forma de pagamento será realizada da seguinte maneira: [INSERIR FORMA DE PAGAMENTO].</p>
<p><br/></p>
<h3>6. PRAZO</h3>
<p>O prazo total estimado para a execução dos serviços é de ${projPrazo}, com início na data de ${projData}.</p>
<p><br/></p>
<h3>7. CONDIÇÕES CLIMÁTICAS</h3>
<p>Fica ressalvado que eventuais atrasos decorrentes de chuvas prolongadas ou condições climáticas adversas que impeçam a execução dos serviços justificarão a prorrogação do prazo, sem penalidades para a CONTRATADA.</p>
<p><br/></p>
<h3>8. GARANTIAS</h3>
<p>A CONTRATADA oferece garantia sobre os serviços executados conforme prevê a legislação aplicável, a contar da entrega final da obra.</p>
<p><br/></p>
<h3>9. PENALIDADES</h3>
<p>Em caso de descumprimento das cláusulas deste contrato, a parte infratora estará sujeita a multa de [PERCENTUAL_MULTA]% sobre o valor total do contrato, além de eventuais perdas e danos.</p>
<p><br/></p>
<h3>10. RESCISÃO</h3>
<p>O presente contrato poderá ser rescindido por qualquer das partes em caso de infração contratual, mediante aviso prévio por escrito de [DIAS_AVISO] dias.</p>
<p><br/></p>
<h3>11. ADITIVOS</h3>
<p>Quaisquer alterações no escopo dos serviços, prazos ou valores deverão ser formalizadas por meio de aditivo contratual assinado por ambas as partes.</p>
<p><br/></p>
<h3>12. DISPOSIÇÕES GERAIS</h3>
<p>Os casos omissos serão resolvidos de comum acordo entre as partes, sempre pautados pela boa-fé e pelos princípios gerais de direito.</p>
<p><br/></p>
<h3>13. FORO</h3>
<p>As partes elegem o foro da Comarca de São Paulo/SP para dirimir quaisquer dúvidas oriundas deste contrato, renunciando a qualquer outro, por mais privilegiado que seja.</p>
<p><br/></p>
<p>E por estarem assim justos e contratados, assinam o presente instrumento em 2 (duas) vias de igual teor e forma.</p>
<p><br/></p>
<p>Local e Data: ______________________, ___ de ____________ de ______.</p>
<p><br/></p>
<p>____________________________________________________<br/><strong>CONTRATADA</strong><br/>JT OBRAS E MANUTENÇÕES LTDA</p>
<p><br/></p>
<p>____________________________________________________<br/><strong>CONTRATANTE</strong><br/>${cliNome}</p>
`
    setContentHtml(template)
    if (client) {
      setClientName(client.name)
      setCollaboratorCpf(client.tax_id)
    } else {
      setClientName('')
      setCollaboratorCpf('')
    }
  }

  const handleProjectSelect = (val: string) => {
    setSelectedProjectId(val)
    if (val !== 'none') {
      loadTemplate(val)
      toast({
        title: 'Template Carregado',
        description: 'Os dados do projeto foram inseridos no contrato.',
      })
    }
  }

  const resetForm = () => {
    setClientName('')
    setCollaboratorCpf('')
    setTechnicianCpf(user?.cpf || '')
    setContentHtml('')
    setEditingId(null)
    setSelectedProjectId('none')
    setFieldErrors({})
  }

  const handleEdit = (c: any) => {
    setClientName(c.client_name)
    setCollaboratorCpf(c.collaborator_cpf || '')
    setTechnicianCpf(c.technician_cpf || user?.cpf || '')
    setContentHtml(c.content_html)
    setEditingId(c.id)
    setActiveTab('editor')
    setFieldErrors({})
  }

  const handleSave = async (shouldSend: boolean = false) => {
    const errs: Record<string, string> = {}
    if (!clientName) errs.client_name = 'Obrigatório.'
    if (!technicianCpf || technicianCpf.length < 14) errs.technician_cpf = 'CPF inválido.'

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      toast({
        title: 'Erro de Validação',
        description: 'Verifique os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }
    setFieldErrors({})

    try {
      const payload = {
        user_id: user.id,
        client_name: clientName,
        collaborator_cpf: collaboratorCpf,
        technician_cpf: technicianCpf,
        content_html: contentHtml,
        status: 'active',
      }

      let record
      if (editingId) {
        record = await pb.collection('contracts').update(editingId, payload)
      } else {
        record = await pb.collection('contracts').create(payload)
      }

      await pb.send(`/backend/v1/documents/contracts/${record.id}/generate-pdf`, { method: 'POST' })

      toast({
        title: 'Sucesso',
        description: 'Contrato salvo no sistema e PDF gerado com sucesso.',
      })

      if (shouldSend) {
        setSelectedDoc(record)
        setEmailOpen(true)
      }

      fetchContracts()
      resetForm()
      setActiveTab('list')
    } catch (e: any) {
      toast({
        title: 'Erro ao Salvar',
        description: 'Falha ao salvar o contrato. Tente novamente.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir permanentemente este contrato?')) return
    await pb.collection('contracts').delete(id)
    fetchContracts()
    toast({ title: 'Excluído', description: 'O contrato foi removido do sistema.' })
  }

  const handleGeneratePdf = async (id: string) => {
    toast({ title: 'Gerando PDF', description: 'Aguarde o processamento...' })
    try {
      await pb.send(`/backend/v1/documents/contracts/${id}/generate-pdf`, { method: 'POST' })
      toast({ title: 'Sucesso', description: 'O PDF foi atualizado.' })
      fetchContracts()
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível gerar o PDF.', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6 max-w-[1400px] animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSignature className="h-8 w-8 text-[#3498db]" /> Gerenciador de Contratos
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Crie, edite e acompanhe os contratos de prestação de serviços. Utilize o preenchimento
            inteligente (Smart-Fill) vinculando um projeto existente.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800/80 p-1 w-full sm:w-auto grid grid-cols-2 sm:flex sm:inline-flex h-auto rounded-xl">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-[#3498db] data-[state=active]:text-white text-slate-400 py-3 sm:py-2.5 px-6 rounded-lg font-medium transition-all"
          >
            <Briefcase className="h-4 w-4 mr-2" /> Contratos Emitidos
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="data-[state=active]:bg-[#3498db] data-[state=active]:text-white text-slate-400 py-3 sm:py-2.5 px-6 rounded-lg font-medium transition-all"
            onClick={resetForm}
          >
            <LayoutTemplate className="h-4 w-4 mr-2" /> Novo Contrato (Editor)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-slate-700/50 overflow-hidden">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-slate-800/80">
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="text-slate-300 font-semibold h-12">
                    Contratante / Cliente
                  </TableHead>
                  <TableHead className="text-slate-300 font-semibold h-12">Status</TableHead>
                  <TableHead className="text-slate-300 font-semibold h-12">
                    Data de Emissão
                  </TableHead>
                  <TableHead className="text-right text-slate-300 font-semibold h-12">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow
                    key={c.id}
                    className="border-slate-700/50 hover:bg-slate-800/50 transition-colors group"
                  >
                    <TableCell className="font-medium text-white py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-slate-800 border border-slate-700 shrink-0">
                          <FileText className="h-5 w-5 text-[#3498db]" />
                        </div>
                        <div>
                          <span className="block">{c.client_name}</span>
                          {c.collaborator_cpf && (
                            <span className="text-xs text-slate-500">
                              Doc: {c.collaborator_cpf}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle className="h-3 w-3" /> {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(c.created).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#0f172a] border-slate-700 text-slate-200 w-56 shadow-xl rounded-xl overflow-hidden p-1"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEdit(c)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 py-2.5"
                          >
                            <Edit className="h-4 w-4 mr-2 text-[#3498db]" /> Editar Contrato
                          </DropdownMenuItem>
                          {c.pdf_url && (
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(
                                  `${import.meta.env.VITE_POCKETBASE_URL}/api/files/contracts/${c.id}/${c.pdf_url}`,
                                  '_blank',
                                )
                              }
                              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 py-2.5"
                            >
                              <Eye className="h-4 w-4 mr-2 text-emerald-400" /> Visualizar PDF
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleGeneratePdf(c.id)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 py-2.5"
                          >
                            <RefreshCw className="h-4 w-4 mr-2 text-orange-400" /> Regerar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoc(c)
                              setEmailOpen(true)
                            }}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 py-2.5"
                          >
                            <Mail className="h-4 w-4 mr-2 text-purple-400" /> Enviar por E-mail
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-700 my-1" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(c.id)}
                            className="cursor-pointer text-red-400 hover:bg-red-950/50 focus:bg-red-950/50 py-2.5"
                          >
                            <Trash className="h-4 w-4 mr-2" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {contracts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-16 text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <LayoutTemplate className="h-12 w-12 text-slate-600 opacity-50" />
                        <p>Nenhum contrato encontrado. Comece criando um novo.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <div className="bg-[#1e293b] rounded-xl shadow-lg border border-slate-700 p-6 md:p-8 space-y-8">
            {!editingId && (
              <div className="bg-slate-800/80 p-5 rounded-xl border border-slate-700/60 shadow-inner">
                <Label className="text-slate-300 font-bold mb-3 block flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-[#3498db]" /> Smart-Fill: Preenchimento
                  Automático
                </Label>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <Select value={selectedProjectId} onValueChange={handleProjectSelect}>
                      <SelectTrigger className="w-full bg-slate-900 border-slate-700 text-white h-12 rounded-lg">
                        <SelectValue placeholder="Selecione uma Obra/Projeto para preencher os dados contratuais..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700 text-white max-h-[300px]">
                        <SelectItem value="none" className="text-slate-400 italic">
                          Não vincular projeto (Preenchimento manual)
                        </SelectItem>
                        {projects.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="py-3 cursor-pointer focus:bg-slate-800"
                          >
                            <div className="flex flex-col">
                              <span className="font-semibold">{p.name}</span>
                              <span className="text-xs text-slate-400 opacity-80">
                                {p.expand?.client_id?.name || 'Cliente desconhecido'}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => loadTemplate(selectedProjectId)}
                    variant="outline"
                    className="w-full md:w-auto h-12 border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white bg-transparent shrink-0"
                  >
                    Recarregar Template
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Ao selecionar um projeto, o editor abaixo será atualizado substituindo as
                  variáveis automaticamente (ex: [NOME DO CLIENTE], [ENDEREÇO DA OBRA]).
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5 md:col-span-2">
                <Label className="text-slate-300 font-medium text-sm">
                  Nome do Contratante / Razão Social <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white h-12 focus-visible:ring-slate-600"
                  placeholder="Nome completo do cliente"
                />
                {fieldErrors.client_name && (
                  <p className="text-xs text-red-400 mt-1">{fieldErrors.client_name}</p>
                )}
              </div>

              <div className="space-y-2.5">
                <Label className="text-slate-300 font-medium text-sm">
                  CNPJ / CPF do Contratante
                </Label>
                <Input
                  value={collaboratorCpf}
                  onChange={(e) => setCollaboratorCpf(formatCpfCnpj(e.target.value))}
                  placeholder="000.000.000-00 ou 00.000.000/0001-00"
                  maxLength={18}
                  className="bg-slate-900 border-slate-700 text-white h-12 focus-visible:ring-slate-600"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-slate-300 font-medium text-sm">
                  CPF do Responsável (Signatário) <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={technicianCpf}
                  onChange={(e) => setTechnicianCpf(formatCpfCnpj(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="bg-slate-900 border-slate-700 text-white h-12 focus-visible:ring-slate-600"
                />
                {fieldErrors.technician_cpf && (
                  <p className="text-xs text-red-400 mt-1">{fieldErrors.technician_cpf}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <LayoutTemplate className="h-5 w-5 text-[#3498db]" /> Cláusulas Contratuais e
                  Minuta
                </Label>
                <p className="text-sm text-slate-400">
                  O conteúdo abaixo será impresso e gerado como PDF. Certifique-se de validar todas
                  as variáveis e espaços em branco [_____].
                </p>
              </div>
              <div className="min-h-[500px] border border-slate-700 rounded-xl overflow-hidden bg-white shadow-inner">
                <RichTextEditor
                  value={contentHtml}
                  onChange={setContentHtml}
                  className="min-h-[500px] border-none bg-white text-slate-900"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-end gap-4">
              <Button
                onClick={() => handleSave(false)}
                variant="outline"
                className="w-full sm:w-auto border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 h-14 px-8 font-medium rounded-xl"
              >
                Salvar Rascunho / Gerar PDF
              </Button>
              <Button
                onClick={() => handleSave(true)}
                className="w-full sm:w-auto bg-[#3498db] text-white hover:bg-[#2980b9] h-14 px-8 font-bold rounded-xl shadow-lg"
              >
                Salvar e Enviar E-mail ao Cliente
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedDoc && (
        <EmailSenderDialog
          open={emailOpen}
          onOpenChange={setEmailOpen}
          documentName={`Contrato - ${selectedDoc.client_name}`}
        />
      )}
    </div>
  )
}
