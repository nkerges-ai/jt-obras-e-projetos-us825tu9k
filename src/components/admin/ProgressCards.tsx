import { CloudProject } from '@/services/projects'
import { differenceInDays, parseISO } from 'date-fns'

export function ProgressCards({ projects }: { projects: CloudProject[] }) {
  const inExecution = projects.filter((p) => p.status === 'In Execution')

  if (inExecution.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {inExecution.map((project) => {
        const start = parseISO(project.start_date)
        const elapsed = differenceInDays(new Date(), start)
        const progress = Math.min(Math.max((elapsed / project.deadline_days) * 100, 0), 100)

        return (
          <div
            key={project.id}
            className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 flex flex-col gap-4 transition-all hover:shadow-md"
          >
            <div>
              <h3 className="font-semibold text-gray-900 line-clamp-1" title={project.name}>
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1 mt-0.5">
                {project.expand?.client_id?.name || 'Cliente desconhecido'}
              </p>
            </div>
            <div className="space-y-2 mt-auto">
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span>{elapsed > 0 ? elapsed : 0} dias passados</span>
                <span>{project.deadline_days} dias totais</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
