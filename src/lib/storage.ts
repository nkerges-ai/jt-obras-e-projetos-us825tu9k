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
  endDate?: string
  description?: string
  technicalResponsible?: string
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
  biometricData?: BiometricValidation
}

export interface ValidityDocument {
  id: string
  name: string
  category: string
  expirationDate: string
  warningDays: number
}

export interface Ppe {
  id: string
  name: string
  category: string
  description: string
  availability: number
}

export interface Equipment {
  id: string
  type: string
  specs: string
  rentalStatus: 'Disponível' | 'Locado' | 'Em Manutenção'
}

// Data keys updated to _v3 to ensure complete data sanitization and empty states
export const getProjects = (): Project[] => {
  const data = localStorage.getItem('jt_projects_v3')
  return data ? JSON.parse(data) : []
}

export const saveProjects = (projects: Project[]) => {
  localStorage.setItem('jt_projects_v3', JSON.stringify(projects))
}

export const getEvents = (): CalendarEvent[] => {
  const data = localStorage.getItem('jt_events_v3')
  return data ? JSON.parse(data) : []
}

export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem('jt_events_v3', JSON.stringify(events))
}

export const getLogs = (): NotificationLog[] => {
  const data = localStorage.getItem('jt_logs_v3')
  return data ? JSON.parse(data) : []
}

export const addLog = (log: Omit<NotificationLog, 'id' | 'date'>) => {
  const logs = getLogs()
  const newLog: NotificationLog = {
    ...log,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  }
  localStorage.setItem('jt_logs_v3', JSON.stringify([newLog, ...logs]))
}

export const getTickets = (): Ticket[] => {
  const data = localStorage.getItem('jt_tickets_v3')
  return data ? JSON.parse(data) : []
}

export const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem('jt_tickets_v3', JSON.stringify(tickets))
}

export const getInventory = (): Material[] => {
  const data = localStorage.getItem('jt_inventory_v3')
  return data ? JSON.parse(data) : []
}

export const saveInventory = (inventory: Material[]) => {
  localStorage.setItem('jt_inventory_v3', JSON.stringify(inventory))
}

export const getServiceOrders = (): ServiceOrder[] => {
  const data = localStorage.getItem('jt_os_v3')
  return data ? JSON.parse(data) : []
}

export const saveServiceOrders = (orders: ServiceOrder[]) => {
  localStorage.setItem('jt_os_v3', JSON.stringify(orders))
}

export const getTechnicalDocuments = (): TechnicalDocument[] => {
  const data = localStorage.getItem('jt_tech_docs_v3')
  return data ? JSON.parse(data) : []
}

export const saveTechnicalDocuments = (docs: TechnicalDocument[]) => {
  localStorage.setItem('jt_tech_docs_v3', JSON.stringify(docs))
}

export const getAccessRequests = (): DocumentAccessRequest[] => {
  const data = localStorage.getItem('jt_access_requests_v3')
  return data ? JSON.parse(data) : []
}

export const saveAccessRequests = (reqs: DocumentAccessRequest[]) => {
  localStorage.setItem('jt_access_requests_v3', JSON.stringify(reqs))
}

export const getSignatures = (): DocumentSignature[] => {
  const data = localStorage.getItem('jt_signatures_v3')
  return data ? JSON.parse(data) : []
}

export const saveSignatures = (sigs: DocumentSignature[]) => {
  localStorage.setItem('jt_signatures_v3', JSON.stringify(sigs))
}

export const getValidityDocs = (): ValidityDocument[] => {
  const data = localStorage.getItem('jt_validities_v3')
  return data ? JSON.parse(data) : []
}

export const saveValidityDocs = (docs: ValidityDocument[]) => {
  localStorage.setItem('jt_validities_v3', JSON.stringify(docs))
}

export const getPpe = (): Ppe[] => {
  const data = localStorage.getItem('jt_ppe_v3')
  return data ? JSON.parse(data) : []
}

export const savePpe = (ppes: Ppe[]) => {
  localStorage.setItem('jt_ppe_v3', JSON.stringify(ppes))
}

export const getEquipment = (): Equipment[] => {
  const data = localStorage.getItem('jt_equipment_v3')
  return data ? JSON.parse(data) : []
}

export const saveEquipment = (equipments: Equipment[]) => {
  localStorage.setItem('jt_equipment_v3', JSON.stringify(equipments))
}
