import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileText,
  Briefcase,
  MessageSquare,
  AlertTriangle,
  Headset,
  BellRing,
  Mail,
  FolderOpen,
} from 'lucide-react'
import {
  getProjects,
  getTechnicalDocuments,
  getSignatures,
  getTickets,
  getChatMessages,
  getLogs,
  NotificationLog,
} from '@/lib/storage'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function OverviewTab() {
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalDocs: 0,
    pendingSignatures: 0,
    openTickets: 0,
    unreadMessages: 0,
  })

  const [logs, setLogs] = useState<NotificationLog[]>([])

  useEffect(() => {
    setStats({
      activeProjects: getProjects().filter((p) => p.status === 'Em andamento').length,
      totalDocs: getTechnicalDocuments().length,
      pendingSignatures: getSignatures().filter((s) => s.status === 'Pendente').length,
      openTickets: getTickets().filter((t) => t.status === 'Aberto' || t.status === 'Em andamento')
        .length,
      unreadMessages: getChatMessages().filter((m) => m.sender === 'client' && !m.read).length,
    })
    setLogs(getLogs().slice(0, 15)) // Show the latest 15 logs
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Obras em Andamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-navy flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-blue-500" />
              {stats.activeProjects}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Documentos no Acervo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-navy flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-brand-light" />
              {stats.totalDocs}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Assinaturas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-navy flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              {stats.pendingSignatures}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chamados Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-navy flex items-center gap-2">
              <Headset className="h-6 w-6 text-red-500" />
              {stats.openTickets}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mensagens Não Lidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand-navy flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-green-500" />
              {stats.unreadMessages}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg flex items-center gap-2 text-brand-navy">
            <BellRing className="h-5 w-5 text-brand-orange" /> Log de Comunicação e Interações
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Mensagem</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma interação ou notificação registrada.
                  </TableCell>
                </TableRow>
              )}
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.date).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] gap-1 px-2 py-0.5">
                      {log.type === 'Email' ? (
                        <Mail className="w-3 h-3 text-blue-500" />
                      ) : log.type === 'WhatsApp' ? (
                        <MessageSquare className="w-3 h-3 text-green-500" />
                      ) : (
                        <BellRing className="w-3 h-3 text-gray-500" />
                      )}
                      {log.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-sm">{log.recipient}</TableCell>
                  <TableCell className="text-sm truncate max-w-md">{log.message}</TableCell>
                  <TableCell className="text-right">
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
        </CardContent>
      </Card>
    </div>
  )
}
