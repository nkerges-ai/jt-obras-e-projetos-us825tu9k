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
  getServiceOrders,
  getPGRs,
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function OverviewTab() {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line' | 'area'>('bar')
  const [chartData, setChartData] = useState<any[]>([])
  const [validityAlerts, setValidityAlerts] = useState<any[]>([])
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalDocs: 0,
    pendingSignatures: 0,
    openTickets: 0,
    unreadMessages: 0,
  })

  const [sigChartData, setSigChartData] = useState<any[]>([])

  const [logs, setLogs] = useState<NotificationLog[]>([])

  useEffect(() => {
    const projects = getProjects()
    setStats({
      activeProjects: projects.filter((p) => p.status === 'Em andamento').length,
      totalDocs: getTechnicalDocuments().length,
      pendingSignatures: getSignatures().filter((s) => s.status === 'Pendente').length,
      openTickets: getTickets().filter((t) => t.status === 'Aberto' || t.status === 'Em andamento')
        .length,
      unreadMessages: getChatMessages().filter((m) => m.sender === 'client' && !m.read).length,
    })
    setLogs(getLogs().slice(0, 15)) // Show the latest 15 logs

    const counts = {
      'Em orçamento': 0,
      'Em andamento': 0,
      Concluído: 0,
    }
    projects.forEach((p) => {
      if (counts[p.status as keyof typeof counts] !== undefined)
        counts[p.status as keyof typeof counts]++
    })
    const docCounts = {
      OS: getServiceOrders().length,
      PGR: getPGRs().length,
      Acervo: getTechnicalDocuments().length,
    }

    setChartData([
      { name: 'Obras Abertas', value: counts['Em andamento'], fill: '#3498db' },
      { name: 'OS Geradas', value: docCounts['OS'], fill: '#8e44ad' },
      { name: 'Docs Acervo', value: docCounts['Acervo'], fill: '#f39c12' },
    ])

    const sigs = getSignatures()
    const pendentes = sigs.filter((s) => s.status === 'Pendente').length
    const assinados = sigs.filter((s) => s.status === 'Assinado').length
    setSigChartData([
      { name: 'Assinados', value: assinados, fill: '#22c55e' },
      { name: 'Pendentes', value: pendentes, fill: '#f59e0b' },
    ])

    // Validity alerts
    const today = new Date()
    const docs = JSON.parse(localStorage.getItem('jt_validities_v4') || '[]')
    const employees = JSON.parse(localStorage.getItem('jt_employees_v1') || '[]')

    const alerts: any[] = []
    docs.forEach((d: any) => {
      const exp = new Date(d.expirationDate)
      const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      if (diff <= 30) alerts.push({ name: d.name, diff, type: 'Doc' })
    })
    employees.forEach((e: any) => {
      e.nrs?.forEach((nr: any) => {
        const exp = new Date(nr.expirationDate)
        const diff = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        if (diff <= 30) alerts.push({ name: `${e.name} - ${nr.nr}`, diff, type: 'NR' })
      })
    })
    setValidityAlerts(alerts)
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-brand-navy">Desempenho Operacional</CardTitle>
            <Select value={chartType} onValueChange={(v: any) => setChartType(v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Gráfico de Barras</SelectItem>
                <SelectItem value="pie">Gráfico de Pizza</SelectItem>
                <SelectItem value="line">Gráfico de Linha</SelectItem>
                <SelectItem value="area">Gráfico de Área</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ value: { label: 'Projetos', color: 'hsl(var(--primary))' } }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                ) : chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg text-brand-navy">
              Taxa de Assinaturas (Conclusão)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex justify-center">
            <ChartContainer
              config={{ value: { label: 'Qtd', color: '#22c55e' } }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sigChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    label
                  >
                    {sigChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {validityAlerts.length > 0 && (
        <Card className="bg-orange-50 border-orange-200 shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Alertas de Validade (Menos de 30 dias ou
              Expirados)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {validityAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded border border-orange-100 flex justify-between items-center"
                >
                  <div className="text-sm font-bold text-gray-800">{alert.name}</div>
                  <Badge
                    variant="destructive"
                    className={alert.diff < 0 ? 'bg-red-600' : 'bg-orange-500'}
                  >
                    {alert.diff < 0
                      ? `Vencido há ${Math.abs(alert.diff)} dias`
                      : `${alert.diff} dias`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
