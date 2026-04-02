import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, Receipt } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addAuditLog, getTechnicalDocuments, saveTechnicalDocuments } from '@/lib/storage'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function BudgetEditor() {
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState({
    clientName: '',
    projectName: '',
    items: [{ desc: '', qty: 1, unit: 'un', price: 0 }],
    notes: 'Validade desta proposta é de 15 dias. Condições de pagamento a combinar.',
    date: new Date().toLocaleDateString('pt-BR'),
  })

  useEffect(() => {
    if (id) {
      const docs = getTechnicalDocuments()
      const doc = docs.find((d) => d.id === id)
      if (doc && doc.data) {
        setData(doc.data)
      }
    }
  }, [id])

  const handleSave = () => {
    const docs = getTechnicalDocuments()
    const newDoc = {
      id: id || `orcamento_${Date.now()}`,
      name: `Orçamento_${data.clientName || 'Cliente'}.pdf`,
      category: 'Orçamento',
      uploadDate: new Date().toISOString(),
      projectId: 'global',
      isRestricted: false,
      url: 'data:application/pdf;base64,dummy',
      type: 'orcamento' as const,
      data: data,
    }

    if (id) {
      saveTechnicalDocuments(docs.map((d) => (d.id === id ? newDoc : d)))
    } else {
      saveTechnicalDocuments([newDoc, ...docs])
    }

    addAuditLog({
      userId: 'Admin',
      action: id ? 'Editar Orçamento' : 'Gerar Orçamento',
      table: 'Documentos',
      newData: JSON.stringify(data),
    })
    toast({ title: 'Salvo no Acervo', description: 'Orçamento salvo com sucesso.' })
  }

  const addItem = () =>
    setData({ ...data, items: [...data.items, { desc: '', qty: 1, unit: 'un', price: 0 }] })

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...data.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setData({ ...data, items: newItems })
  }

  const total = data.items.reduce((acc, curr) => acc + curr.qty * curr.price, 0)

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate flex items-center gap-2">
              <Receipt className="h-5 w-5" /> Editor de Orçamento
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Salvar Acervo
            </Button>
            <Button onClick={() => window.print()} size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir (PDF)
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 print:p-0 flex flex-col xl:flex-row items-start gap-8 mt-6 print:m-0">
        <div className="w-full xl:w-[450px] shrink-0 bg-white p-6 rounded-xl border shadow-sm print:hidden">
          <h2 className="font-bold mb-4 text-brand-navy border-b pb-2">Dados do Orçamento</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Nome do Cliente</Label>
              <Input
                value={data.clientName}
                onChange={(e) => setData({ ...data, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Nome do Projeto/Obra</Label>
              <Input
                value={data.projectName}
                onChange={(e) => setData({ ...data, projectName: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t space-y-3">
              <Label className="font-bold text-brand-navy">Itens do Orçamento</Label>
              {data.items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start border p-2 rounded bg-gray-50">
                  <Input
                    value={item.desc}
                    onChange={(e) => updateItem(i, 'desc', e.target.value)}
                    placeholder="Descrição"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                    className="w-16"
                    placeholder="Qtd"
                  />
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                    className="w-24"
                    placeholder="R$"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addItem} className="w-full">
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-1 pt-4 border-t">
              <Label>Observações / Condições</Label>
              <Textarea
                value={data.notes}
                onChange={(e) => setData({ ...data, notes: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Data</Label>
              <Input
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center pb-12 print:pb-0">
          <DocumentLetterhead title="PROPOSTA COMERCIAL / ORÇAMENTO">
            <div className="space-y-6">
              <div className="bg-gray-50 border p-4 rounded mb-6">
                <p>
                  <strong>Para:</strong> {data.clientName || 'Cliente'}
                </p>
                <p>
                  <strong>Referência:</strong> {data.projectName || 'Projeto'}
                </p>
                <p>
                  <strong>Data:</strong> {data.date}
                </p>
              </div>

              <Table className="border rounded-lg">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Descrição do Serviço/Material</TableHead>
                    <TableHead className="w-20 text-center">Qtd</TableHead>
                    <TableHead className="w-32 text-right">Valor Unit. (R$)</TableHead>
                    <TableHead className="w-32 text-right">Total (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>{item.desc || '...'}</TableCell>
                      <TableCell className="text-center">{item.qty}</TableCell>
                      <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {(item.qty * item.price).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={3} className="text-right text-brand-navy">
                      VALOR TOTAL DO ORÇAMENTO:
                    </TableCell>
                    <TableCell className="text-right text-brand-navy text-lg border-t border-gray-300">
                      R$ {total.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <div className="pt-6">
                <h4 className="font-bold uppercase text-sm mb-2 text-brand-navy">
                  Condições e Observações
                </h4>
                <p className="text-sm bg-gray-50 p-4 border rounded whitespace-pre-wrap">
                  {data.notes}
                </p>
              </div>

              <div className="pt-16 flex justify-center">
                <div className="flex flex-col items-center w-64">
                  <div className="w-full border-t border-black mb-2"></div>
                  <p className="font-bold text-brand-navy">JT OBRAS E MANUTENÇÕES LTDA</p>
                  <p className="text-xs">Depto. Comercial</p>
                </div>
              </div>
            </div>
          </DocumentLetterhead>
        </div>
      </div>
    </div>
  )
}
