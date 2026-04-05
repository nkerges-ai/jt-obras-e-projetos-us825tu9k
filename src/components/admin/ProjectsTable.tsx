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
import { CloudProject } from '@/services/projects'

interface ProjectsTableProps {
  projects: CloudProject[]
  onEdit: (p: CloudProject) => void
  onDelete: (id: string) => void
}

export function ProjectsTable({ projects, onEdit, onDelete }: ProjectsTableProps) {
  return (
    <div className="bg-[#1e293b] rounded-xl shadow-sm border border-slate-800 overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <Table className="w-full min-w-[600px] md:min-w-full">
          <TableHeader className="bg-slate-800/50">
            <TableRow className="border-slate-800">
              <TableHead className="text-slate-300">Obra</TableHead>
              <TableHead className="text-slate-300 hidden md:table-cell">Status</TableHead>
              <TableHead className="text-slate-300 hidden md:table-cell">Início</TableHead>
              <TableHead className="text-slate-300 hidden sm:table-cell">Valor Total</TableHead>
              <TableHead className="text-right text-slate-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id} className="border-slate-800 hover:bg-slate-800/50">
                <TableCell className="font-medium text-white max-w-[200px] sm:max-w-none truncate sm:whitespace-normal">
                  <div className="flex flex-col gap-1">
                    <span className="truncate">{p.name}</span>
                    <div className="md:hidden flex flex-wrap gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#3498db]/20 text-[#3498db] whitespace-nowrap">
                        {p.status}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center">
                        {new Date(p.start_date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <span className="sm:hidden text-xs text-slate-300 font-medium mt-0.5">
                      R$ {p.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#3498db]/20 text-[#3498db]">
                    {p.status}
                  </span>
                </TableCell>
                <TableCell className="text-slate-400 hidden md:table-cell">
                  {new Date(p.start_date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-slate-200 font-medium hidden sm:table-cell">
                  R$ {p.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                      className="bg-[#0f172a] border-slate-800 text-slate-200 w-40"
                    >
                      <DropdownMenuItem
                        onClick={() => onEdit(p)}
                        className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                      >
                        <Edit className="mr-2 h-4 w-4" /> Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-800" />
                      <DropdownMenuItem
                        onClick={() => onDelete(p.id)}
                        className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-300 focus:bg-red-950 focus:text-red-300"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhuma obra encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
