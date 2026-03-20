import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LogOut, Cloud, RefreshCw, Smartphone, Info } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { ProjectsTab } from './components/ProjectsTab'
import { DocumentsTab } from './components/DocumentsTab'
import { TemplatesTab } from './components/TemplatesTab'
import { LogsTab } from './components/LogsTab'
import { AgendaTab } from './components/AgendaTab'
import { TicketsTab } from './components/TicketsTab'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSyncing, setIsSyncing] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [syncKey, setSyncKey] = useState(0)

  const isAuth = sessionStorage.getItem('admin_auth') === 'true'

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  if (!isAuth) return <Navigate to="/admin/login" />

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    navigate('/')
  }

  const handleSync = () => {
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
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen max-w-7xl">
      <Alert className="mb-8 bg-blue-50 text-blue-900 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertTitle>Ambiente de Desenvolvimento (Skip)</AlertTitle>
        <AlertDescription>
          Para que as últimas alterações de código fiquem disponíveis permanentemente online,
          lembre-se de clicar no botão <strong>"Publish"</strong> na interface da Skip.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy">
            Portal Administrativo
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gestão integrada de obras, custos e agenda.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
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
              {isSyncing ? 'Sincronizando...' : 'Backup Online'}
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
            className="text-sm md:text-base h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Projetos e Custos
          </TabsTrigger>
          <TabsTrigger
            value="chamados"
            className="text-sm md:text-base h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Chamados
          </TabsTrigger>
          <TabsTrigger
            value="agenda"
            className="text-sm md:text-base h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Agenda Técnica
          </TabsTrigger>
          <TabsTrigger
            value="documentos"
            className="text-sm md:text-base h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Repositório
          </TabsTrigger>
          <TabsTrigger
            value="modelos"
            className="text-sm md:text-base h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Gerar Modelos
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="text-sm md:text-base h-12 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Notificações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projetos">
          <ProjectsTab key={`proj-${syncKey}`} />
        </TabsContent>
        <TabsContent value="chamados">
          <TicketsTab key={`tck-${syncKey}`} />
        </TabsContent>
        <TabsContent value="agenda">
          <AgendaTab key={`ag-${syncKey}`} />
        </TabsContent>
        <TabsContent value="documentos">
          <DocumentsTab key={`doc-${syncKey}`} />
        </TabsContent>
        <TabsContent value="modelos">
          <TemplatesTab />
        </TabsContent>
        <TabsContent value="logs">
          <LogsTab key={`log-${syncKey}`} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
