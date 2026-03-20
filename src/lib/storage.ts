export type ProjectStatus = 'Em andamento' | 'Concluído' | 'Em orçamento'

export interface Expense {
  id: string
  description: string
  cost: number
  date: string
  isInvoice?: boolean
  invoiceNumber?: string
  supplier?: string
  category?: string
}

export interface Photo {
  id: string
  url: string
  type: 'Antes' | 'Depois'
  date: string
}

export interface Project {
  id: string
  name: string
  client: string
  startDate: string
  status: ProjectStatus
  budget: number
  expenses: Expense[]
  photos: Photo[]
}

export interface CalendarEvent {
  id: string
  title: string
  type: 'Visita Técnica' | 'Entrega'
  projectId: string
  date: string
}

export interface NotificationLog {
  id: string
  date: string
  type: 'WhatsApp' | 'Email' | 'Sistema'
  recipient: string
  message: string
  status: 'Enviado' | 'Falha'
}

export type TicketStatus = 'Aberto' | 'Em andamento' | 'Resolvido'

export interface Ticket {
  id: string
  clientName: string
  projectId: string
  description: string
  dateOpened: string
  status: TicketStatus
  internalNotes: string
}

export interface Material {
  id: string
  name: string
  category: string
  quantity: number
  minQuantity: number
  unit: string
}

export const getProjects = (): Project[] => {
  const data = localStorage.getItem('jt_projects')
  if (data) return JSON.parse(data)
  return [
    {
      id: '1',
      name: 'Reforma Fachada Edifício Azul',
      client: 'Condomínio Azul',
      startDate: '2023-09-10',
      status: 'Em andamento',
      budget: 50000,
      expenses: [
        {
          id: 'e1',
          description: 'Tintas e Impermeabilizantes',
          cost: 12000,
          date: '2023-09-15',
          category: 'Matéria Prima',
        },
        {
          id: 'e2',
          description: 'Serviço Pintura',
          cost: 8000,
          date: '2023-09-20',
          isInvoice: true,
          invoiceNumber: '00123',
          supplier: 'Empreiteira ABC',
          category: 'Mão de Obra',
        },
      ],
      photos: [
        {
          id: 'p1',
          url: 'https://img.usecurling.com/p/600/400?q=old%20building%20facade',
          type: 'Antes',
          date: '2023-09-10',
        },
      ],
    },
    {
      id: '2',
      name: 'Manutenção Preventiva Ar Condicionado',
      client: 'Escola Esperança',
      startDate: '2023-10-05',
      status: 'Concluído',
      budget: 5000,
      expenses: [],
      photos: [],
    },
  ]
}

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem('jt_projects', JSON.stringify(projects))
}

export const getEvents = (): CalendarEvent[] => {
  const data = localStorage.getItem('jt_events')
  if (data) return JSON.parse(data)
  return [
    {
      id: '1',
      title: 'Vistoria Inicial',
      type: 'Visita Técnica',
      projectId: '1',
      date: new Date().toISOString(),
    },
  ]
}

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem('jt_events', JSON.stringify(events))
}

export const getLogs = (): NotificationLog[] => {
  const data = localStorage.getItem('jt_logs')
  if (data) return JSON.parse(data)
  return [
    {
      id: '1',
      date: new Date().toISOString(),
      type: 'Sistema',
      recipient: 'Admin',
      message: 'Sistema automático iniciado.',
      status: 'Enviado',
    },
  ]
}

export const addLog = (log: Omit<NotificationLog, 'id' | 'date'>) => {
  const logs = getLogs()
  const newLog: NotificationLog = {
    ...log,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  }
  localStorage.setItem('jt_logs', JSON.stringify([newLog, ...logs]))
}

export const getTickets = (): Ticket[] => {
  const data = localStorage.getItem('jt_tickets')
  if (data) return JSON.parse(data)
  return [
    {
      id: 't1',
      clientName: 'Condomínio Azul',
      projectId: '1',
      description: 'Verificação de infiltração próxima à janela do 3º andar após chuva forte.',
      dateOpened: new Date().toISOString(),
      status: 'Aberto',
      internalNotes: 'Agendar visita com a equipe de impermeabilização.',
    },
  ]
}

export const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem('jt_tickets', JSON.stringify(tickets))
}

export const getInventory = (): Material[] => {
  const data = localStorage.getItem('jt_inventory')
  if (data) return JSON.parse(data)
  return [
    {
      id: 'm1',
      name: 'Cimento CP II 50kg',
      category: 'Básico',
      quantity: 10,
      minQuantity: 20,
      unit: 'sc',
    },
    {
      id: 'm2',
      name: 'Tinta Acrílica Branca 18L',
      category: 'Acabamento',
      quantity: 25,
      minQuantity: 10,
      unit: 'lt',
    },
    {
      id: 'm3',
      name: 'Argamassa AC-III 20kg',
      category: 'Básico',
      quantity: 5,
      minQuantity: 15,
      unit: 'sc',
    },
  ]
}

export const saveInventory = (inventory: Material[]) => {
  localStorage.setItem('jt_inventory', JSON.stringify(inventory))
}
