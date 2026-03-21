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

export interface ConstructionReport {
  id: string
  date: string
  progress: number
  summary: string
  photos: string[]
  syncStatus?: 'pending' | 'synced'
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
  reports?: ConstructionReport[]
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
  probabilidade?: string
  severidade?: string
  nivelRisco?: string
  medidas: string
}

export interface PGRActionPlan {
  id: string
  what: string
  who: string
  startDate?: string
  endDate?: string
  when?: string // Deprecated
  status: 'Pendente' | 'Em Andamento' | 'Concluído'
  priority?: string
}

export interface PGRDocument {
  id: string
  projectId: string
  date: string
  empresa: string
  cnpj: string
  endereco?: string
  diretorAdmin?: string
  responsavelTecnico?: string
  elaborador: string
  introducao?: string
  escopo?: string
  gestaoTerceiros?: string
  monitoramento?: string
  encerramento?: string
  validade?: string
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
  docNumber?: string
  validade?: string
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
  clientEmail?: string
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
  role?: string
  dataUrl: string
}

export interface ChatMessage {
  id: string
  projectId: string
  sender: 'admin' | 'client'
  text: string
  timestamp: string
  read: boolean
  context?: string
}

// Pre-filled Examples
const DEFAULT_CONTRACTOR: Contractor = {
  id: 'c_ex_1',
  name: 'JT Obras e Projetos LTDA',
  cnpj: '63.243.791/0001-09',
  address: 'Rua Tommaso Giordani, 371 vila Guacuri – SP',
  contact: 'Eng. Responsável',
  email: 'contato@jtobras.com',
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
    },
  ],
}

export const DEFAULT_PGR_TEMPLATE: Omit<PGRDocument, 'id'> = {
  projectId: 'global',
  date: new Date().toISOString(),
  empresa: 'JT Obras e Manutenções LTDA',
  cnpj: '63.243.791/0001-09',
  endereco: 'Rua Tommaso Giordani, 371',
  diretorAdmin: 'Joel Nascimento de Paula',
  responsavelTecnico: 'Eder Silva',
  elaborador: 'Eder Silva (Técnico em Segurança do Trabalho - Reg. MTE 0116887/SP)',
  introducao:
    'Este Programa de Gerenciamento de Riscos (PGR) foi elaborado em conformidade com as diretrizes da Norma Regulamentadora nº 01 (NR-01) do Ministério do Trabalho e Previdência. Seu objetivo principal é estabelecer as medidas de prevenção necessárias para garantir a integridade física e a saúde dos trabalhadores envolvidos nas atividades executadas pela JT Obras e Manutenções Ltda.',
  escopo:
    'Este PGR aplica-se a todas as frentes de trabalho sob responsabilidade da JT Obras e Manutenções Ltda, englobando as atividades operacionais, de manutenção e serviços em geral realizados em instalações de clientes, bem como em suas próprias dependências.',
  gestaoTerceiros:
    'A JT Obras exige que todas as empresas contratadas e subcontratadas atuem em estrita conformidade com este PGR. Todos os terceiros devem apresentar seus respectivos PGRs e PCMSOs antes do início de qualquer atividade.',
  monitoramento:
    'Este PGR deve ser revisado anualmente, ou sempre que houver mudanças significativas no processo de trabalho, novos riscos identificados, acidentes ou doenças ocupacionais registradas, de forma a garantir a melhoria contínua da gestão de SST.',
  encerramento:
    'A liderança da JT Obras e Manutenções Ltda reafirma seu compromisso com a segurança e a saúde no trabalho, fornecendo os recursos necessários para a implementação das medidas descritas neste programa. Todos os colaboradores são orientados a seguir rigorosamente as regras estabelecidas.',
  riscos: [
    {
      id: 'r_1',
      atividade: 'Trabalho em Altura',
      perigo: 'Queda de pessoas com diferença de nível',
      dano: 'Fraturas, lesões múltiplas, óbito',
      probabilidade: '2',
      severidade: '5',
      nivelRisco: 'Moderado',
      medidas:
        'Uso de cinto de segurança tipo paraquedista com duplo talabarte; Instalação e uso de linha de vida; Treinamento NR-35; Emissão de PT; Isolamento e sinalização da área.',
    },
    {
      id: 'r_2',
      atividade: 'Trabalho com Eletricidade',
      perigo: 'Choque elétrico, arco elétrico',
      dano: 'Queimaduras, fibrilação ventricular, óbito',
      probabilidade: '2',
      severidade: '5',
      nivelRisco: 'Moderado',
      medidas:
        'Desenergização e bloqueio (LOTO); Uso de ferramentas isoladas e EPIs dielétricos (luvas, botinas); Treinamento NR-10; Emissão de PT.',
    },
    {
      id: 'r_3',
      atividade: 'Ambiente de Trabalho / Gestão',
      perigo: 'Riscos Psicossociais (Excesso de carga, pressão por metas)',
      dano: 'Estresse ocupacional, Ansiedade, Síndrome de Burnout',
      probabilidade: '3',
      severidade: '3',
      nivelRisco: 'Moderado',
      medidas:
        'Planejamento adequado das atividades, pausas programadas, canal aberto para comunicação e feedback, promoção de saúde mental.',
    },
  ],
  planoAcao: [
    {
      id: 'pa_1',
      what: 'Treinamento NR-35 e NR-10 para novos colaboradores',
      priority: 'Alta',
      who: 'Eder Silva (TST)',
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      status: 'Pendente',
    },
    {
      id: 'pa_2',
      what: 'Inspeção e substituição de EPIs desgastados',
      priority: 'Média',
      who: 'Joel Nascimento (Admin)',
      endDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
      status: 'Em Andamento',
    },
    {
      id: 'pa_3',
      what: 'Implementação de Permissão de Trabalho (PT) diária',
      priority: 'Alta',
      who: 'Encarregado da Obra',
      endDate: new Date().toISOString(),
      status: 'Concluído',
    },
    {
      id: 'pa_4',
      what: 'Avaliação de Clima Organizacional (Psicossocial)',
      priority: 'Média',
      who: 'RH / Segurança',
      endDate: new Date(new Date().setDate(new Date().getDate() + 60)).toISOString(),
      status: 'Pendente',
    },
  ],
}

