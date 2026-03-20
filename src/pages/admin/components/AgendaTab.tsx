import { useState, useEffect, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CalendarDays, Plus, MapPin, CheckCircle } from 'lucide-react'
import { getEvents, saveEvents, getProjects, CalendarEvent, Project } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

export function AgendaTab() {
  const { toast } = useToast()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'Visita Técnica',
    title: '',
    projectId: '',
  })

  useEffect(() => {
    setEvents(getEvents())
    setProjects(getProjects())
  }, [])

  const selectedDateEvents = useMemo(() => {
    if (!date) return []
    const targetDate = date.toDateString()
    return events.filter((e) => new Date(e.date).toDateString() === targetDate)
  }, [events, date])

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !newEvent.title || !newEvent.projectId || !newEvent.type) return

    const event: CalendarEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      type: newEvent.type as 'Visita Técnica' | 'Entrega',
      projectId: newEvent.projectId,
      date: date.toISOString(),
    }

    const updated = [...events, event]
    setEvents(updated)
    saveEvents(updated)
    setNewEvent({ ...newEvent, title: '' })
    toast({ title: 'Agendamento Confirmado', description: 'Evento adicionado à sua agenda.' })
  }

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.name || 'Projeto Desconhecido'

  return (
    <div className="grid lg:grid-cols-[1fr_350px] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b bg-secondary/30 pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" /> Calendário de Serviços
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm p-4 w-full max-w-md bg-white"
            classNames={{
              day_selected:
                'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            }}
          />
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm flex flex-col h-full">
        <CardHeader className="border-b bg-secondary/30 pb-4">
          <CardTitle className="text-lg">
            Eventos de {date?.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex-1 space-y-4 mb-6">
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nenhum evento agendado.
              </p>
            ) : (
              selectedDateEvents.map((ev) => (
                <div key={ev.id} className="p-3 border rounded-lg bg-secondary/20 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-sm">
                    {ev.type === 'Visita Técnica' ? (
                      <MapPin className="h-4 w-4 text-blue-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {ev.title}
                  </div>
                  <div className="text-xs text-muted-foreground bg-white px-2 py-1 rounded border inline-block mt-1">
                    {getProjectName(ev.projectId)}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddEvent} className="space-y-4 pt-4 border-t mt-auto">
            <h4 className="font-bold text-sm">Novo Agendamento</h4>
            <div className="space-y-2">
              <Select
                value={newEvent.type}
                onValueChange={(v) => setNewEvent({ ...newEvent, type: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visita Técnica">Visita Técnica</SelectItem>
                  <SelectItem value="Entrega">Entrega de Obra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Título / Descrição"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Select
                value={newEvent.projectId}
                onValueChange={(v) => setNewEvent({ ...newEvent, projectId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a Obra" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full gap-2">
              <Plus className="h-4 w-4" /> Agendar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
