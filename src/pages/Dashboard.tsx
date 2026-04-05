import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, HardHat, DollarSign } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    clients: 0,
    projects: 0,
    activeProjects: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMetrics() {
      try {
        const [clients, projects] = await Promise.all([
          pb.collection('customers').getList(1, 1),
          pb.collection('projects').getFullList(),
        ])
        const active = projects.filter((p) => p.status === 'In Execution').length
        const rev = projects.reduce((acc, p) => acc + (p.total_value || 0), 0)

        setMetrics({
          clients: clients.totalItems,
          projects: projects.length,
          activeProjects: active,
          revenue: rev,
        })
      } catch (e) {
        console.error('Failed to load metrics:', e)
      } finally {
        setLoading(false)
      }
    }
    loadMetrics()
  }, [])

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">Visão Geral</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total de Clientes</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {loading ? '-' : metrics.clients}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Obras (Total / Em Execução)
            </CardTitle>
            <HardHat className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {loading ? (
                '-'
              ) : (
                <>
                  {metrics.projects}{' '}
                  <span className="text-xl text-slate-500 font-normal">
                    / {metrics.activeProjects}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Receita Total</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {loading
                ? '-'
                : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    metrics.revenue,
                  )}
            </div>
            <p className="text-xs text-slate-500 mt-1">Este mês: R$ 0,00</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
