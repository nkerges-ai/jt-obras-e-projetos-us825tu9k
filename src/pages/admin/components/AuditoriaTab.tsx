import { useState, useEffect } from 'react'
import { getAuditLogs, AuditLog } from '@/lib/storage'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShieldCheck } from 'lucide-react'

export function AuditoriaTab() {
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    setLogs(getAuditLogs())
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Trilha de Auditoria
        </h3>
        <p className="text-muted-foreground text-sm">
          Registro completo e imutável de todas as ações críticas realizadas no sistema.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>Módulo/Tabela</TableHead>
              <TableHead>Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum registro de auditoria.
                </TableCell>
              </TableRow>
            )}
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium text-sm">{log.userId}</TableCell>
                <TableCell className="font-bold text-xs uppercase">{log.action}</TableCell>
                <TableCell className="text-sm">{log.table}</TableCell>
                <TableCell
                  className="text-xs text-gray-500 max-w-[200px] truncate"
                  title={log.newData || log.previousData}
                >
                  {log.newData
                    ? `Novo: ${log.newData}`
                    : log.previousData
                      ? `Antigo: ${log.previousData}`
                      : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
