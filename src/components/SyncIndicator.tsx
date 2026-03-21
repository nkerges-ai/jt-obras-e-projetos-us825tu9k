import { useState, useEffect } from 'react'
import { useNetwork } from '@/hooks/use-network'
import { getProjects } from '@/lib/storage'
import { Badge } from '@/components/ui/badge'
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SyncIndicator({ className }: { className?: string }) {
  const isOnline = useNetwork()
  const [isSyncing, setIsSyncing] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  const checkPending = () => {
    let count = 0
    getProjects().forEach((p) => {
      p.reports?.forEach((r) => {
        if (r.syncStatus === 'pending') count++
      })
    })
    setPendingCount(count)
  }

  useEffect(() => {
    checkPending()
    const handleStart = () => setIsSyncing(true)
    const handleEnd = () => {
      setIsSyncing(false)
      checkPending()
    }
    window.addEventListener('jt_sync_start', handleStart)
    window.addEventListener('jt_sync_completed', handleEnd)
    window.addEventListener('jt_reports_updated', checkPending)
    return () => {
      window.removeEventListener('jt_sync_start', handleStart)
      window.removeEventListener('jt_sync_completed', handleEnd)
      window.removeEventListener('jt_reports_updated', checkPending)
    }
  }, [])

  if (!isOnline) {
    return (
      <Badge variant="destructive" className={cn('gap-1 shadow-sm h-7', className)}>
        <WifiOff className="w-3 h-3" /> Offline{' '}
        {pendingCount > 0 ? `(${pendingCount} pendentes)` : ''}
      </Badge>
    )
  }
  if (isSyncing) {
    return (
      <Badge className={cn('bg-blue-500 hover:bg-blue-600 gap-1 shadow-sm h-7', className)}>
        <RefreshCw className="w-3 h-3 animate-spin" /> Sincronizando...
      </Badge>
    )
  }
  if (pendingCount > 0) {
    return (
      <Badge
        className={cn('bg-amber-500 hover:bg-amber-600 gap-1 shadow-sm h-7 text-black', className)}
      >
        <RefreshCw className="w-3 h-3" /> {pendingCount} Aguardando
      </Badge>
    )
  }
  return (
    <Badge className={cn('bg-emerald-500 hover:bg-emerald-600 gap-1 shadow-sm h-7', className)}>
      <CheckCircle2 className="w-3 h-3" /> Dados Sincronizados
    </Badge>
  )
}
