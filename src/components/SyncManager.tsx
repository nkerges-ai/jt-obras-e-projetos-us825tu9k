import { useEffect } from 'react'
import { useNetwork } from '@/hooks/use-network'
import { getProjects, saveProjects } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

export function SyncManager() {
  const isOnline = useNetwork()
  const { toast } = useToast()

  useEffect(() => {
    if (isOnline) {
      const syncData = async () => {
        const projects = getProjects()
        let hasPending = false
        let syncedCount = 0

        const updatedProjects = projects.map((p) => {
          if (!p.reports) return p
          let projectUpdated = false
          const updatedReports = p.reports.map((r) => {
            if (r.syncStatus === 'pending') {
              hasPending = true
              projectUpdated = true
              syncedCount++
              return { ...r, syncStatus: 'synced' as const }
            }
            return r
          })
          if (projectUpdated) return { ...p, reports: updatedReports }
          return p
        })

        if (hasPending) {
          window.dispatchEvent(new Event('jt_sync_start'))
          // Fake delay to show syncing UI
          await new Promise((resolve) => setTimeout(resolve, 2500))
          saveProjects(updatedProjects)
          window.dispatchEvent(new Event('jt_sync_completed'))
          window.dispatchEvent(new Event('jt_reports_updated'))
          toast({
            title: 'Sincronização Concluída',
            description: `${syncedCount} relatório(s) sincronizado(s) com sucesso.`,
          })
        }
      }

      syncData()
    }
  }, [isOnline, toast])

  return null
}
