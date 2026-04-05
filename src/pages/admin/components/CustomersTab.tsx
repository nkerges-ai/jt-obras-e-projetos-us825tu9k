import { useEffect, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import { MoreVertical, Edit, Trash } from 'lucide-react'
import { getCustomers, Customer, deleteCustomer } from '@/services/customers'
import { useToast } from '@/hooks/use-toast'

export function CustomersTab() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const { toast } = useToast()

  const loadData = async () => {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return
    try {
      await deleteCustomer(id)
      toast({ title: 'Cliente excluído com sucesso.' })
      loadData()
    } catch (e) {
      toast({ title: 'Erro ao excluir cliente.', variant: 'destructive' })
    }
  }

  return (
    <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-800 overflow-hidden animate-fade-in-up">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-300">Nome</TableHead>
              <TableHead className="text-slate-300">E-mail</TableHead>
              <TableHead className="text-slate-300">Telefone</TableHead>
              <TableHead className="text-slate-300">Documento</TableHead>
              <TableHead className="text-right text-slate-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-white">{c.name}</TableCell>
                <TableCell className="text-slate-400">{c.email}</TableCell>
                <TableCell className="text-slate-400">{c.phone}</TableCell>
                <TableCell className="text-slate-400">{c.tax_id}</TableCell>
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
                      className="bg-[#0f172a] border-slate-800 text-slate-200 w-40"
                    >
                      <DropdownMenuItem
                        className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                        onClick={() =>
                          toast({
                            title: 'Em breve',
                            description: 'Edição de cliente em desenvolvimento.',
                          })
                        }
                      >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-800" />
                      <DropdownMenuItem
                        onClick={() => handleDelete(c.id)}
                        className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-300 focus:bg-red-950 focus:text-red-300"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum cliente cadastrado no sistema.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
