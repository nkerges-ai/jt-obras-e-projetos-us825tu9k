import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { Trash, Plus, FileSpreadsheet, Printer, Download } from 'lucide-react'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { exportHtmlToWord } from '@/lib/export-utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Budgets() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [budgets, setBudgets] = useState<any[]>([])
  const [printDoc, setPrintDoc] = useState<any>(null)
  const [clientName, setClientName] = useState('')
  const [items, setItems] = useState<{ desc: string; qty: number; price: number }[]>([
    { desc: '', qty: 1, price: 0 },
  ])

  const fetchBudgets = async () => {
    const records = await pb.collection('budgets').getFullList({ sort: '-created' })
    setBudgets(records)
  }
  useEffect(() => {
    fetchBudgets()
  }, [])

  const total = items.reduce((acc, curr) => acc + curr.qty * curr.price, 0)

  const handleSave = async () => {
    try {
      await pb.collection('budgets').create({
        user_id: user.id,
        client_name: clientName,
        content_json: items,
        total_value: total,
        status: 'draft',
      })
      toast({ title: 'Sucesso', description: 'Orçamento gerado e salvo com sucesso.' })
      fetchBudgets()
      setClientName('')
      setItems([{ desc: '', qty: 1, price: 0 }])
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o orçamento.',
        variant: 'destructive',
      })
    }
  }

  const updateItem = (index: number, field: string, val: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: val }
    setItems(newItems)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Montagem de Orçamentos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6 space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <FileSpreadsheet className="h-6 w-6 text-[#3498db]" />
            <h2 className="text-xl font-bold text-slate-800">Planilha do Novo Orçamento</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 font-medium">Cliente / Obra Referência</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Ex: Reforma Condomínio Y"
              className="h-12"
            />
          </div>

          <div className="pt-4">
            <Label className="mb-4 block text-slate-700 font-medium">
              Itens de Serviço e Materiais
            </Label>

            <div className="overflow-x-auto pb-4">
              <div className="min-w-[700px] space-y-3">
                <div className="flex gap-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
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
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min="1"
                      value={item.qty || ''}
                      onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                      placeholder="Qtd"
                      className="w-20 text-center"
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price || ''}
                      onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                      placeholder="0.00"
                      className="w-32 text-right"
                    />
                    <div className="w-28 text-right font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded border">
                      R$ {(item.qty * item.price).toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                      className="w-11 h-11 sm:w-10 sm:h-10 text-slate-300 hover:text-red-500 hover:bg-red-50 shrink-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-4 border-dashed border-2 hover:border-[#3498db] hover:text-[#3498db] w-full min-h-[44px]"
              onClick={() => setItems([...items, { desc: '', qty: 1, price: 0 }])}
            >
              <Plus className="h-4 w-4 mr-2" /> Adicionar Nova Linha
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t mt-4 gap-4">
            <div className="text-sm text-slate-500 w-full sm:w-auto text-center sm:text-left">
              Total calculado automaticamente
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="text-2xl font-black text-[#3498db]">R$ {total.toFixed(2)}</div>
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 min-h-[48px] px-8"
              >
                Salvar e Exportar PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 rounded-lg p-6 border border-slate-200 h-fit">
          <h2 className="text-lg font-bold mb-4 text-slate-800">Orçamentos Recentes</h2>
          <div className="space-y-3">
            {budgets.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 rounded shadow-sm border border-slate-100 flex flex-col gap-1 transition-all hover:border-[#3498db]"
              >
                <p className="font-bold text-slate-800 truncate">{b.client_name}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-slate-600">
                    R$ {b.total_value.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-400">
                      {new Date(b.created).toLocaleDateString()}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setPrintDoc(b)}
                    >
                      <Printer className="h-4 w-4 text-[#3498db]" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {budgets.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">Nenhum orçamento anterior.</p>
            )}
          </div>
        </div>
      </div>

      {/* Print View Overlay */}
      {printDoc && (
        <div className="fixed inset-0 bg-black/60 z-[100] overflow-y-auto print:bg-white print:overflow-visible">
          <div className="min-h-screen py-8 px-4 print:p-0 print:m-0 flex flex-col items-center">
            <div className="bg-white p-4 w-full max-w-[210mm] flex justify-between items-center rounded-t-lg print:hidden shrink-0 shadow-lg">
              <h2 className="font-bold text-lg">Visualização do Orçamento</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById('budget-print-area')
                    if (el) exportHtmlToWord(el.innerHTML, `Orcamento_${printDoc.client_name}`)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Exportar Word
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Imprimir PDF
                </Button>
                <Button variant="ghost" onClick={() => setPrintDoc(null)}>
                  Fechar
                </Button>
              </div>
            </div>

            <div id="budget-print-area" className="w-full flex justify-center">
              <DocumentLetterhead title="ORÇAMENTO DE PRESTAÇÃO DE SERVIÇOS">
                <div className="mb-6 bg-slate-50 p-4 border rounded">
                  <p>
                    <strong>Cliente:</strong> {printDoc.client_name}
                  </p>
                  <p>
                    <strong>Data de Emissão:</strong>{' '}
                    {new Date(printDoc.created).toLocaleDateString()}
                  </p>
                </div>

                <Table className="border mb-8">
                  <TableHeader className="bg-slate-100">
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead className="text-center w-24">Qtd</TableHead>
                      <TableHead className="text-right w-32">Valor Unit. (R$)</TableHead>
                      <TableHead className="text-right w-32">Subtotal (R$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {printDoc.content_json?.map((item: any, i: number) => (
                      <TableRow key={i}>
                        <TableCell>{item.desc}</TableCell>
                        <TableCell className="text-center">{item.qty}</TableCell>
                        <TableCell className="text-right">{item.price?.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {(item.qty * item.price)?.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-slate-50">
                      <TableCell
                        colSpan={3}
                        className="text-right font-bold uppercase text-[#005A9C]"
                      >
                        Valor Total do Orçamento:
                      </TableCell>
                      <TableCell className="text-right font-black text-lg text-[#005A9C]">
                        R$ {printDoc.total_value?.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="mt-16 text-center">
                  <div className="w-64 mx-auto border-t border-black pt-2">
                    <p className="font-bold uppercase text-sm">
                      {user?.company || 'JT OBRAS E MANUTENÇÕES LTDA'}
                    </p>
                    <p className="text-xs text-gray-500">Departamento Comercial</p>
                  </div>
                </div>
              </DocumentLetterhead>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
