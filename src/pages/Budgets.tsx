import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { Trash, Plus, FileSpreadsheet, MoreVertical, Edit, Mail, Eye } from 'lucide-react'
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
import { EmailSenderDialog } from '@/components/EmailSenderDialog'

export default function Budgets() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [budgets, setBudgets] = useState<any[]>([])
  const [clientName, setClientName] = useState('')
  const [collaboratorCpf, setCollaboratorCpf] = useState('')
  const [technicianCpf, setTechnicianCpf] = useState('')
  const [items, setItems] = useState<{ desc: string; qty: number; price: number }[]>([
    { desc: '', qty: 1, price: 0 },
  ])
  const [activeTab, setActiveTab] = useState('list')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [emailOpen, setEmailOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  const fetchBudgets = async () => {
    try {
      const records = await pb.collection('budgets').getFullList({ sort: '-created' })
      setBudgets(records)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchBudgets()
    if (user?.cpf) {
      setTechnicianCpf(user.cpf)
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

  const resetForm = () => {
    setClientName('')
    setCollaboratorCpf('')
    setTechnicianCpf(user?.cpf || '')
    setItems([{ desc: '', qty: 1, price: 0 }])
    setEditingId(null)
    setFieldErrors({})
  }

  const handleEdit = (b: any) => {
    setClientName(b.client_name)
    setCollaboratorCpf(b.collaborator_cpf || '')
    setTechnicianCpf(b.technician_cpf || user?.cpf || '')
    setItems(b.content_json || [{ desc: '', qty: 1, price: 0 }])
    setEditingId(b.id)
    setActiveTab('editor')
    setFieldErrors({})
  }

  const total = items.reduce((acc, curr) => acc + curr.qty * curr.price, 0)

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const handleSave = async (
    status: 'draft' | 'approved' = 'draft',
    shouldSend: boolean = false,
  ) => {
    const errs: Record<string, string> = {}
    if (!clientName) errs.client_name = 'Campo obrigatório.'
    if (!technicianCpf || technicianCpf.length < 14)
      errs.technician_cpf = 'CPF do responsável inválido.'

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs)
      return
    }
    setFieldErrors({})

    try {
      const payload = {
        user_id: user.id,
        client_name: clientName,
        collaborator_cpf: collaboratorCpf,
        technician_cpf: technicianCpf,
        content_json: items,
        total_value: total,
        status: status,
      }

      let record
      if (editingId) {
        record = await pb.collection('budgets').update(editingId, payload)
      } else {
        record = await pb.collection('budgets').create(payload)
      }

      await pb.send(`/backend/v1/documents/budgets/${record.id}/generate-pdf`, { method: 'POST' })

      toast({ title: 'Sucesso', description: 'Orçamento salvo e PDF gerado.' })

      if (shouldSend) {
        setSelectedDoc(record)
        setEmailOpen(true)
      }

      fetchBudgets()
      resetForm()
      setActiveTab('list')
    } catch (e: any) {
      const errors = e.response?.data || {}
      const extracted: Record<string, string> = {}
      for (const key in errors) extracted[key] = errors[key].message
      setFieldErrors(extracted)
      toast({
        title: 'Erro',
        description: 'Verifique os campos obrigatórios.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este orçamento?')) return
    await pb.collection('budgets').delete(id)
    fetchBudgets()
    toast({ title: 'Excluído', description: 'Orçamento removido.' })
  }

  const handleGeneratePdf = async (id: string) => {
    toast({ title: 'Gerando PDF', description: 'Aguarde...' })
    try {
      await pb.send(`/backend/v1/documents/budgets/${id}/generate-pdf`, { method: 'POST' })
      toast({ title: 'Sucesso', description: 'PDF gerado.' })
      fetchBudgets()
    } catch {
      toast({ title: 'Erro', description: 'Falha ao gerar.', variant: 'destructive' })
    }
  }

  const updateItem = (index: number, field: string, val: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: val }
    setItems(newItems)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-white">Orçamentos</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800 w-full sm:w-auto grid grid-cols-2 sm:block h-auto">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 py-3 sm:py-1.5"
          >
            Orçamentos Salvos
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 py-3 sm:py-1.5"
            onClick={resetForm}
          >
            {editingId ? 'Editar Orçamento' : 'Novo Orçamento'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          {/* Desktop Table View */}
          <div className="hidden md:block bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Cliente</TableHead>
                  <TableHead className="text-slate-300">Valor Total</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Data de Criação</TableHead>
                  <TableHead className="text-right text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((b) => (
                  <TableRow key={b.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">{b.client_name}</TableCell>
                    <TableCell className="text-slate-300">R$ {b.total_value.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap ${b.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}
                      >
                        {b.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(b.created).toLocaleDateString()}
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
                            onClick={() => handleEdit(b)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGeneratePdf(b.id)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" /> Gerar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoc(b)
                              setEmailOpen(true)
                            }}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Mail className="h-4 w-4 mr-2" /> Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(b.id)}
                            className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-300 focus:bg-red-950 focus:text-red-300"
                          >
                            <Trash className="h-4 w-4 mr-2" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {budgets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                      Nenhum orçamento gerado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {budgets.map((b) => (
              <div
                key={b.id}
                className="bg-[#1e293b] p-5 rounded-xl border border-slate-800 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-white text-base mb-1">{b.client_name}</h3>
                    <p className="text-sm text-[#3498db] font-bold">
                      R$ {b.total_value.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(b.created).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase whitespace-nowrap ${b.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}
                  >
                    {b.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/50">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(b)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px]"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleGeneratePdf(b.id)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px]"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedDoc(b)
                      setEmailOpen(true)
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 min-h-[40px]"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(b.id)}
                    className="flex-none text-red-400 hover:text-red-300 hover:bg-red-950/50 px-3 min-h-[40px]"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {budgets.length === 0 && (
              <div className="text-center py-10 bg-[#1e293b] rounded-xl border border-slate-800 text-slate-500">
                Nenhum orçamento gerado.
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-4">
              <FileSpreadsheet className="h-6 w-6 text-[#3498db]" />
              <h2 className="text-xl font-bold text-white">Planilha do Orçamento</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
              <div className="space-y-2 md:col-span-2">
                <Label className="text-slate-300 font-medium">
                  Cliente / Obra Referência <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Reforma Condomínio Y"
                  className="h-12 bg-slate-800 border-slate-700 text-white"
                />
                {fieldErrors.client_name && (
                  <p className="text-xs text-red-400">{fieldErrors.client_name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">CPF do Cliente (Opcional)</Label>
                <Input
                  value={collaboratorCpf}
                  onChange={(e) => setCollaboratorCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="h-12 bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">
                  CPF do Responsável Técnico <span className="text-red-400">*</span>
                </Label>
                <Input
                  value={technicianCpf}
                  onChange={(e) => setTechnicianCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="h-12 bg-slate-800 border-slate-700 text-white"
                />
                {fieldErrors.technician_cpf && (
                  <p className="text-xs text-red-400">{fieldErrors.technician_cpf}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Label className="mb-4 block text-slate-300 font-medium">
                Itens de Serviço e Materiais
              </Label>

              <div className="space-y-4 sm:space-y-3">
                {/* Desktop Header */}
                <div className="hidden sm:flex gap-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <div className="flex-1">Descrição</div>
                  <div className="w-20 text-center">Qtd</div>
                  <div className="w-32 text-center">Preço Unit.</div>
                  <div className="w-28 text-right">Subtotal</div>
                  <div className="w-10"></div>
                </div>

                {items.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-start sm:items-center bg-slate-800/40 sm:bg-transparent p-4 sm:p-0 rounded-lg border border-slate-700 sm:border-none group"
                  >
                    <div className="w-full flex-1">
                      <Label className="sm:hidden text-xs text-slate-400 mb-1 block">
                        Descrição
                      </Label>
                      <Input
                        value={item.desc}
                        onChange={(e) => updateItem(i, 'desc', e.target.value)}
                        placeholder="Descreva o serviço/material"
                        className="w-full bg-slate-800 border-slate-700 text-white min-h-[44px]"
                      />
                    </div>
                    <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto items-end sm:items-center">
                      <div className="w-24">
                        <Label className="sm:hidden text-xs text-slate-400 mb-1 block">Qtd</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.qty || ''}
                          onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                          placeholder="Qtd"
                          className="w-full text-center bg-slate-800 border-slate-700 text-white min-h-[44px]"
                        />
                      </div>
                      <div className="flex-1 sm:w-32">
                        <Label className="sm:hidden text-xs text-slate-400 mb-1 block">
                          Preço Unit.
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.price || ''}
                          onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                          placeholder="0.00"
                          className="w-full text-right bg-slate-800 border-slate-700 text-white min-h-[44px]"
                        />
                      </div>
                      <div className="w-full sm:w-28 text-right flex flex-row justify-between sm:flex-col sm:justify-end h-full">
                        <Label className="sm:hidden text-xs text-slate-400 mt-2 sm:mt-0 block text-left sm:text-right w-auto my-auto">
                          Subtotal
                        </Label>
                        <div className="font-semibold text-[#3498db] sm:text-slate-300 sm:bg-slate-800 px-3 py-2 rounded sm:border border-slate-700 h-[44px] flex items-center justify-end">
                          R$ {(item.qty * item.price).toFixed(2)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                        className="w-full sm:w-10 h-11 sm:h-[44px] text-slate-400 hover:text-red-400 hover:bg-red-950/50 shrink-0 border border-slate-700 sm:border-none mt-2 sm:mt-0"
                      >
                        <Trash className="h-4 w-4 mr-2 sm:mr-0" />
                        <span className="sm:hidden">Remover Item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="mt-4 border-dashed border-2 border-slate-700 hover:border-[#3498db] hover:text-[#3498db] text-slate-300 hover:bg-slate-800 bg-transparent w-full min-h-[48px]"
                onClick={() => setItems([...items, { desc: '', qty: 1, price: 0 }])}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Linha
              </Button>
            </div>

            <div className="flex flex-col items-center pt-6 border-t border-slate-700 mt-4 gap-6">
              <div className="flex flex-col items-center gap-1 w-full text-center">
                <div className="text-sm text-slate-400">Total do Orçamento</div>
                <div className="text-3xl font-black text-[#3498db]">R$ {total.toFixed(2)}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  onClick={() => handleSave('draft', false)}
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 min-h-[48px]"
                >
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={() => handleSave('approved', false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white min-h-[48px]"
                >
                  Salvar e Gerar PDF
                </Button>
                <Button
                  onClick={() => handleSave('approved', true)}
                  className="flex-1 bg-[#3498db] hover:bg-[#2980b9] text-white min-h-[48px]"
                >
                  Salvar e Enviar Email
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedDoc && (
        <EmailSenderDialog
          open={emailOpen}
          onOpenChange={setEmailOpen}
          documentName={`Orçamento - ${selectedDoc.client_name}`}
        />
      )}
    </div>
  )
}
