import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign, Plus, TrendingUp, AlertCircle } from 'lucide-react'
import { Project, Expense } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

interface ProjectCostsTabProps {
  project: Project
  onUpdate: (updated: Project) => void
}

export function ProjectCostsTab({ project, onUpdate }: ProjectCostsTabProps) {
  const { toast } = useToast()
  const [newBudget, setNewBudget] = useState(project.budget.toString())
  const [expenseForm, setExpenseForm] = useState({ description: '', cost: '' })

  const totalExpenses = useMemo(
    () => project.expenses.reduce((acc, curr) => acc + curr.cost, 0),
    [project.expenses],
  )
  const profit = project.budget - totalExpenses
  const margin = project.budget > 0 ? ((profit / project.budget) * 100).toFixed(1) : 0

  const handleUpdateBudget = () => {
    const budgetNum = parseFloat(newBudget)
    if (!isNaN(budgetNum)) {
      onUpdate({ ...project, budget: budgetNum })
      toast({ title: 'Orçamento Atualizado', description: 'O valor base do projeto foi alterado.' })
    }
  }

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const costNum = parseFloat(expenseForm.cost)
    if (!expenseForm.description || isNaN(costNum)) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description: expenseForm.description,
      cost: costNum,
      date: new Date().toISOString(),
    }

    onUpdate({ ...project, expenses: [...project.expenses, newExpense] })
    setExpenseForm({ description: '', cost: '' })
    toast({ title: 'Despesa Registrada', description: 'Custo adicionado ao relatório da obra.' })
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  return (
    <div className="space-y-6 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex flex-col justify-center">
          <p className="text-sm font-medium text-blue-800 mb-1">Orçamento Total</p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              className="h-8 text-sm w-32 bg-white"
            />
            <Button size="sm" variant="outline" className="h-8" onClick={handleUpdateBudget}>
              Salvar
            </Button>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col justify-center">
          <p className="text-sm font-medium text-red-800 mb-1 flex items-center gap-1">
            <AlertCircle className="h-4 w-4" /> Custos Totais
          </p>
          <p className="text-2xl font-bold text-red-900">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex flex-col justify-center">
          <p className="text-sm font-medium text-green-800 mb-1 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Rentabilidade Estimada
          </p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-bold text-green-900">{formatCurrency(profit)}</p>
            <span className="text-sm font-medium text-green-700 pb-1">({margin}%)</span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b bg-secondary/30 flex justify-between items-center">
          <h4 className="font-bold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" /> Relatório de Materiais e Insumos
          </h4>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição do Custo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.expenses.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground py-6">
                  Nenhum custo registrado.
                </TableCell>
              </TableRow>
            )}
            {project.expenses.map((exp) => (
              <TableRow key={exp.id}>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(exp.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium">{exp.description}</TableCell>
                <TableCell className="text-right font-medium text-red-600">
                  -{formatCurrency(exp.cost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <form
        onSubmit={handleAddExpense}
        className="grid grid-cols-1 sm:grid-cols-[1fr_150px_100px] gap-4 items-end bg-secondary/20 p-4 rounded-xl border border-dashed"
      >
        <div className="space-y-2">
          <Label>Descrição do Material / Serviço</Label>
          <Input
            placeholder="Ex: Cimento e Areia"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Custo (R$)</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            value={expenseForm.cost}
            onChange={(e) => setExpenseForm({ ...expenseForm, cost: e.target.value })}
            required
          />
        </div>
        <Button type="submit" className="w-full gap-2">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>
    </div>
  )
}
