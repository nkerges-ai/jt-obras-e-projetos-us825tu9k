import { useState, useEffect } from 'react'
import { getEmployees, Employee } from '@/lib/storage'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export function TrainingExpirationsTab() {
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    setEmployees(getEmployees())
  }, [])

  const getStatus = (dateStr: string) => {
    if (!dateStr)
      return { label: 'Sem Data', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock }
    const diff = Math.ceil(
      (new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    )
    if (diff < 0)
      return {
        label: 'Vencido',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: ShieldAlert,
      }
    if (diff <= 30)
      return {
        label: `Vence em ${diff}d`,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertTriangle,
      }
    return {
      label: 'Válido',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
    }
  }

  const expirations = employees
    .flatMap((emp) =>
      emp.nrs.map((nr) => ({ ...nr, employeeName: emp.name, employeeRole: emp.role })),
    )
    .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <Clock className="h-5 w-5 text-primary" /> Cronograma de Vencimentos (NRs)
        </h3>
        <p className="text-muted-foreground text-sm">
          Acompanhamento centralizado da validade dos treinamentos de segurança da equipe técnica.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Treinamento</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expirations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Nenhum treinamento registrado.
                </TableCell>
              </TableRow>
            )}
            {expirations.map((exp, i) => {
              const status = getStatus(exp.expirationDate)
              const Icon = status.icon
              return (
                <TableRow key={i}>
                  <TableCell className="font-medium">{exp.employeeName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {exp.employeeRole}
                  </TableCell>
                  <TableCell className="font-semibold text-brand-navy">{exp.nr}</TableCell>
                  <TableCell>
                    {exp.expirationDate
                      ? new Date(exp.expirationDate).toLocaleDateString('pt-BR')
                      : '---'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`gap-1 ${status.color}`}>
                      <Icon className="h-3 w-3" /> {status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
