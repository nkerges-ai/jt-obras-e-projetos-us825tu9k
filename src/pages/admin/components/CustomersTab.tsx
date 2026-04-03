import { useState, useEffect } from 'react'
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type Customer,
} from '@/services/customers'
import { useRealtime } from '@/hooks/use-realtime'
import { extractFieldErrors } from '@/lib/pocketbase/errors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Users, Plus, Pencil, Trash2 } from 'lucide-react'

const maskPhone = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})/, '$1-$2')
    .slice(0, 15)
const maskCPF = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14)
const maskCNPJ = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})/, '$1-$2')
    .slice(0, 18)
const maskZip = (v: string) =>
  v
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 9)

export function CustomersTab() {
  const { toast } = useToast()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Customer>>({ type: 'PJ' })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  const loadData = async () => setCustomers(await getCustomers())
  useEffect(() => {
    loadData()
  }, [])
  useRealtime('customers', () => loadData())

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})
    try {
      if (isEditing && formData.id) await updateCustomer(formData.id, formData)
      else await createCustomer(formData)
      setIsOpen(false)
      toast({ title: 'Sucesso', description: 'Cliente salvo com sucesso.' })
    } catch (err) {
      setFieldErrors(extractFieldErrors(err))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente deletar este cliente?')) return
    try {
      await deleteCustomer(id)
      toast({ title: 'Sucesso', description: 'Cliente removido.' })
    } catch (err) {
      toast({ title: 'Erro', description: 'Erro ao remover cliente.', variant: 'destructive' })
    }
  }

  const openNew = () => {
    setFormData({ type: 'PJ' })
    setIsEditing(false)
    setFieldErrors({})
    setIsOpen(true)
  }
  const openEdit = (c: Customer) => {
    setFormData(c)
    setIsEditing(true)
    setFieldErrors({})
    setIsOpen(true)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Clientes (CRM)
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie o cadastro centralizado de seus clientes.
          </p>
        </div>
        <Button onClick={openNew} className="gap-2 font-bold w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Nome / Razão Social</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Documento (CPF/CNPJ)</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.tax_id}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(c)}
                      className="h-8 w-8 text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(c.id)}
                      className="h-8 w-8 text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Cliente</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: 'PF' | 'PJ') =>
                    setFormData({ ...formData, type: v, tax_id: '' })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PF">Pessoa Física (PF)</SelectItem>
                    <SelectItem value="PJ">Pessoa Jurídica (PJ)</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.type && (
                  <span className="text-xs text-red-500">{fieldErrors.type}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Nome / Razão Social</Label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                {fieldErrors.name && (
                  <span className="text-xs text-red-500">{fieldErrors.name}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Documento ({formData.type === 'PF' ? 'CPF' : 'CNPJ'})</Label>
                <Input
                  value={formData.tax_id || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tax_id:
                        formData.type === 'PF' ? maskCPF(e.target.value) : maskCNPJ(e.target.value),
                    })
                  }
                  required
                />
                {fieldErrors.tax_id && (
                  <span className="text-xs text-red-500">{fieldErrors.tax_id}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                {fieldErrors.email && (
                  <span className="text-xs text-red-500">{fieldErrors.email}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                  required
                />
                {fieldErrors.phone && (
                  <span className="text-xs text-red-500">{fieldErrors.phone}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>CEP</Label>
                <Input
                  value={formData.address_zip || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, address_zip: maskZip(e.target.value) })
                  }
                  required
                />
                {fieldErrors.address_zip && (
                  <span className="text-xs text-red-500">{fieldErrors.address_zip}</span>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Rua / Logradouro</Label>
                <Input
                  value={formData.address_street || ''}
                  onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
                  required
                />
                {fieldErrors.address_street && (
                  <span className="text-xs text-red-500">{fieldErrors.address_street}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Número</Label>
                <Input
                  value={formData.address_number || ''}
                  onChange={(e) => setFormData({ ...formData, address_number: e.target.value })}
                  required
                />
                {fieldErrors.address_number && (
                  <span className="text-xs text-red-500">{fieldErrors.address_number}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Complemento</Label>
                <Input
                  value={formData.address_complement || ''}
                  onChange={(e) => setFormData({ ...formData, address_complement: e.target.value })}
                />
                {fieldErrors.address_complement && (
                  <span className="text-xs text-red-500">{fieldErrors.address_complement}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Cidade</Label>
                <Input
                  value={formData.address_city || ''}
                  onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                  required
                />
                {fieldErrors.address_city && (
                  <span className="text-xs text-red-500">{fieldErrors.address_city}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Input
                  value={formData.address_state || ''}
                  onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                  required
                />
                {fieldErrors.address_state && (
                  <span className="text-xs text-red-500">{fieldErrors.address_state}</span>
                )}
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              Salvar Cliente
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
