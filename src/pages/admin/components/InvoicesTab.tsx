import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, Plus } from 'lucide-react'
import { getProjects, saveProjects, Project, Expense } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export function InvoicesTab() {
  const { toast } = useToast()
  const [projects, setProjects] = useState<Project[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [form, setForm] = useState({
    projectId: '',
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    supplier: '',
    category: 'Matéria Prima',
    amount: '',
  })

  useEffect(() => {
    setProjects(getProjects())
  }, [])

  const allInvoices = projects
    .flatMap((p) =>
      p.expenses
        .filter((e) => e.isInvoice)
        .map((e) => ({ ...e, projectName: p.name, projectId: p.id })),
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault()
    const projIndex = projects.findIndex((p) => p.id === form.projectId)
    if (projIndex === -1) return

    const amountNum = parseFloat(form.amount)
    if (isNaN(amountNum)) return

    const newInvoice: Expense = {
      id: `nf_${Date.now()}`,
      description: `NF ${form.invoiceNumber} - ${form.supplier}`,
      cost: amountNum,
      date: form.date,
      isInvoice: true,
      invoiceNumber: form.invoiceNumber,
      supplier: form.supplier,
      category: form.category,
    }

    const updatedProjects = [...projects]
    updatedProjects[projIndex].expenses.push(newInvoice)

    setProjects(updatedProjects)
    saveProjects(updatedProjects)
    setIsDialogOpen(false)
    setForm({ ...form, invoiceNumber: '', supplier: '', amount: '' })
    toast({ title: 'Nota Fiscal Registrada', description: 'Os custos da obra foram atualizados.' })
  }

  const accountingCategories = [
    'Mão de Obra',
    'Matéria Prima',
    'Locação de Equipamentos',
    'Administrativo',
    'Outros',
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Integração de Notas Fiscais
          </h3>
          <p className="text-muted-foreground text-sm">
            Registre NFs e categorize despesas contábeis por obra.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2 font-bold w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Registrar NF
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Data / NF</TableHead>
              <TableHead>Obra Vinculada</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma nota fiscal registrada no sistema.
                </TableCell>
              </TableRow>
            )}
            {allInvoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  <div className="text-sm">{new Date(inv.date).toLocaleDateString('pt-BR')}</div>
                  <Badge variant="outline" className="text-xs font-mono mt-1">
                    NF: {inv.invoiceNumber}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-sm">{inv.projectName}</TableCell>
                <TableCell className="text-sm">{inv.supplier}</TableCell>
                <TableCell>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                    {inv.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-bold text-red-600">
                  {formatCurrency(inv.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Nota Fiscal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddInvoice} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Vincular à Obra / Projeto</Label>
              <Select
                required
                value={form.projectId}
                onValueChange={(v) => setForm({ ...form, projectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a obra..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Número da NF</Label>
                <Input
                  required
                  value={form.invoiceNumber}
                  onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                  placeholder="Ex: 001234"
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Emissão</Label>
                <Input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fornecedor / Emitente</Label>
              <Input
                required
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                placeholder="Razão Social ou Nome"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria Contábil</Label>
                <Select
                  required
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountingCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Gravar Nota Fiscal
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
