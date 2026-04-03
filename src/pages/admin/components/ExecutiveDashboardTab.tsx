import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, HardHat, DollarSign, Activity, AlertCircle, CheckCircle2 } from 'lucide-react'
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
import { getCustomers, type Customer } from '@/services/customers'
import { getCloudProjects, type CloudProject } from '@/services/projects'
import { useRealtime } from '@/hooks/use-realtime'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const formatCurrency = (val: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

export function ExecutiveDashboardTab() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [projects, setProjects] = useState<CloudProject[]>([])

  const loadData = async () => {
    const [c, p] = await Promise.all([getCustomers(), getCloudProjects()])
    setCustomers(c)
    setProjects(p)
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('customers', () => loadData())
  useRealtime('projects', () => loadData())

  const inExecution = projects.filter((p) => p.status === 'In Execution').length
  const completed = projects.filter((p) => p.status === 'Completed').length
  const totalRevenue = projects.reduce((sum, p) => sum + p.total_value, 0)

  const thisMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const monthlyRevenue = projects
    .filter(
      (p) =>
        new Date(p.start_date).getMonth() === thisMonth &&
        new Date(p.start_date).getFullYear() === thisYear,
    )
    .reduce((sum, p) => sum + p.total_value, 0)

  const statusCounts = { Planning: 0, 'In Execution': 0, Paused: 0, Completed: 0 }
  projects.forEach((p) => {
    if (statusCounts[p.status] !== undefined) statusCounts[p.status]++
  })
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    status:
      status === 'Planning'
        ? 'Planejamento'
        : status === 'In Execution'
          ? 'Em Execução'
          : status === 'Paused'
            ? 'Pausada'
            : 'Concluída',
    count,
    fill:
      status === 'Planning'
        ? '#f59e0b'
        : status === 'In Execution'
          ? '#3b82f6'
          : status === 'Paused'
            ? '#6b7280'
            : '#10b981',
  }))

  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - (5 - i))
    return {
      label: d.toLocaleString('pt-BR', { month: 'short' }),
      month: d.getMonth(),
      year: d.getFullYear(),
      revenue: 0,
    }
  })
  projects.forEach((p) => {
    const d = new Date(p.start_date)
    const mIndex = last6Months.findIndex(
      (m) => m.month === d.getMonth() && m.year === d.getFullYear(),
    )
    if (mIndex !== -1) last6Months[mIndex].revenue += p.total_value
  })

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Clientes
            </CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Obras (Total / Em Execução)
            </CardTitle>
            <HardHat className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {projects.length}{' '}
              <span className="text-lg text-muted-foreground font-normal">/ {inExecution}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita Total
            </CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Este mês: {formatCurrency(monthlyRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg text-brand-navy">Obras por Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ count: { label: 'Obras', color: 'hsl(var(--primary))' } }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-none shadow-sm">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg text-brand-navy">Receita (Últimos 6 Meses)</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ChartContainer
              config={{ revenue: { label: 'Receita', color: 'hsl(var(--primary))' } }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last6Months}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis tickFormatter={(val) => `R$ ${val / 1000}k`} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent formatter={(val: number) => formatCurrency(val)} />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white border-none shadow-sm">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-lg text-brand-navy">Projetos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 5).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.expand?.client_id?.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        p.status === 'Planning'
                          ? 'bg-yellow-50 text-yellow-700'
                          : p.status === 'In Execution'
                            ? 'bg-blue-50 text-blue-700'
                            : p.status === 'Completed'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-50 text-gray-700'
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(p.total_value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
