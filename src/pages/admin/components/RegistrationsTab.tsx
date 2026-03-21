import { useState, useEffect } from 'react'
import {
  getContractors,
  saveContractors,
  getEmployees,
  saveEmployees,
  Contractor,
  Employee,
} from '@/lib/storage'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Trash2, Building2, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function RegistrationsTab() {
  const { toast } = useToast()
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  const [isContractorOpen, setIsContractorOpen] = useState(false)
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false)

  const [newContractor, setNewContractor] = useState<Partial<Contractor>>({})
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ nrs: [] })

  const [deleteItem, setDeleteItem] = useState<{
    id: string
    type: 'contractor' | 'employee'
  } | null>(null)

  useEffect(() => {
    setContractors(getContractors())
    setEmployees(getEmployees())
  }, [])

  const handleSaveContractor = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContractor.name) return
    const id = `c_${Date.now()}`
    const updated = [{ ...newContractor, id } as Contractor, ...contractors]
    setContractors(updated)
    saveContractors(updated)
    setIsContractorOpen(false)
    setNewContractor({})
    toast({ title: 'Contratante Salvo', description: 'Cadastro adicionado com sucesso.' })
  }

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmployee.name) return
    const id = `e_${Date.now()}`
    const updated = [{ ...newEmployee, id, nrs: newEmployee.nrs || [] } as Employee, ...employees]
    setEmployees(updated)
    saveEmployees(updated)
    setIsEmployeeOpen(false)
    setNewEmployee({ nrs: [] })
    toast({ title: 'Parceiro Salvo', description: 'Cadastro e treinamentos atualizados.' })
  }

  const handleConfirmDelete = () => {
    if (!deleteItem) return
    if (deleteItem.type === 'contractor') {
      const updated = contractors.filter((c) => c.id !== deleteItem.id)
      setContractors(updated)
      saveContractors(updated)
      toast({ title: 'Empresa Excluída', description: 'O cadastro foi removido com sucesso.' })
    } else {
      const updated = employees.filter((e) => e.id !== deleteItem.id)
      setEmployees(updated)
      saveEmployees(updated)
      toast({ title: 'Parceiro Excluído', description: 'O cadastro foi removido com sucesso.' })
    }
    setDeleteItem(null)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <Building2 className="h-5 w-5 text-primary" /> Base de Cadastros Centralizada
        </h3>
        <p className="text-muted-foreground text-sm">
          Gerencie informações de clientes e parceiros para preenchimento automático de OS e NRs.
        </p>
      </div>

      <Tabs defaultValue="contractors" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="contractors" className="gap-2">
            <Building2 className="h-4 w-4" /> Contratantes
          </TabsTrigger>
          <TabsTrigger value="employees" className="gap-2">
            <Users className="h-4 w-4" /> Parceiros / Colaboradores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contractors">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsContractorOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Contratante
            </Button>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Razão Social / Nome</TableHead>
                  <TableHead>CNPJ / CPF</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead className="text-right w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Nenhum contratante cadastrado.
                    </TableCell>
                  </TableRow>
                )}
                {contractors.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.cnpj}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{c.address}</TableCell>
                    <TableCell>{c.contact}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        onClick={() => setDeleteItem({ id: c.id, type: 'contractor' })}
                        title="Excluir cadastro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="employees">
          <div className="flex justify-end mb-4">
            <Button onClick={() => setIsEmployeeOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Parceiro / Colaborador
            </Button>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Nome Completo</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data de Admissão</TableHead>
                  <TableHead>Treinamentos (NRs)</TableHead>
                  <TableHead className="text-right w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum parceiro ou colaborador cadastrado.
                    </TableCell>
                  </TableRow>
                )}
                {employees.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell>{e.cpf}</TableCell>
                    <TableCell>{e.role}</TableCell>
                    <TableCell>{new Date(e.hireDate).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {e.nrs.length > 0 ? e.nrs.map((n) => n.nr).join(', ') : 'Nenhum'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                        onClick={() => setDeleteItem({ id: e.id, type: 'employee' })}
                        title="Excluir parceiro"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isContractorOpen} onOpenChange={setIsContractorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Contratante</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveContractor} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome / Razão Social</Label>
              <Input
                required
                value={newContractor.name || ''}
                onChange={(e) => setNewContractor({ ...newContractor, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CNPJ / CPF</Label>
                <Input
                  required
                  value={newContractor.cnpj || ''}
                  onChange={(e) => setNewContractor({ ...newContractor, cnpj: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input
                  required
                  value={newContractor.contact || ''}
                  onChange={(e) => setNewContractor({ ...newContractor, contact: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Endereço Completo</Label>
              <Input
                required
                value={newContractor.address || ''}
                onChange={(e) => setNewContractor({ ...newContractor, address: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full mt-4">
              Salvar Cadastro
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEmployeeOpen} onOpenChange={setIsEmployeeOpen}>
        <DialogContent className="max-w-md max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Parceiro / Colaborador</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveEmployee} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input
                required
                value={newEmployee.name || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  required
                  value={newEmployee.cpf || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, cpf: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Admissão / Início</Label>
                <Input
                  type="date"
                  required
                  value={newEmployee.hireDate || ''}
                  onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Função / Cargo</Label>
              <Input
                required
                value={newEmployee.role || ''}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              />
            </div>

            <div className="space-y-2 border p-3 rounded bg-gray-50 mt-4">
              <div className="flex justify-between items-center mb-2">
                <Label className="font-bold">Treinamentos e NRs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    setNewEmployee({
                      ...newEmployee,
                      nrs: [
                        ...(newEmployee.nrs || []),
                        { nr: 'NR-35', date: '', expirationDate: '' },
                      ],
                    })
                  }
                >
                  <Plus className="h-3 w-3 mr-1" /> Adicionar
                </Button>
              </div>
              {newEmployee.nrs?.map((nr, idx) => (
                <div key={idx} className="flex gap-2 items-center mb-2">
                  <Select
                    value={nr.nr}
                    onValueChange={(v) => {
                      const updated = [...(newEmployee.nrs || [])]
                      updated[idx].nr = v
                      setNewEmployee({ ...newEmployee, nrs: updated })
                    }}
                  >
                    <SelectTrigger className="w-[100px] h-8 text-xs bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NR-06">NR-06</SelectItem>
                      <SelectItem value="NR-10">NR-10</SelectItem>
                      <SelectItem value="NR-18">NR-18</SelectItem>
                      <SelectItem value="NR-35">NR-35</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex-1 space-y-1">
                    <Input
                      type="date"
                      className="h-8 text-xs bg-white w-full"
                      placeholder="Vencimento"
                      required
                      value={nr.expirationDate}
                      onChange={(e) => {
                        const updated = [...(newEmployee.nrs || [])]
                        updated[idx].expirationDate = e.target.value
                        setNewEmployee({ ...newEmployee, nrs: updated })
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 shrink-0"
                    onClick={() => {
                      const updated = (newEmployee.nrs || []).filter((_, i) => i !== idx)
                      setNewEmployee({ ...newEmployee, nrs: updated })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <Button type="submit" className="w-full mt-4">
              Salvar Cadastro
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja excluir este cadastro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O registro será permanentemente removido da base de
              dados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
