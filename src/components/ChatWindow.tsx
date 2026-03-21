import { useState, useEffect, useRef } from 'react'
import {
  ChatMessage,
  getChatMessages,
  addChatMessage,
  markMessagesAsRead,
  getProjects,
  getTechnicalDocuments,
} from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, X, Link2, File as FileIcon, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ChatWindowProps {
  projectId: string
  currentUserType: 'admin' | 'client'
  projectName?: string
}

export function ChatWindow({ projectId, currentUserType, projectName }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedContext, setSelectedContext] = useState<string>('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const project = getProjects().find((p) => p.id === projectId)
  const docs = getTechnicalDocuments().filter(
    (d) => d.projectId === projectId || d.projectId === 'global',
  )

  const loadMessages = () => {
    const all = getChatMessages()
    setMessages(all.filter((m) => m.projectId === projectId))
    markMessagesAsRead(projectId, currentUserType)
  }

  useEffect(() => {
    loadMessages()
    const handleUpdate = () => loadMessages()
    window.addEventListener('jt_chats_updated', handleUpdate)
    return () => window.removeEventListener('jt_chats_updated', handleUpdate)
  }, [projectId, currentUserType])

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current
      el.scrollTop = el.scrollHeight
    }
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    addChatMessage({
      projectId,
      sender: currentUserType,
      text: newMessage,
      context: selectedContext || undefined,
    })
    setNewMessage('')
    setSelectedContext('')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      addChatMessage({
        projectId,
        sender: currentUserType,
        text: file.type.startsWith('image/') ? 'Imagem anexada' : 'Documento anexado',
        context: selectedContext || undefined,
        attachment: {
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'document',
          dataUrl,
        },
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
    setSelectedContext('')
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-xl bg-white shadow-sm overflow-hidden w-full relative">
      {projectName && (
        <div className="p-4 border-b bg-brand-navy text-white font-bold text-sm shrink-0">
          Chat com: {projectName}
        </div>
      )}
      <div className="flex-1 p-4 bg-gray-50/50 overflow-y-auto" ref={scrollRef}>
        <div className="space-y-4 flex flex-col min-h-full justify-end">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-sm m-auto">
              Nenhuma mensagem ainda. Inicie a conversa!
            </div>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender === currentUserType
            return (
              <div
                key={msg.id}
                className={cn('flex w-full flex-col', isMe ? 'items-end' : 'items-start')}
              >
                {msg.context && (
                  <div
                    className={cn(
                      'text-[10px] mb-1 px-2 py-0.5 rounded bg-black/5 text-muted-foreground max-w-[70%] truncate',
                      isMe ? 'mr-1' : 'ml-1',
                    )}
                    title={msg.context}
                  >
                    Ref: {msg.context}
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2 text-sm relative shadow-sm break-words',
                    isMe
                      ? 'bg-brand-light text-white rounded-tr-sm'
                      : 'bg-white border rounded-tl-sm text-foreground',
                  )}
                >
                  {msg.text}

                  {msg.attachment && (
                    <div className="mt-2 mb-1">
                      {msg.attachment.type === 'image' ? (
                        <a
                          href={msg.attachment.dataUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="block max-w-[200px] overflow-hidden rounded-lg border shadow-sm mt-1 hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={msg.attachment.dataUrl}
                            alt={msg.attachment.name}
                            className="w-full object-cover"
                          />
                        </a>
                      ) : (
                        <a
                          href={msg.attachment.dataUrl}
                          download={msg.attachment.name}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg transition-colors border',
                            isMe
                              ? 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                              : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-brand-navy',
                          )}
                        >
                          <FileIcon className="h-6 w-6 shrink-0" />
                          <span className="text-xs font-medium truncate max-w-[150px]">
                            {msg.attachment.name}
                          </span>
                          <Download className="h-4 w-4 ml-1 opacity-70 shrink-0" />
                        </a>
                      )}
                    </div>
                  )}

                  <span
                    className={cn(
                      'block text-[10px] mt-1 opacity-70',
                      isMe ? 'text-right' : 'text-left',
                    )}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {isMe && <span className="ml-1">{msg.read ? '••' : '•'}</span>}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border-t shrink-0">
        {selectedContext && (
          <div className="px-3 py-2 bg-blue-50/50 border-b flex items-center justify-between">
            <span className="text-xs text-blue-800 font-medium truncate">
              Contexto: {selectedContext}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-blue-800 hover:bg-blue-100 rounded-full"
              onClick={() => setSelectedContext('')}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSend} className="p-3 flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="rounded-full shrink-0 text-muted-foreground hover:text-brand-navy"
                title="Vincular a uma fase ou documento"
              >
                <Link2 className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Vincular Mensagem a...</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {project?.phases && project.phases.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Fases da Obra
                  </DropdownMenuLabel>
                  {project.phases.map((p) => (
                    <DropdownMenuItem
                      key={p.id}
                      onClick={() => setSelectedContext(`Fase: ${p.name}`)}
                    >
                      {p.name}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </>
              )}
              {docs.length > 0 && (
                <>
                  <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                    Documentos
                  </DropdownMenuLabel>
                  {docs.slice(0, 5).map((d) => (
                    <DropdownMenuItem
                      key={d.id}
                      onClick={() => setSelectedContext(`Doc: ${d.name}`)}
                    >
                      {d.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0 text-muted-foreground hover:text-brand-navy"
            title="Anexar arquivo (PDF, Imagens)"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileUpload}
          />

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-full bg-gray-50 border-gray-200"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim()}
            className="rounded-full shrink-0 bg-brand-orange hover:bg-[#cf6d18] text-white disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
