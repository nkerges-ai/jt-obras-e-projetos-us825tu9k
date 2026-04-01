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
import { ShieldCheck, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export function AuditoriaTab() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  useEffect(() => {
    setLogs(getAuditLogs())
  }, [])

  const safeParseJSON = (str: string) => {
    try {
      return JSON.stringify(JSON.parse(str), null, 2)
    } catch {
      return str
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Relatórios de Auditoria
        </h3>
        <p className="text-muted-foreground text-sm">
          Registro completo de todas as ações no sistema, detalhando alterações e restaurações.
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
              <TableHead className="text-right">Detalhes</TableHead>
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
                <TableCell>
                  <Badge variant="outline" className="uppercase text-[10px]">
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{log.table}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setSelectedLog(log)}
                  >
                    <FileJson className="h-4 w-4 text-blue-500" /> Ver Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedLog} onOpenChange={(o) => !o && setSelectedLog(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Alteração (JSON)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <span className="font-bold text-foreground">Ação:</span> {selectedLog?.action} |{' '}
              <span className="font-bold text-foreground">Tabela:</span> {selectedLog?.table}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              {selectedLog?.previousData && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-100 overflow-x-auto">
                  <span className="text-xs font-bold text-red-600 block mb-2 uppercase">
                    Dado Anterior:
                  </span>
                  <pre className="text-[11px] font-mono text-red-900">
                    {safeParseJSON(selectedLog.previousData)}
                  </pre>
                </div>
              )}
              {selectedLog?.newData && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-100 overflow-x-auto">
                  <span className="text-xs font-bold text-green-600 block mb-2 uppercase">
                    Novo Dado:
                  </span>
                  <pre className="text-[11px] font-mono text-green-900">
                    {safeParseJSON(selectedLog.newData)}
                  </pre>
                </div>
              )}
              {!selectedLog?.previousData && !selectedLog?.newData && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  Nenhum dado estruturado registrado para esta ação.
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
