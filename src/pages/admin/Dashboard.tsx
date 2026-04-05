import { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  LogOut,
  Cloud,
  RefreshCw,
  Smartphone,
  Info,
  Wifi,
  WifiOff,
  FileText,
  HardHat,
  LifeBuoy,
  Settings,
  Lock,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useNetwork } from '@/hooks/use-network'
import pb from '@/lib/pocketbase/client'

import { OverviewTab } from './components/OverviewTab'
import { ProjectsTab } from './components/ProjectsTab'
import { TemplatesTab } from './components/TemplatesTab'
import { TicketsTab } from './components/TicketsTab'
import { InventoryTab } from './components/InventoryTab'
import { LibraryTab } from './components/LibraryTab'
import { ValidityAlertsTab } from './components/ValidityAlertsTab'
import { B2BTab } from './components/B2BTab'
import { RegistrationsTab } from './components/RegistrationsTab'
import { TrainingExpirationsTab } from './components/TrainingExpirationsTab'
import { CompanyAssetsTab } from './components/CompanyAssetsTab'
import { AdminChatTab } from './components/AdminChatTab'
import { LixeiraTab } from './components/LixeiraTab'
import { AuditoriaTab } from './components/AuditoriaTab'
import { DocumentsTab } from './components/DocumentsTab'
import { ExecutiveDashboardTab } from './components/ExecutiveDashboardTab'
import { CustomersTab } from './components/CustomersTab'
import { CloudProjectsTab } from './components/CloudProjectsTab'
import { CertificatesTab } from './components/CertificatesTab'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import logo from '@/assets/logotipo-c129e.jpg'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from '@/components/ui/sidebar'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const isOnline = useNetwork()
  const [isSyncing, setIsSyncing] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [syncKey, setSyncKey] = useState(0)

  const [searchParams, setSearchParams] = useSearchParams()
  const activeView = searchParams.get('tab') || 'exec-dashboard'
  const setActiveView = (tab: string) => setSearchParams({ tab })

  const isAuth = pb.authStore.isValid || sessionStorage.getItem('admin_auth') === 'true'

  useEffect(() => {
    let mounted = true
    if (!isAuth && mounted) {
      navigate('/admin/login', { replace: true })
    }
    return () => {
      mounted = false
    }
  }, [isAuth, navigate])

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  if (!isAuth) return null // Prevent rendering while redirecting

  const handleLogout = () => {
    pb.authStore.clear()
    sessionStorage.removeItem('admin_auth')
    navigate('/')
  }

  const handleSync = () => {
    if (!isOnline) {
      toast({
        title: 'Modo Offline',
        description: 'Você está sem conexão com a internet. Os dados estão salvos localmente.',
        variant: 'destructive',
      })
      return
    }
    setIsSyncing(true)
    setTimeout(() => {
      setSyncKey((prev) => prev + 1)
      setIsSyncing(false)
      toast({
        title: 'Sincronização concluída',
        description: 'Os dados foram atualizados com sucesso.',
      })
    }, 1000)
  }

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') setDeferredPrompt(null)
    } else {
      toast({
        title: 'Instalação indisponível',
        description: 'O app já está instalado ou não suportado.',
      })
    }
  }

  const renderContent = () => {
    switch (activeView) {
      case 'exec-dashboard':
        return <ExecutiveDashboardTab key={`exec-${syncKey}`} />
      case 'clientes':
        return <CustomersTab key={`cli-${syncKey}`} />
      case 'obras-cloud':
        return <CloudProjectsTab key={`obras-${syncKey}`} />
      case 'visao-geral':
        return <OverviewTab key={`ov-${syncKey}`} />
      case 'projetos':
        return <ProjectsTab key={`proj-${syncKey}`} />
      case 'cadastros':
        return <RegistrationsTab key={`cad-${syncKey}`} />
      case 'estoque':
        return <InventoryTab key={`inv-${syncKey}`} />
      case 'b2b':
        return <B2BTab key={`b2b-${syncKey}`} />
      case 'documentos':
        return <DocumentsTab key={`docs-${syncKey}`} />
      case 'certificados':
        return <CertificatesTab key={`cert-${syncKey}`} />
      case 'modelos':
        return <TemplatesTab />
      case 'acervo':
        return <LibraryTab key={`lib-${syncKey}`} />
      case 'ativos':
        return <CompanyAssetsTab key={`ast-${syncKey}`} />
      case 'validade':
        return <ValidityAlertsTab key={`val-${syncKey}`} />
      case 'vencimentos':
        return <TrainingExpirationsTab key={`ven-${syncKey}`} />
      case 'mensagens':
        return <AdminChatTab />
      case 'chamados':
        return <TicketsTab key={`tck-${syncKey}`} />
      case 'auditoria':
        return <AuditoriaTab />
      case 'lixeira':
        return <LixeiraTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-gray-50 border-t">
        <Sidebar className="border-r border-gray-200 bg-white">
          <SidebarHeader className="p-4 border-b">
            <h2 className="font-bold text-brand-navy flex items-center gap-2">
              <Settings className="h-5 w-5" /> Portal Admin
            </h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-brand-navy font-semibold text-sm">
                <Cloud className="h-4 w-4" /> CRM & Projetos (Cloud)
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'exec-dashboard'}
                    onClick={() => setActiveView('exec-dashboard')}
                  >
                    Dashboard Executivo
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'clientes'}
                    onClick={() => setActiveView('clientes')}
                  >
                    Clientes (CRM)
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'obras-cloud'}
                    onClick={() => setActiveView('obras-cloud')}
                  >
                    Obras e Contratos
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-brand-navy font-semibold text-sm mt-2">
                <HardHat className="h-4 w-4" /> Gestão de Obras (Local)
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'visao-geral'}
                    onClick={() => setActiveView('visao-geral')}
                  >
                    Visão Geral
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'projetos'}
                    onClick={() => setActiveView('projetos')}
                  >
                    Obras e Custos
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'cadastros'}
                    onClick={() => setActiveView('cadastros')}
                  >
                    Cadastros
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'estoque'}
                    onClick={() => setActiveView('estoque')}
                  >
                    Estoque
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'b2b'}
                    onClick={() => setActiveView('b2b')}
                  >
                    Locação (B2B)
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-brand-navy font-semibold text-sm mt-2">
                <FileText className="h-4 w-4" /> Gestão Documental
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'certificados'}
                    onClick={() => setActiveView('certificados')}
                  >
                    Certificados NR
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'modelos'}
                    onClick={() => setActiveView('modelos')}
                  >
                    Gerador de Documento
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'acervo'}
                    onClick={() => setActiveView('acervo')}
                  >
                    Acervo Técnico
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'ativos'}
                    onClick={() => setActiveView('ativos')}
                  >
                    Galeria de Assinaturas
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'documentos'}
                    onClick={() => setActiveView('documentos')}
                  >
                    Repositório de Arquivos
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'validade'}
                    onClick={() => setActiveView('validade')}
                  >
                    Alertas de Validade
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'vencimentos'}
                    onClick={() => setActiveView('vencimentos')}
                  >
                    Vencimentos NRs
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-brand-navy font-semibold text-sm mt-2">
                <LifeBuoy className="h-4 w-4" /> Suporte & Sistema
              </SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'mensagens'}
                    onClick={() => setActiveView('mensagens')}
                    className="justify-between"
                  >
                    Atendimento (Chat)
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'chamados'}
                    onClick={() => setActiveView('chamados')}
                  >
                    Chamados (Tickets)
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'auditoria'}
                    onClick={() => setActiveView('auditoria')}
                  >
                    Auditoria
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activeView === 'lixeira'}
                    onClick={() => setActiveView('lixeira')}
                  >
                    Lixeira
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-14 border-b bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-40 relative">
            {/* Mobile Header */}
            <div className="flex md:hidden items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="text-brand-navy p-2" />
                <img src={logo} alt="JT Obras" className="h-8 object-contain ml-2" />
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="text-slate-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-4 w-px bg-gray-300"></div>
              <h1 className="text-lg font-bold text-brand-navy">Dashboard</h1>
            </div>

            <div className="hidden md:flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="flex gap-2 text-xs h-8 border-brand-navy/30"
              >
                <Link to="/campo">App de Campo</Link>
              </Button>
              <div
                className={cn(
                  'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border shadow-sm',
                  isOnline
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-red-50 text-red-700 border-red-200',
                )}
              >
                {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                <span className="hidden sm:inline font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full border shadow-sm">
                <Cloud
                  className={cn(
                    'h-3.5 w-3.5 ml-1',
                    isSyncing ? 'text-blue-500 animate-pulse' : 'text-green-500',
                  )}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full"
                  onClick={handleSync}
                  disabled={isSyncing}
                >
                  <RefreshCw className={cn('h-3 w-3', isSyncing && 'animate-spin')} />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstallPWA}
                className="hidden md:flex gap-1.5 h-8 text-xs border-brand-navy/30"
              >
                <Smartphone className="h-3.5 w-3.5" /> App
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 ml-2 h-8 text-xs"
              >
                <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-gray-50/50 relative pb-28">
            <Alert className="mb-6 bg-blue-50 text-blue-900 border-blue-200 shadow-sm hidden md:flex items-start">
              <Info className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <AlertTitle className="font-bold text-sm">
                  Ambiente PWA de Alta Performance
                </AlertTitle>
                <AlertDescription className="text-xs mt-1 text-blue-800">
                  Os dados funcionam localmente (offline first). Para compartilhar ou sincronizar,
                  clique no ícone de nuvem superior.
                </AlertDescription>
              </div>
            </Alert>

            <div className="mx-auto w-full max-w-[1400px]">{renderContent()}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
