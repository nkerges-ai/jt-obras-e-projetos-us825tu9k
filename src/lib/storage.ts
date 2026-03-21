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

export interface PGRRisk {
  id: string
  atividade: string
  perigo: string
  dano: string
  medidas: string
}

export interface PGRActionPlan {
  id: string
  what: string
  who: string
  when: string
  status: 'Pendente' | 'Em Andamento' | 'Concluído'
}

export interface PGRDocument {
  id: string
  projectId: string
  date: string
  empresa: string
  cnpj: string
  elaborador: string
  riscos: PGRRisk[]
  planoAcao?: PGRActionPlan[]
  adminSignature?: {
    type: 'draw' | 'upload' | 'govbr'
    data?: string
    link?: string
    date: string
    biometric?: BiometricValidation
  }
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
  compliance?: {
    esocial?: string
    receita?: string
  }
  adminSignature?: {
    type: 'draw' | 'upload' | 'govbr'
    data?: string
    link?: string
    date: string
    biometric?: BiometricValidation
  }
}

export interface TechnicalDocument {
  id: string
  name: string
  category: string
  uploadDate: string
  projectId: string
  isRestricted: boolean
  url: string
  attendanceList?: { id: string; name: string; cpf: string; signature?: string }[]
  evidencePhotos?: string[]
  compliance?: {
    esocial?: string
    receita?: string
  }
  adminSignature?: {
    type: 'draw' | 'upload' | 'govbr'
    data?: string
    link?: string
    date: string
    biometric?: BiometricValidation
  }
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
  signatureType?: 'draw' | 'upload' | 'typed' | 'govbr'
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

export interface RentalRequest {
  id: string
  itemId: string
  itemType: 'EPI' | 'Equipamento'
  itemName: string
  projectId: string
  clientName: string
  quantity?: number
  status: 'Pendente' | 'Aprovado' | 'Rejeitado'
  requestDate: string
}

// New Models for User Story
export interface Contractor {
  id: string
  name: string
  cnpj: string
  address: string
  contact: string
  email?: string
}

export interface Employee {
  id: string
  name: string
  cpf: string
  role: string
  hireDate: string
  nrs: { nr: string; date: string; expirationDate: string }[]
}

export interface CompanyAsset {
  id: string
  type: 'signature' | 'stamp'
  name: string
  dataUrl: string
}

// Pre-filled Examples
const DEFAULT_CONTRACTOR: Contractor = {
  id: 'c_ex_1',
  name: 'Construtora Exemplo S.A.',
  cnpj: '12.345.678/0001-90',
  address: 'Av. Paulista, 1000 - São Paulo, SP',
  contact: 'Carlos Diretor',
  email: 'contato@construtoraexemplo.com',
}

const DEFAULT_EMPLOYEE: Employee = {
  id: 'e_ex_1',
  name: 'João Silva',
  cpf: '123.456.789-00',
  role: 'Pedreiro de Manutenção',
  hireDate: '2023-01-15',
  nrs: [
    {
      nr: 'NR-35',
      date: '2023-05-10',
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    },
    {
      nr: 'NR-10',
      date: '2024-01-20',
      expirationDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    }, // Vencendo logo
  ],
}

const EXAMPLE_PGR: PGRDocument = {
  id: 'example_pgr_1',
  projectId: 'global',
  date: new Date().toISOString(),
  empresa: 'JT Obras - Exemplo',
  cnpj: '63.243.791/0001-09',
  elaborador: 'Eng. Responsável Exemplo',
  riscos: [
    {
      id: 'r_1',
      atividade: 'Trabalho em Altura',
      perigo: 'Queda',
      dano: 'Fratura, Óbito',
      medidas: 'Uso de Cinto tipo paraquedista com duplo talabarte.',
    },
  ],
  planoAcao: [
    {
      id: 'pa_1',
      what: 'Treinamento NR35',
      who: 'Téc. Segurança',
      when: new Date().toISOString(),
      status: 'Concluído',
    },
  ],
}

const EXAMPLE_OS: ServiceOrder = {
  id: 'example_os_1',
  osNumber: 'EX-01',
  revision: '00',
  projectId: 'global',
  date: new Date().toISOString(),
  prestadora: {
    nome: 'Construtora Exemplo S.A.',
    cnpj: '12.345.678/0001-90',
    endereco: 'Av. Paulista, 1000',
    responsavel: 'Carlos Diretor',
    telefone: '11999999999',
  },
  execucao: { local: 'Fachada Leste', dataInicio: '2024-01-01', dataFim: '2024-12-31' },
  atividade: { descricao: 'Pintura de Fachada externa com uso de balancim', setor: 'Externa' },
  epis: [
    'Capacete de segurança com jugular',
    'Cinturão de segurança tipo paraquedista',
    'Luvas de segurança (raspa/vaqueta/látex)',
  ],
  epcs: ['Sinalização de área (cones, fitas, placas)', 'Linha de vida'],
  status: 'Rascunho',
}

const EXAMPLE_DOC_NR35: TechnicalDocument = {
  id: 'example_doc_nr35',
  name: 'Treinamento NR-35 - Exemplo',
  category: 'nr35',
  uploadDate: new Date().toISOString(),
  projectId: 'global',
  isRestricted: false,
  url: '#',
  attendanceList: [
    { id: 'att_1', name: 'João Silva', cpf: '123.456.789-00' },
    { id: 'att_2', name: 'Maria Souza', cpf: '555.666.777-88' },
  ],
}

// Accessors
export const getProjects = (): Project[] => {
  const data = localStorage.getItem('jt_projects_v4')
  return data ? JSON.parse(data) : []
}
export const saveProjects = (projects: Project[]) => {
  localStorage.setItem('jt_projects_v4', JSON.stringify(projects))
}

export const getEvents = (): CalendarEvent[] => {
  const data = localStorage.getItem('jt_events_v4')
  return data ? JSON.parse(data) : []
}
export const saveEvents = (events: CalendarEvent[]) => {
  localStorage.setItem('jt_events_v4', JSON.stringify(events))
}

export const getLogs = (): NotificationLog[] => {
  const data = localStorage.getItem('jt_logs_v4')
  return data ? JSON.parse(data) : []
}
export const addLog = (log: Omit<NotificationLog, 'id' | 'date'>) => {
  const logs = getLogs()
  const newLog: NotificationLog = {
    ...log,
    id: Date.now().toString(),
    date: new Date().toISOString(),
  }
  localStorage.setItem('jt_logs_v4', JSON.stringify([newLog, ...logs]))
}

export const getTickets = (): Ticket[] => {
  const data = localStorage.getItem('jt_tickets_v4')
  return data ? JSON.parse(data) : []
}
export const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem('jt_tickets_v4', JSON.stringify(tickets))
}

