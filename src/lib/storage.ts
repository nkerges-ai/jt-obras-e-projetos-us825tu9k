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

export interface ProjectPhase {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
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
  phases?: ProjectPhase[]
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

export interface BiometricValidation {
  imageUrl: string
  timestamp: string
  userAgent: string
}

export interface ServiceOrder {
  id: string
  osNumber: string
  revision: string
  projectId: string
  date: string
  prestadora: {
    nome: string
    cnpj: string
    endereco: string
    responsavel: string
    telefone: string
  }
  execucao: { local: string; dataInicio: string; dataFim: string }
  atividade: { descricao: string; setor: string }
  epis: string[]
  epcs: string[]
  status: 'Rascunho' | 'Finalizado'
  biometricValidation?: BiometricValidation
}

export interface TechnicalDocument {
  id: string
  name: string
  category: string
  uploadDate: string
  projectId: string
  isRestricted: boolean
  url: string
}

export interface DocumentAccessRequest {
  id: string
  documentId: string
  projectId: string
  clientName: string
  status: 'Pendente' | 'Aprovado' | 'Negado'
  requestDate: string
}

export interface DocumentSignature {
  id: string
  documentId: string
  documentName: string
  clientName: string
  clientPhone: string
  status: 'Pendente' | 'Assinado' | 'Cancelado'
  sentDate: string
  signedDate?: string
  signatureData?: string
}

export interface ValidityDocument {
  id: string
  name: string
  category: string
  expirationDate: string
  warningDays: number
}

export const getProjects = (): Project[] => {
  const data = localStorage.getItem('jt_projects')
  return data ? JSON.parse(data) : []
}

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem('jt_projects', JSON.stringify(projects))
}

export const getEvents = (): CalendarEvent[] => {
  const data = localStorage.getItem('jt_events')
  return data ? JSON.parse(data) : []
}

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem('jt_events', JSON.stringify(events))
}

export const getLogs = (): NotificationLog[] => {
  const data = localStorage.getItem('jt_logs')
  return data ? JSON.parse(data) : []
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
  return data ? JSON.parse(data) : []
}

export const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem('jt_tickets', JSON.stringify(tickets))
}

export const getInventory = (): Material[] => {
  const data = localStorage.getItem('jt_inventory')
  return data ? JSON.parse(data) : []
}

export const saveInventory = (inventory: Material[]) => {
  localStorage.setItem('jt_inventory', JSON.stringify(inventory))
}

export const getServiceOrders = (): ServiceOrder[] => {
  const data = localStorage.getItem('jt_os')
  return data ? JSON.parse(data) : []
}

export const saveServiceOrders = (orders: ServiceOrder[]) => {
  localStorage.setItem('jt_os', JSON.stringify(orders))
}

export const getTechnicalDocuments = (): TechnicalDocument[] => {
  const data = localStorage.getItem('jt_tech_docs')
  return data ? JSON.parse(data) : []
}

export const saveTechnicalDocuments = (docs: TechnicalDocument[]) => {
  localStorage.setItem('jt_tech_docs', JSON.stringify(docs))
}

export const getAccessRequests = (): DocumentAccessRequest[] => {
  const data = localStorage.getItem('jt_access_requests')
  return data ? JSON.parse(data) : []
}

export const saveAccessRequests = (reqs: DocumentAccessRequest[]) => {
  localStorage.setItem('jt_access_requests', JSON.stringify(reqs))
}

export const getSignatures = (): DocumentSignature[] => {
  const data = localStorage.getItem('jt_signatures')
  return data ? JSON.parse(data) : []
}

export const saveSignatures = (sigs: DocumentSignature[]) => {
  localStorage.setItem('jt_signatures', JSON.stringify(sigs))
}

export const getValidityDocs = (): ValidityDocument[] => {
  const data = localStorage.getItem('jt_validities')
  return data ? JSON.parse(data) : []
}

export const saveValidityDocs = (docs: ValidityDocument[]) => {
  localStorage.setItem('jt_validities', JSON.stringify(docs))
}
