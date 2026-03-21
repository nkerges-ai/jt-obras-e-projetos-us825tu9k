import { useState, useEffect } from 'react'
import { getProjects, Project, getChatMessages } from '@/lib/storage'
import { ChatWindow } from '@/components/ChatWindow'
import { Badge } from '@/components/ui/badge'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AdminChatTab() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    setProjects(getProjects())
    const updateCounts = () => {
      const msgs = getChatMessages()
      const counts: Record<string, number> = {}
      msgs.forEach((m) => {
        if (m.sender === 'client' && !m.read) {
          counts[m.projectId] = (counts[m.projectId] || 0) + 1
        }
      })
      setUnreadCounts(counts)
    }
    updateCounts()
    window.addEventListener('jt_chats_updated', updateCounts)
    return () => window.removeEventListener('jt_chats_updated', updateCounts)
  }, [])

  // sort projects by unread count then name
  const sortedProjects = [...projects].sort((a, b) => {
    const unreadA = unreadCounts[a.id] || 0
    const unreadB = unreadCounts[b.id] || 0
    if (unreadA !== unreadB) return unreadB - unreadA
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b bg-brand-navy text-white font-bold flex items-center gap-2 shrink-0">
          <MessageSquare className="h-5 w-5" /> Chats com Clientes
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sortedProjects.length === 0 && (
            <div className="text-center text-sm text-muted-foreground mt-8">
              Nenhuma obra em andamento.
            </div>
          )}
          {sortedProjects.map((p) => {
            const unread = unreadCounts[p.id] || 0
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={cn(
                  'w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors',
                  selectedProjectId === p.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-gray-50 text-gray-700',
                )}
              >
                <div className="truncate pr-2 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs opacity-70 truncate">{p.client}</div>
                </div>
                {unread > 0 && (
                  <Badge
                    variant="default"
                    className="shrink-0 rounded-full h-5 px-1.5 min-w-[20px] justify-center text-[10px]"
                  >
                    {unread}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>
      </div>
      <div className="h-[600px] flex flex-col">
        {selectedProjectId ? (
          <ChatWindow
            projectId={selectedProjectId}
            currentUserType="admin"
            projectName={projects.find((p) => p.id === selectedProjectId)?.name}
          />
        ) : (
          <div className="h-full border rounded-xl bg-gray-50/50 flex flex-col items-center justify-center text-muted-foreground p-6 text-center shadow-sm">
            <MessageSquare className="h-12 w-12 opacity-20 mb-4" />
            <p className="font-medium text-lg text-gray-600">Selecione um projeto</p>
            <p className="text-sm max-w-sm mt-2">
              Escolha um cliente na lista ao lado para iniciar ou continuar o atendimento.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
