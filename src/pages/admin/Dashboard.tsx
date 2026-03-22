import { useState, useEffect } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Cloud, RefreshCw, Smartphone, Info, Wifi, WifiOff } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { useNetwork } from '@/hooks/use-network'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getChatMessages } from '@/lib/storage'
import { Badge } from '@/components/ui/badge'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const isOnline = useNetwork()
  const [isSyncing, setIsSyncing] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [syncKey, setSyncKey] = useState(0)
  const [unreadAdmin, setUnreadAdmin] = useState(0)

  const isAuth = sessionStorage.getItem('admin_auth') === 'true'

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    const updateAdminUnread = () => {
      const msgs = getChatMessages()
      setUnreadAdmin(msgs.filter((m) => m.sender === 'client' && !m.read).length)
    }
    updateAdminUnread()
    window.addEventListener('jt_chats_updated', updateAdminUnread)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('jt_chats_updated', updateAdminUnread)
    }
  }, [])

  if (!isAuth) return <Navigate to="/admin/login" />

  const handleLogout = () => {
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

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen max-w-[1400px]">
      <Alert className="mb-8 bg-blue-50 text-blue-900 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>Ambiente de Desenvolvimento</AlertTitle>
        <AlertDescription>
          Dados são salvos no cache local do navegador, garantindo pleno funcionamento offline em
          campo.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy">
            Portal Administrativo
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gestão integrada de obras, cadastros, NRs e estoque.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button asChild variant="outline" className="gap-2 border-brand-navy text-brand-navy">
            <Link to="/campo">App de Campo (Mobile)</Link>
          </Button>
          <Button
            asChild
            variant="default"
            className="gap-2 bg-[#25D366] hover:bg-[#20b858] text-white"
          >
            <a href="https://wa.me/5511940037545" target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-4 w-4" /> Fale com um especialista
            </a>
          </Button>
          <div
            className={cn(
              'flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border shadow-sm',
              isOnline
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200',
            )}
          >
            {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            <span className="font-medium hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleInstallPWA}
            className="gap-2 bg-primary/5 hover:bg-primary/10 border-primary/20"
          >
            <Smartphone className="h-4 w-4" /> Instalar App
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border">
            <Cloud
              className={cn(
                'h-4 w-4',
                isSyncing ? 'text-blue-500 animate-pulse' : 'text-green-500',
              )}
            />
            <span className="font-medium hidden sm:inline">
              {isSyncing ? 'Sincronizando...' : 'Backup'}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1 rounded-full"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={cn('h-3 w-3', isSyncing && 'animate-spin')} />
            </Button>
          </div>
          <Button variant="destructive" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="projetos" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-8 pb-2 overflow-x-auto w-full">
          <TabsTrigger
            value="projetos"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Obras e Custos
          </TabsTrigger>
          <TabsTrigger
            value="mensagens"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Atendimento (Chat)
            {unreadAdmin > 0 && (
              <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] px-1.5 py-0 border-none shadow-none">
                {unreadAdmin}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="cadastros"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Cadastros
          </TabsTrigger>
          <TabsTrigger
            value="modelos"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Gerar Documentações
          </TabsTrigger>
          <TabsTrigger
            value="acervo"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Acervo Técnico
          </TabsTrigger>
          <TabsTrigger
            value="ativos"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Galeria de Assinaturas
          </TabsTrigger>
          <TabsTrigger
            value="validade"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Alertas de Validade
          </TabsTrigger>
          <TabsTrigger
            value="vencimentos"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Vencimentos NRs
          </TabsTrigger>
          <TabsTrigger
            value="estoque"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Estoque
          </TabsTrigger>
          <TabsTrigger
            value="b2b"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Locação (B2B)
          </TabsTrigger>
          <TabsTrigger
            value="chamados"
            className="text-sm h-10 px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Suporte
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projetos">
          <ProjectsTab key={`proj-${syncKey}`} />
        </TabsContent>
        <TabsContent value="mensagens">
          <AdminChatTab />
        </TabsContent>
        <TabsContent value="cadastros">
          <RegistrationsTab key={`cad-${syncKey}`} />
        </TabsContent>
        <TabsContent value="modelos">
          <TemplatesTab />
        </TabsContent>
        <TabsContent value="acervo">
          <LibraryTab key={`lib-${syncKey}`} />
        </TabsContent>
        <TabsContent value="ativos">
          <CompanyAssetsTab key={`ast-${syncKey}`} />
        </TabsContent>
        <TabsContent value="validade">
          <ValidityAlertsTab key={`val-${syncKey}`} />
        </TabsContent>
        <TabsContent value="vencimentos">
          <TrainingExpirationsTab key={`ven-${syncKey}`} />
        </TabsContent>
        <TabsContent value="estoque">
          <InventoryTab key={`inv-${syncKey}`} />
        </TabsContent>
        <TabsContent value="b2b">
          <B2BTab key={`b2b-${syncKey}`} />
        </TabsContent>
        <TabsContent value="chamados">
          <TicketsTab key={`tck-${syncKey}`} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
