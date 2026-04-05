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
  }, [])

  const resetForm = () => {
    setClientName('')
    setItems([{ desc: '', qty: 1, price: 0 }])
    setEditingId(null)
  }

  const handleEdit = (b: any) => {
    setClientName(b.client_name)
    setItems(b.content_json || [{ desc: '', qty: 1, price: 0 }])
    setEditingId(b.id)
    setActiveTab('editor')
  }

  const total = items.reduce((acc, curr) => acc + curr.qty * curr.price, 0)

  const handleSave = async (status: 'draft' | 'approved' = 'draft') => {
    try {
      const payload = {
        user_id: user.id,
        client_name: clientName,
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
      fetchBudgets()
      resetForm()
      setActiveTab('list')
    } catch (e) {
      toast({ title: 'Erro', description: 'Erro ao salvar o orçamento.', variant: 'destructive' })
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
      <h1 className="text-3xl font-bold text-white">Orçamentos</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
          >
            Orçamentos Salvos
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            onClick={resetForm}
          >
            {editingId ? 'Editar Orçamento' : 'Novo Orçamento'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 overflow-x-auto">
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${b.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'}`}
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
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-700 pb-4">
              <FileSpreadsheet className="h-6 w-6 text-[#3498db]" />
              <h2 className="text-xl font-bold text-white">Planilha do Orçamento</h2>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-medium">Cliente / Obra Referência</Label>
              <Input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Reforma Condomínio Y"
                className="h-12 bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="pt-4">
              <Label className="mb-4 block text-slate-300 font-medium">
                Itens de Serviço e Materiais
              </Label>

              <div className="overflow-x-auto pb-4">
                <div className="min-w-[700px] space-y-3">
                  <div className="flex gap-2 px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div className="flex-1">Descrição</div>
                    <div className="w-20 text-center">Qtd</div>
                    <div className="w-32 text-center">Preço Unit.</div>
                    <div className="w-28 text-right">Subtotal</div>
                    <div className="w-10"></div>
                  </div>

                  {items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-center group">
                      <Input
                        value={item.desc}
                        onChange={(e) => updateItem(i, 'desc', e.target.value)}
                        placeholder="Descreva o serviço/material"
                        className="flex-1 bg-slate-800 border-slate-700 text-white"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={item.qty || ''}
                        onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                        placeholder="Qtd"
                        className="w-20 text-center bg-slate-800 border-slate-700 text-white"
                      />
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price || ''}
                        onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                        placeholder="0.00"
                        className="w-32 text-right bg-slate-800 border-slate-700 text-white"
                      />
                      <div className="w-28 text-right font-semibold text-slate-300 bg-slate-800 px-3 py-2 rounded border border-slate-700">
                        R$ {(item.qty * item.price).toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                        className="w-11 h-11 sm:w-10 sm:h-10 text-slate-400 hover:text-red-400 hover:bg-red-950/50 shrink-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                className="mt-4 border-dashed border-2 border-slate-700 hover:border-[#3498db] hover:text-[#3498db] text-slate-300 hover:bg-slate-800 bg-transparent w-full min-h-[44px]"
                onClick={() => setItems([...items, { desc: '', qty: 1, price: 0 }])}
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Linha
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-slate-700 mt-4 gap-4">
              <div className="text-sm text-slate-400 w-full sm:w-auto text-center sm:text-left">
                Total calculado automaticamente
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                <div className="text-2xl font-black text-[#3498db]">R$ {total.toFixed(2)}</div>
                <Button
                  onClick={() => handleSave('draft')}
                  className="w-full sm:w-auto bg-[#3498db] hover:bg-[#2980b9] text-white min-h-[48px] px-8"
                >
                  Salvar e Exportar PDF
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
