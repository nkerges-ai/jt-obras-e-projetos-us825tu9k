import { useEffect, useRef } from 'react'
import { useNetwork } from '@/hooks/use-network'
import { getProjects, saveProjects } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

export function SyncManager() {
  const isOnline = useNetwork()
  const { toast } = useToast()
  const syncingRef = useRef(false)

  useEffect(() => {
    const syncData = async () => {
      if (!isOnline || syncingRef.current) return

      const projects = getProjects()
      let hasPending = false

      projects.forEach((p) => {
        if (p.reports?.some((r) => r.syncStatus === 'pending')) hasPending = true
      })

      if (!hasPending) return

      syncingRef.current = true
      window.dispatchEvent(new Event('jt_sync_start'))

      try {
        // Simulate network delay for sync
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // In a real scenario, this is where we would send data to an API
        // If the API fails, we throw an error and retry later
        let syncedCount = 0
        const updatedProjects = getProjects().map((p) => {
          if (!p.reports) return p
          let projectUpdated = false
          const updatedReports = p.reports.map((r) => {
            if (r.syncStatus === 'pending') {
              projectUpdated = true
              syncedCount++
              return { ...r, syncStatus: 'synced' as const }
            }
            return r
          })
          if (projectUpdated) return { ...p, reports: updatedReports }
          return p
        })

        saveProjects(updatedProjects)
        window.dispatchEvent(new Event('jt_reports_updated'))
        toast({
          title: 'Dados Sincronizados',
          description: `${syncedCount} relatório(s) enviado(s) para o servidor com sucesso.`,
        })
      } catch (error) {
        console.warn('Sync failed, will retry on next cycle', error)
      } finally {
        syncingRef.current = false
        window.dispatchEvent(new Event('jt_sync_completed'))
      }
    }

    // Trigger immediately when connection is restored
    if (isOnline) {
      syncData()
    }

    // Interval to ensure retry logic if syncing failed previously
    const interval = setInterval(() => {
      if (isOnline) syncData()
    }, 15000)

    return () => clearInterval(interval)
  }, [isOnline, toast])

  return null
}
