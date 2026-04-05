import { Edit, Trash2, MoreVertical, Eye, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CloudProject } from '@/services/projects'

export function ProjectsTable({
  projects,
  onEdit,
  onDelete,
}: {
  projects: CloudProject[]
  onEdit: (p: CloudProject) => void
  onDelete: (id: string) => void
}) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const statusMap: Record<string, { label: string; className: string }> = {
    Planning: { label: 'Planejamento', className: 'bg-gray-100 text-gray-800' },
    'In Execution': { label: 'Em Execução', className: 'bg-blue-100 text-blue-800' },
    Paused: { label: 'Pausada', className: 'bg-orange-100 text-orange-800' },
    Completed: { label: 'Concluída', className: 'bg-green-100 text-green-800' },
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const [year, month, day] = dateStr.split('T')[0].split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">Obra</TableHead>
            <TableHead className="font-semibold text-gray-700">Cliente</TableHead>
            <TableHead className="font-semibold text-gray-700">Início</TableHead>
            <TableHead className="font-semibold text-gray-700">Valor Total</TableHead>
            <TableHead className="font-semibold text-gray-700">Status</TableHead>
            <TableHead className="text-right font-semibold text-gray-700">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-12">
                Nenhuma obra encontrada.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((p) => (
              <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                <TableCell className="text-gray-600">{p.expand?.client_id?.name || '-'}</TableCell>
                <TableCell className="text-gray-600">{formatDate(p.start_date)}</TableCell>
                <TableCell className="text-gray-600 font-medium">
                  {formatCurrency(p.total_value)}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusMap[p.status]?.className} border-0`}
                    variant="secondary"
                  >
                    {statusMap[p.status]?.label || p.status}
                  </Badge>
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
                        onClick={() => onEdit(p)}
                        className="hover:bg-slate-800 hover:text-white cursor-pointer focus:bg-slate-800 focus:text-white"
                      >
                        <Edit className="h-4 w-4 mr-2" /> Editar Obra
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {}}
                        className="hover:bg-slate-800 hover:text-white cursor-pointer focus:bg-slate-800 focus:text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" /> Ver Detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(p.id)}
                        className="text-red-400 hover:bg-red-950/50 hover:text-red-300 cursor-pointer focus:bg-red-950/50 focus:text-red-300"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Deletar Obra
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