const EXAMPLE_PGR: PGRDocument = {
  id: 'example_pgr_1',
  ...DEFAULT_PGR_TEMPLATE,
}

const EXAMPLE_OS: ServiceOrder = {
  id: 'example_os_1',
  osNumber: 'EX-01',
  revision: '00',
  projectId: 'global',
  date: new Date().toISOString(),
  prestadora: {
    nome: 'JT Obras e Manutenções LTDA',
    cnpj: '63.243.791/0001-09',
    endereco: 'Rua Tommaso Giordani, 371',
    responsavel: 'Eng. Responsável',
    telefone: '11999999999',
  },
  execucao: { local: 'Fachada Leste', dataInicio: '2024-01-01', dataFim: '2024-12-31' },
  atividade: {
    descricao: 'Pintura de Fachada externa com uso de balancim e tratamento estrutural',
    setor: 'Externa',
  },
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
  docNumber: 'DOC-2026-001',
  attendanceList: [
    { id: 'att_1', name: 'João Silva', cpf: '123.456.789-00' },
    { id: 'att_2', name: 'Maria Souza', cpf: '555.666.777-88' },
  ],
}

// Accessors
export const getProjects = (): Project[] => {
  const data = localStorage.getItem('jt_projects_v5')
  return data ? JSON.parse(data) : []
}
export const saveProjects = (projects: Project[]) => {
  localStorage.setItem('jt_projects_v5', JSON.stringify(projects))
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
  const data = localStorage.getItem('jt_pgr_v6')
  if (!data) {
    const oldData = localStorage.getItem('jt_pgr_v5')
    if (oldData) {
      const parsed = JSON.parse(oldData)
      savePGRs(parsed)
      return parsed
    }
    savePGRs([EXAMPLE_PGR])
    return [EXAMPLE_PGR]
  }
  return JSON.parse(data)
}
export const savePGRs = (pgrs: PGRDocument[]) => {
  localStorage.setItem('jt_pgr_v6', JSON.stringify(pgrs))
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
  const data = localStorage.getItem('jt_assets_v2')
  return data ? JSON.parse(data) : []
}
export const saveCompanyAssets = (items: CompanyAsset[]) => {
  localStorage.setItem('jt_assets_v2', JSON.stringify(items))
}

export const getChatMessages = (): ChatMessage[] => {
  const data = localStorage.getItem('jt_chats_v1')
  return data ? JSON.parse(data) : []
}

export const saveChatMessages = (messages: ChatMessage[]) => {
  localStorage.setItem('jt_chats_v1', JSON.stringify(messages))
  window.dispatchEvent(new Event('jt_chats_updated'))
}

export const addChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => {
  const messages = getChatMessages()
  const newMsg: ChatMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    timestamp: new Date().toISOString(),
    read: false,
  }
  saveChatMessages([...messages, newMsg])
  return newMsg
}

export const markMessagesAsRead = (projectId: string, reader: 'admin' | 'client') => {
  const messages = getChatMessages()
  let changed = false
  const updated = messages.map((m) => {
    if (m.projectId === projectId && m.sender !== reader && !m.read) {
      changed = true
      return { ...m, read: true }
    }
    return m
  })
  if (changed) {
    saveChatMessages(updated)
  }
}
