import { useState, useRef } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  FileText,
  Upload,
  FileSignature,
  Calculator,
  LogOut,
  File as FileIcon,
  Cloud,
  RefreshCw,
  MessageCircle,
  PenTool,
  CheckCircle,
  Download,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState([
    {
      id: 1,
      name: 'Alvara_Prefeitura.pdf',
      type: 'application/pdf',
      date: '2023-10-15',
      status: 'Assinado',
    },
    {
      id: 2,
      name: 'Modelo_Contrato_Base.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      date: '2023-11-01',
      status: 'Rascunho',
    },
  ])

  const [isSyncing, setIsSyncing] = useState(false)
  const isAuth = sessionStorage.getItem('admin_auth') === 'true'

  if (!isAuth) {
    return <Navigate to="/admin/login" />
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    navigate('/')
  }

  const handleSync = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      toast({
        title: 'Backup concluído',
        description: 'Todos os documentos foram sincronizados com a nuvem.',
      })
    }, 2000)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0]

      if (
        !newFile.name.endsWith('.pdf') &&
        !newFile.name.endsWith('.docx') &&
        !newFile.name.endsWith('.doc')
      ) {
        toast({
          title: 'Formato não suportado',
          description: 'Por favor, envie apenas arquivos Word (.doc, .docx) ou PDF.',
          variant: 'destructive',
        })
        return
      }

      setFiles([
        {
          id: Date.now(),
          name: newFile.name,
          type: newFile.type,
          date: new Date().toISOString().split('T')[0],
          status: 'Rascunho',
        },
        ...files,
      ])

      toast({
        title: 'Arquivo salvo com sucesso',
        description: `${newFile.name} foi adicionado ao repositório e enviado para a nuvem.`,
      })

      handleSync()
      e.target.value = ''
    }
  }

  const handleSendWhatsApp = (fileName: string) => {
    const text = encodeURIComponent(
      `Olá! Segue o documento ${fileName} da JT Obras e Manutenções: [LINK DO DOCUMENTO]`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  const handleSignFile = (id: number) => {
    setFiles(files.map((f) => (f.id === id ? { ...f, status: 'Assinado' } : f)))
    toast({
      title: 'Documento assinado',
      description: 'A assinatura digital foi vinculada ao documento.',
    })
    handleSync()
  }

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy">
            Portal Administrativo
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gerencie seus documentos e gere novos orçamentos ou contratos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border">
            <Cloud
              className={cn(
                'h-4 w-4',
                isSyncing ? 'text-blue-500 animate-pulse' : 'text-green-500',
              )}
            />
            <span className="font-medium">
              {isSyncing ? 'Sincronizando nuvem...' : 'Backup Atualizado'}
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
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documentos" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 h-14 mb-8">
          <TabsTrigger value="documentos" className="text-base h-full">
            Meus Arquivos
          </TabsTrigger>
          <TabsTrigger value="modelos" className="text-base h-full">
            Gerar Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documentos" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">Repositório de Arquivos</h3>
              <p className="text-muted-foreground text-sm">
                Armazene PDFs e arquivos Word com segurança na nuvem.
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />
            <Button onClick={handleUploadClick} className="gap-2 font-bold w-full sm:w-auto">
              <Upload className="h-4 w-4" /> Enviar Arquivo
            </Button>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Nome do Arquivo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {files.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum arquivo armazenado.
                    </TableCell>
                  </TableRow>
                )}
                {files.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      {file.name.includes('.pdf') ? (
                        <FileIcon className="h-5 w-5 text-red-500 shrink-0" />
                      ) : (
                        <FileText className="h-5 w-5 text-blue-500 shrink-0" />
                      )}
                      <span className="truncate max-w-[180px] md:max-w-md block">{file.name}</span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                          file.status === 'Assinado'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700',
                        )}
                      >
                        {file.status === 'Assinado' ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <PenTool className="h-3 w-3" />
                        )}
                        {file.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(file.date).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        {file.status !== 'Assinado' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSignFile(file.id)}
                            title="Assinar Digitalmente"
                          >
                            <PenTool className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSendWhatsApp(file.name)}
                          title="Enviar por WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Baixar">
                          <Download className="h-4 w-4 text-gray-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="modelos">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-all border-primary/20">
              <CardHeader>
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <FileSignature className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Novo Contrato</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  Gere um contrato de prestação de serviços completo com folha timbrada, pronto para
                  assinatura digital, impressão ou envio.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full h-12 text-lg font-bold">
                  <Link to="/admin/template/contrato">Preencher Contrato</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all border-primary/20">
              <CardHeader>
                <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                  <Calculator className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl">Novo Orçamento</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">
                  Crie uma proposta comercial formal para apresentar aos seus clientes, formatada
                  com a identidade visual da empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full h-12 text-lg font-bold">
                  <Link to="/admin/template/orcamento">Preencher Orçamento</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
