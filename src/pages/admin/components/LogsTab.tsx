import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { BellRing, Mail, MessageCircle, Info } from 'lucide-react'
import { getLogs, NotificationLog } from '@/lib/storage'

export function LogsTab() {
  const [logs, setLogs] = useState<NotificationLog[]>([])

  useEffect(() => {
    setLogs(getLogs())
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case 'WhatsApp':
        return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'Email':
        return <Mail className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <BellRing className="h-5 w-5 text-primary" /> Histórico de Notificações Automáticas
        </h3>
        <p className="text-muted-foreground text-sm">
          Registro de alertas e mensagens automatizadas disparadas pelo sistema para os clientes.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Data/Hora</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Destinatário</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhuma notificação registrada.
                </TableCell>
              </TableRow>
            )}
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.date).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 font-medium">
                    {getIcon(log.type)} {log.type}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{log.recipient}</TableCell>
                <TableCell className="text-sm max-w-md truncate">{log.message}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      log.status === 'Enviado'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }
                  >
                    {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
