import { useMemo } from 'react'
import { ProjectPhase } from '@/lib/storage'
import { cn } from '@/lib/utils'

interface GanttChartProps {
  phases: ProjectPhase[]
  className?: string
}

export function GanttChart({ phases, className }: GanttChartProps) {
  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (!phases || phases.length === 0) {
      return { minDate: new Date(), maxDate: new Date(), totalDays: 0 }
    }
    const startDates = phases.map((p) => new Date(p.startDate).getTime())
    const endDates = phases.map((p) => new Date(p.endDate).getTime())
    const min = new Date(Math.min(...startDates))
    const max = new Date(Math.max(...endDates))
    const diffTime = Math.abs(max.getTime() - min.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1
    return { minDate: min, maxDate: max, totalDays: diffDays }
  }, [phases])

  if (!phases || phases.length === 0) {
    return (
      <div
        className={cn('text-center py-8 text-muted-foreground bg-gray-50 rounded-lg', className)}
      >
        Nenhum cronograma definido para esta obra.
      </div>
    )
  }

  const getPosition = (dateStr: string) => {
    const date = new Date(dateStr)
    const diff = Math.ceil((date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, Math.min(100, (diff / totalDays) * 100))
  }

  const getWidth = (startStr: string, endStr: string) => {
    const start = new Date(startStr)
    const end = new Date(endStr)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(2, Math.min(100, (diff / totalDays) * 100)) // Min width 2%
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="min-w-[600px] border rounded-lg overflow-hidden bg-white">
        {/* Header timeline */}
        <div className="flex border-b bg-gray-50 text-xs text-muted-foreground font-medium">
          <div className="w-1/4 p-3 border-r shrink-0">Fase da Obra</div>
          <div className="w-3/4 flex justify-between p-3 relative">
            <span>{minDate.toLocaleDateString('pt-BR')}</span>
            <span className="absolute left-1/2 -translate-x-1/2">
              Cronograma ({totalDays} dias)
            </span>
            <span>{maxDate.toLocaleDateString('pt-BR')}</span>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {phases.map((phase) => {
            const left = getPosition(phase.startDate)
            const width = getWidth(phase.startDate, phase.endDate)
            const isCompleted = phase.progress >= 100

            return (
              <div key={phase.id} className="flex text-sm hover:bg-gray-50 transition-colors">
                <div className="w-1/4 p-3 border-r shrink-0 truncate flex flex-col justify-center">
                  <span className="font-semibold text-brand-navy truncate" title={phase.name}>
                    {phase.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(phase.startDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    -{' '}
                    {new Date(phase.endDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </span>
                </div>
                <div className="w-3/4 p-3 relative flex items-center">
                  {/* Grid background lines */}
                  <div className="absolute inset-y-0 left-1/4 border-l border-gray-100 border-dashed" />
                  <div className="absolute inset-y-0 left-2/4 border-l border-gray-100 border-dashed" />
                  <div className="absolute inset-y-0 left-3/4 border-l border-gray-100 border-dashed" />

                  {/* Gantt Bar */}
                  <div
                    className={cn(
                      'absolute h-6 rounded-full shadow-sm overflow-hidden flex items-center px-2 text-[10px] font-bold text-white transition-all',
                      isCompleted ? 'bg-green-500' : 'bg-brand-orange',
                    )}
                    style={{ left: `${left}%`, width: `${width}%` }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-white/20 transition-all"
                      style={{ width: `${phase.progress}%` }}
                    />
                    <span className="relative z-10 truncate drop-shadow-md">{phase.progress}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
