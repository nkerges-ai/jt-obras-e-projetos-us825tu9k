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
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Search,
  MoreVertical,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  const [searchTerm, setSearchTerm] = useState('')

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

  const filteredCustomers = customers.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isFormValid =
    formData.name &&
    formData.email &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.phone &&
    formData.tax_id &&
    formData.address_zip &&
    formData.address_street &&
    formData.address_number &&
    formData.address_city &&
    formData.address_state

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" /> Clientes
          </h3>
          <p className="text-gray-500 text-sm">
            Gerencie o cadastro centralizado de seus clientes.
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gap-2 font-bold w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Buscar cliente por nome..."
            className="pl-9 border-gray-300 focus-visible:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-gray-600 font-semibold">Nome</TableHead>
                <TableHead className="text-gray-600 font-semibold">Email</TableHead>
                <TableHead className="text-gray-600 font-semibold">Telefone</TableHead>
                <TableHead className="text-gray-600 font-semibold">Tipo</TableHead>
                <TableHead className="text-right text-gray-600 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      {c.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {c.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {c.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {c.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:text-gray-900 focus-visible:ring-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-[#0f172a] text-slate-200 border-slate-800 w-48 shadow-xl"
                      >
                        <DropdownMenuItem
                          onClick={() => openEdit(c)}
                          className="hover:bg-slate-800 hover:text-white cursor-pointer focus:bg-slate-800 focus:text-white"
                        >
                          <Pencil className="h-4 w-4 mr-2" /> Editar Cliente
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            window.location.href = `mailto:${c.email}`
                          }}
                          className="hover:bg-slate-800 hover:text-white cursor-pointer focus:bg-slate-800 focus:text-white"
                        >
                          <Mail className="h-4 w-4 mr-2" /> Enviar E-mail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(c.id)}
                          className="text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer focus:bg-red-950/50 focus:text-red-300"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Deletar Cliente
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
                <Label className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gray-500" /> CEP
                </Label>
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
                <Label className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gray-500" /> Rua / Logradouro
                </Label>
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
            <Button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!isFormValid}
            >
              Salvar Cliente
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