export const getInventory = (): Material[] => {
  const data = localStorage.getItem('jt_inventory_v4')
  return data ? JSON.parse(data) : []
}
export const saveInventory = (inventory: Material[]) => {
  localStorage.setItem('jt_inventory_v4', JSON.stringify(inventory))
}

export const getPGRs = (): PGRDocument[] => {
  const data = localStorage.getItem('jt_pgr_v4')
  if (!data) {
    savePGRs([EXAMPLE_PGR])
    return [EXAMPLE_PGR]
  }
  return JSON.parse(data)
}
export const savePGRs = (pgrs: PGRDocument[]) => {
  localStorage.setItem('jt_pgr_v4', JSON.stringify(pgrs))
}

export const getServiceOrders = (): ServiceOrder[] => {
  const data = localStorage.getItem('jt_os_v4')
  if (!data) {
    saveServiceOrders([EXAMPLE_OS])
    return [EXAMPLE_OS]
  }
  return JSON.parse(data)
}
export const saveServiceOrders = (orders: ServiceOrder[]) => {
  localStorage.setItem('jt_os_v4', JSON.stringify(orders))
}

export const getTechnicalDocuments = (): TechnicalDocument[] => {
  const data = localStorage.getItem('jt_tech_docs_v4')
  if (!data) {
    saveTechnicalDocuments([EXAMPLE_DOC_NR35])
    return [EXAMPLE_DOC_NR35]
  }
  return JSON.parse(data)
}
export const saveTechnicalDocuments = (docs: TechnicalDocument[]) => {
  localStorage.setItem('jt_tech_docs_v4', JSON.stringify(docs))
}

export const getAccessRequests = (): DocumentAccessRequest[] => {
  const data = localStorage.getItem('jt_access_requests_v4')
  return data ? JSON.parse(data) : []
}
export const saveAccessRequests = (reqs: DocumentAccessRequest[]) => {
  localStorage.setItem('jt_access_requests_v4', JSON.stringify(reqs))
}

export const getSignatures = (): DocumentSignature[] => {
  const data = localStorage.getItem('jt_signatures_v4')
  return data ? JSON.parse(data) : []
}
export const saveSignatures = (sigs: DocumentSignature[]) => {
  localStorage.setItem('jt_signatures_v4', JSON.stringify(sigs))
}

export const getValidityDocs = (): ValidityDocument[] => {
  const data = localStorage.getItem('jt_validities_v4')
  return data ? JSON.parse(data) : []
}
export const saveValidityDocs = (docs: ValidityDocument[]) => {
  localStorage.setItem('jt_validities_v4', JSON.stringify(docs))
}

export const getPpe = (): Ppe[] => {
  const data = localStorage.getItem('jt_ppe_v4')
  return data ? JSON.parse(data) : []
}
export const savePpe = (ppes: Ppe[]) => {
  localStorage.setItem('jt_ppe_v4', JSON.stringify(ppes))
}

export const getEquipment = (): Equipment[] => {
  const data = localStorage.getItem('jt_equipment_v4')
  return data ? JSON.parse(data) : []
}
export const saveEquipment = (equipments: Equipment[]) => {
  localStorage.setItem('jt_equipment_v4', JSON.stringify(equipments))
}

export const getRentalRequests = (): RentalRequest[] => {
  const data = localStorage.getItem('jt_rental_requests_v4')
  return data ? JSON.parse(data) : []
}
export const saveRentalRequests = (reqs: RentalRequest[]) => {
  localStorage.setItem('jt_rental_requests_v4', JSON.stringify(reqs))
}

// New Storage for Cadastros e Ativos
export const getContractors = (): Contractor[] => {
  const data = localStorage.getItem('jt_contractors_v1')
  if (!data) {
    saveContractors([DEFAULT_CONTRACTOR])
    return [DEFAULT_CONTRACTOR]
  }
  return JSON.parse(data)
}
export const saveContractors = (items: Contractor[]) => {
  localStorage.setItem('jt_contractors_v1', JSON.stringify(items))
}

export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem('jt_employees_v1')
  if (!data) {
    saveEmployees([DEFAULT_EMPLOYEE])
    return [DEFAULT_EMPLOYEE]
  }
  return JSON.parse(data)
}
export const saveEmployees = (items: Employee[]) => {
  localStorage.setItem('jt_employees_v1', JSON.stringify(items))
}

export const getCompanyAssets = (): CompanyAsset[] => {
  const data = localStorage.getItem('jt_assets_v1')
  return data ? JSON.parse(data) : []
}
export const saveCompanyAssets = (items: CompanyAsset[]) => {
  localStorage.setItem('jt_assets_v1', JSON.stringify(items))
}
