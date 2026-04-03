import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { useRealtime } from '@/hooks/use-realtime'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, HardHat, Activity, CheckCircle, DollarSign, TrendingUp } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Badge } from '@/components/ui/badge'

export function OverviewTab() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalObras: 0,
    obrasExecucao: 0,
    obrasConcluidas: 0,
    receitaTotal: 0,
    receitaMes: 0,
  })
  const [obrasPorStatus, setObrasPorStatus] = useState<any[]>([])
  const [receitaPorMes, setReceitaPorMes] = useState<any[]>([])
  const [recentObras, setRecentObras] = useState<any[]>([])

  const loadData = async () => {
    try {
      const [customers, projects] = await Promise.all([
        pb.collection('customers').getFullList(),
        pb.collection('projects').getFullList({ expand: 'client_id', sort: '-created' }),
      ])

      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      let receitaTotal = 0
      let receitaMes = 0
      let execucao = 0
      let concluidas = 0

      const statusCount: Record<string, number> = {
        Planning: 0,
        'In Execution': 0,
        Paused: 0,
        Completed: 0,
      }

      const monthlyRev: Record<string, number> = {}

      projects.forEach((p) => {
        const val = p.total_value || 0
        receitaTotal += val

        const d = new Date(p.created)
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          receitaMes += val
        }

        if (p.status === 'In Execution') execucao++
        if (p.status === 'Completed') concluidas++

        if (statusCount[p.status] !== undefined) {
          statusCount[p.status]++
        }

        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthlyRev[monthKey] = (monthlyRev[monthKey] || 0) + val
      })

      setStats({
        totalClientes: customers.length,
        totalObras: projects.length,
        obrasExecucao: execucao,
        obrasConcluidas: concluidas,
        receitaTotal,
        receitaMes,
      })

      const statusMap: Record<string, string> = {
        Planning: 'Planejamento',
        'In Execution': 'Em Execução',
        Paused: 'Pausado',
        Completed: 'Concluído',
      }

      const activeStatuses = Object.entries(statusCount).filter(([_, v]) => v > 0)
      setObrasPorStatus(
        activeStatuses.map(([k, v]) => ({
          name: statusMap[k] || k,
          value: v,
          fill:
            k === 'In Execution'
              ? '#3b82f6'
              : k === 'Completed'
                ? '#22c55e'
                : k === 'Planning'
                  ? '#eab308'
                  : '#6b7280',
        })),
      )

      const sortedKeys = Object.keys(monthlyRev).sort()
      setReceitaPorMes(
        sortedKeys.map((k) => {
          const [y, m] = k.split('-')
          const date = new Date(parseInt(y), parseInt(m) - 1)
          return {
            name: date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }),
            value: monthlyRev[k],
          }
        }),
      )

      setRecentObras(projects.slice(0, 5))
    } catch (e) {
      console.error('Failed to load dashboard data:', e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('customers', loadData)
  useRealtime('projects', loadData)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const formatDate = (dateStr: string) => new Intl.DateTimeFormat('pt-BR').format(new Date(dateStr))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Concluído</Badge>
      case 'In Execution':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Execução</Badge>
      case 'Planning':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Planejamento</Badge>
        )
      case 'Paused':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pausado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total de Clientes <Users className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{stats.totalClientes}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Total de Obras <HardHat className="h-4 w-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{stats.totalObras}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Em Execução <Activity className="h-4 w-4 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{stats.obrasExecucao}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Concluídas <CheckCircle className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">{stats.obrasConcluidas}</div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Receita Total <DollarSign className="h-4 w-4 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">
              {formatCurrency(stats.receitaTotal)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
              Receita do Mês <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-navy">
              {formatCurrency(stats.receitaMes)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg text-brand-navy">Obras por Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              {obrasPorStatus.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  Nenhum dado disponível.
                </div>
              ) : (
                <ChartContainer
                  config={{ value: { label: 'Obras', color: 'hsl(var(--primary))' } }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={obrasPorStatus}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {obrasPorStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg text-brand-navy">Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[300px] w-full">
              {receitaPorMes.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                  Nenhum dado disponível.
                </div>
              ) : (
                <ChartContainer
                  config={{ value: { label: 'Receita (R$)', color: '#10b981' } }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={receitaPorMes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        tickFormatter={(val) =>
                          new Intl.NumberFormat('pt-BR', {
                            notation: 'compact',
                            compactDisplay: 'short',
                          }).format(val)
                        }
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg text-brand-navy">5 Obras Mais Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Obra / Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentObras.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Nenhuma obra registrada no sistema.
                  </TableCell>
                </TableRow>
              )}
              {recentObras.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(obra.created)}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{obra.name}</TableCell>
                  <TableCell className="text-sm">{obra.expand?.client_id?.name || '-'}</TableCell>
                  <TableCell className="text-sm font-semibold">
                    {formatCurrency(obra.total_value)}
                  </TableCell>
                  <TableCell className="text-right">{getStatusBadge(obra.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
