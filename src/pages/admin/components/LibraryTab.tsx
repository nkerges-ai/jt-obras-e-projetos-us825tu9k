import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  FolderOpen,
  Upload,
  FileText,
  Check,
  X,
  ShieldAlert,
  FileSignature,
  AlertTriangle,
  Activity,
  PenTool,
  Copy,
  Mail,
  Search,
  CheckCircle,
  Eye,
  File as FileIcon,
} from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import {
  getTechnicalDocuments,
  saveTechnicalDocuments,
  getAccessRequests,
  saveAccessRequests,
  getProjects,
  TechnicalDocument,
  DocumentAccessRequest,
  Project,
  DocumentSignature,
  getSignatures,
  saveSignatures,
} from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { EmailSenderDialog } from '@/components/EmailSenderDialog'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function LibraryTab() {
  const { toast } = useToast()
  const [docs, setDocs] = useState<TechnicalDocument[]>([])
  const [requests, setRequests] = useState<DocumentAccessRequest[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [signatures, setSignatures] = useState<DocumentSignature[]>([])

  const [searchTerm, setSearchTerm] = useState('')

  const fileRef = useRef<HTMLInputElement>(null)
  const [fileDataUrl, setFileDataUrl] = useState<string>('#')

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newDoc, setNewDoc] = useState<Partial<TechnicalDocument>>({
    name: '',
    category: 'Plantas',
    projectId: 'global',
    isRestricted: false,
  })

  const [isSignatureOpen, setIsSignatureOpen] = useState(false)
  const [sigTarget, setSigTarget] = useState<TechnicalDocument | null>(null)
  const [sigForm, setSigForm] = useState({ clientName: '', clientPhone: '' })

  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [emailTarget, setEmailTarget] = useState<TechnicalDocument | null>(null)

  const [previewDoc, setPreviewDoc] = useState<TechnicalDocument | null>(null)

  useEffect(() => {
    setDocs(getTechnicalDocuments())
    setRequests(getAccessRequests())
    setProjects(getProjects())
    setSignatures(getSignatures())
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limite
        toast({
          title: 'Arquivo muito grande',
          description: 'O limite de upload em ambiente de demonstração é de 2MB.',
          variant: 'destructive',
        })
        if (fileRef.current) fileRef.current.value = ''
        return
      }

      if (!newDoc.name) {
        setNewDoc((prev) => ({ ...prev, name: file.name }))
      }

      const reader = new FileReader()
      reader.onload = (ev) => {
        setFileDataUrl(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    const doc: TechnicalDocument = {
      id: `doc_${Date.now()}`,
      name: newDoc.name || 'Documento Sem Nome',
      category: newDoc.category || 'Outros',
      uploadDate: new Date().toISOString(),
      projectId: newDoc.projectId || 'global',
      isRestricted: !!newDoc.isRestricted,
      url: fileDataUrl,
    }
    const updated = [doc, ...docs]
    setDocs(updated)
    saveTechnicalDocuments(updated)
    setIsUploadOpen(false)
    setNewDoc({ name: '', category: 'Plantas', projectId: 'global', isRestricted: false })
    setFileDataUrl('#')
    if (fileRef.current) fileRef.current.value = ''
    toast({ title: 'Documento Adicionado', description: 'Acervo técnico atualizado.' })
  }

  const handleRequestSignature = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sigTarget) return
    const newSig: DocumentSignature = {
      id: `sig_${Date.now()}`,
      documentId: sigTarget.id,
      documentName: sigTarget.name,
      clientName: sigForm.clientName,
      clientPhone: sigForm.clientPhone,
      status: 'Pendente',
      sentDate: new Date().toISOString(),
    }
    const updatedSigs = [newSig, ...signatures]
    setSignatures(updatedSigs)
    saveSignatures(updatedSigs)
    setIsSignatureOpen(false)
    setSigForm({ clientName: '', clientPhone: '' })
    toast({
      title: 'Solicitação Criada',
      description: 'O link de assinatura está disponível no painel.',
    })
  }

  const handleRequest = (reqId: string, status: 'Aprovado' | 'Negado') => {
    const updated = requests.map((r) => (r.id === reqId ? { ...r, status } : r))
    setRequests(updated)
    saveAccessRequests(updated)
    toast({
      title: `Solicitação ${status}`,
      description: 'A permissão de acesso do cliente foi atualizada.',
    })
  }

  const toggleRestriction = (doc: TechnicalDocument) => {
    const updated = docs.map((d) => (d.id === doc.id ? { ...d, isRestricted: !d.isRestricted } : d))
    setDocs(updated)
    saveTechnicalDocuments(updated)
    toast({
      title: 'Acesso Atualizado',
      description: doc.isRestricted
        ? 'Documento liberado para o portal do cliente.'
        : 'Documento restrito.',
    })
  }

  const getProjectName = (id: string) => {
    if (id === 'global') return 'Acervo Global e Administrativo'
    return projects.find((p) => p.id === id)?.name || 'Desconhecido'
  }

  const handleExportWord = (doc: TechnicalDocument) => {
    const dateStr = new Date().toISOString().split('T')[0]
    const safeName = doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
    const fileName = `${safeName}_${dateStr}.doc`

    if (doc.url && doc.url !== '#' && (!doc.content || doc.content.trim() === '')) {
      toast({
        title: 'Exportação Indisponível',
        description:
          'Este documento é um arquivo original anexado. Utilize o download de PDF ou a visualização direta.',
        variant: 'destructive',
      })
      return
    }

    const content =
      doc.content ||
      `Documento: ${doc.name}\n\n[Nenhum conteúdo textual formatado disponível neste registro]`

    const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>${doc.name}</title></head>
    <body>
      <h1 style="color: #005A9C; font-family: Arial, sans-serif;">${doc.name}</h1>
      <p style="font-family: Arial, sans-serif;"><strong>Data de Referência:</strong> ${new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p>
      <p style="font-family: Arial, sans-serif;"><strong>Categoria:</strong> ${doc.category}</p>
      <p style="font-family: Arial, sans-serif;"><strong>Número do Documento:</strong> ${doc.docNumber || 'N/A'}</p>
      <hr/>
      <div style="font-family: Arial, sans-serif; white-space: pre-wrap; line-height: 1.5; margin-top: 20px;">${content}</div>
    </body>
    </html>`

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({ title: 'Exportação Concluída', description: 'Arquivo Word gerado com sucesso.' })
  }

  const handleExportPDF = (doc: TechnicalDocument) => {
    const dateStr = new Date().toISOString().split('T')[0]
    const safeName = doc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()

    if (
      doc.url &&
      doc.url !== '#' &&
      (doc.url.startsWith('data:application/pdf') || doc.url.startsWith('http'))
    ) {
      const link = document.createElement('a')
      link.href = doc.url
      link.download = `${safeName}_${dateStr}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast({ title: 'Exportação Concluída', description: 'PDF original baixado com sucesso.' })
      return
    }

    const content =
      doc.content ||
      `Documento: ${doc.name}\nCategoria: ${doc.category}\n\n[Este documento foi anexado como um arquivo de imagem ou binário. Por favor, visualize-o diretamente.]`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${doc.name} - PDF Export</title>
            <style>
              @page { margin: 20mm; }
              body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
              h1 { color: #005A9C; border-bottom: 2px solid #005A9C; padding-bottom: 10px; font-size: 24px; }
              .meta { font-size: 12px; color: #555; margin-bottom: 30px; }
              .content { white-space: pre-wrap; font-size: 14px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>${doc.name}</h1>
            <div class="meta">
              <p><strong>Data de Referência:</strong> ${new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</p>
              <p><strong>Categoria:</strong> ${doc.category}</p>
              <p><strong>Número do Documento:</strong> ${doc.docNumber || 'N/A'}</p>
            </div>
            <div class="content">${content}</div>
            <script>
              window.onload = () => {
                window.print();
                setTimeout(() => window.close(), 500);
              }
            </script>
          </body>
        </html>
      `)
      printWindow.document.close()
    }

    toast({
      title: 'Gerando PDF',
      description: 'A janela de impressão foi aberta para salvar como PDF.',
    })
  }

  const filteredDocs = docs.filter((doc) => {
    const search = searchTerm.toLowerCase()
    return (
      doc.name.toLowerCase().includes(search) ||
      getProjectName(doc.projectId).toLowerCase().includes(search) ||
      (doc.docNumber && doc.docNumber.toLowerCase().includes(search))
    )
  })

  // Group by project
  const groupedDocs = filteredDocs.reduce(
    (acc, doc) => {
      const pid = doc.projectId || 'global'
      if (!acc[pid]) acc[pid] = []
      acc[pid].push(doc)
      return acc
    },
    {} as Record<string, TechnicalDocument[]>,
  )

  // Sort groups: "global" first, then alphabetically
  const sortedPids = Object.keys(groupedDocs).sort((a, b) => {
    if (a === 'global') return -1
    if (b === 'global') return 1
    return getProjectName(a).localeCompare(getProjectName(b))
  })

  const smartTemplates = [
    {
      id: 'art',
      title: 'ART',
      desc: 'Anotação de Responsabilidade Técnica. Registro formal de autoria.',
      icon: FileSignature,
    },
    {
      id: 'avcb',
      title: 'AVCB',
      desc: 'Auto de Vistoria do Corpo de Bombeiros. Certificação de segurança.',
      icon: ShieldAlert,
    },
    {
      id: 'pt',
      title: 'PT (Permissão Trabalho)',
      desc: 'Liberação para atividades específicas conforme NRs.',
      icon: Activity,
    },
    {
      id: 'arpt',
      title: 'ARPT (Análise Risco)',
      desc: 'Análise detalhada de riscos antes da execução.',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {emailTarget && (
        <EmailSenderDialog
          open={isEmailOpen}
          onOpenChange={(v) => {
            setIsEmailOpen(v)
            if (!v) setEmailTarget(null)
          }}
          documentName={emailTarget.name}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Acervo Técnico Centralizado
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie documentos, pesquise o histórico de clientes e colete assinaturas.
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="gap-2 font-bold w-full sm:w-auto"
          >
            <Upload className="h-4 w-4" /> Novo Arquivo
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center gap-2">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input
          placeholder="Pesquisar por nome, número do documento ou cliente/projeto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 text-base"
        />
      </div>

      <Tabs defaultValue="repository" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
          <TabsTrigger
            value="repository"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Repositório Principal
          </TabsTrigger>
          <TabsTrigger
            value="signatures"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Assinaturas Digitais
          </TabsTrigger>
          <TabsTrigger
            value="smart-templates"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Gerar Documentos (NRs)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repository" className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {sortedPids.length === 0 ? (
              <Card className="shadow-sm border-none bg-white">
                <CardContent className="text-center py-8 text-muted-foreground">
                  Nenhum documento encontrado.
                </CardContent>
              </Card>
            ) : (
              <Accordion type="multiple" defaultValue={['global']} className="w-full space-y-4">
                {sortedPids.map((pid) => {
                  const projectDocs = groupedDocs[pid].sort(
                    (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
                  )

                  return (
                    <AccordionItem
                      key={pid}
                      value={pid}
                      className="bg-white border rounded-xl shadow-sm px-2 sm:px-4 overflow-hidden"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-3 font-bold text-brand-navy">
                          <FolderOpen className="h-5 w-5 text-brand-light shrink-0" />
                          <span className="truncate text-left">{getProjectName(pid)}</span>
                          <Badge variant="secondary" className="ml-2 font-medium shrink-0">
                            {projectDocs.length} doc{projectDocs.length !== 1 && 's'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <Table>
                          <TableHeader className="bg-secondary/30">
                            <TableRow>
                              <TableHead>Documento</TableHead>
                              <TableHead className="text-center">Liberar p/ Cliente</TableHead>
                              <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {projectDocs.map((doc) => {
                              const hasSig = signatures.find((s) => s.documentId === doc.id)
                              return (
                                <TableRow key={doc.id}>
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-blue-500 shrink-0" />
                                      <span className="truncate max-w-[200px]">{doc.name}</span>
                                      {doc.docNumber && (
                                        <Badge
                                          variant="outline"
                                          className="text-[9px] h-5 px-1.5 shrink-0 bg-brand-light/5 text-brand-light border-brand-light/20"
                                        >
                                          {doc.docNumber}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground mt-1 ml-6 font-normal">
                                      {doc.category} •{' '}
                                      {new Date(doc.uploadDate).toLocaleDateString('pt-BR')}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <Switch
                                        checked={!doc.isRestricted}
                                        onCheckedChange={() => toggleRestriction(doc)}
                                      />
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setPreviewDoc(doc)}
                                          >
                                            <Eye className="h-4 w-4 text-gray-600" />
                                            <span className="sr-only">Visualizar Documento</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Visualizar</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleExportPDF(doc)}
                                          >
                                            <FileIcon className="h-4 w-4 text-red-600" />
                                            <span className="sr-only">Salvar em PDF</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Salvar em PDF</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleExportWord(doc)}
                                          >
                                            <FileText className="h-4 w-4 text-blue-600" />
                                            <span className="sr-only">Salvar em Word</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Salvar em Word</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              setEmailTarget(doc)
                                              setIsEmailOpen(true)
                                            }}
                                          >
                                            <Mail className="h-4 w-4 text-blue-600" />
                                            <span className="sr-only">Enviar por E-mail</span>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Enviar por E-mail</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {hasSig ? (
                                        <Badge
                                          variant="outline"
                                          className={
                                            hasSig.status === 'Assinado'
                                              ? 'bg-green-100 text-green-800 border-green-200 text-[10px] ml-2'
                                              : 'bg-yellow-100 text-yellow-800 border-yellow-200 text-[10px] ml-2'
                                          }
                                        >
                                          {hasSig.status}
                                        </Badge>
                                      ) : (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-primary gap-1 px-2 ml-2"
                                          onClick={() => {
                                            setSigTarget(doc)
                                            setIsSignatureOpen(true)
                                          }}
                                        >
                                          Assinatura <PenTool className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )
                            })}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            )}
          </div>

          <div>
            <Card className="shadow-sm border-none bg-white">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Solicitações de Acesso</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {requests.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground py-4">
                    Nenhuma solicitação pendente.
                  </p>
                )}
                {requests.map((req) => (
                  <div key={req.id} className="border rounded-lg p-3 bg-gray-50/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-sm">{req.clientName}</span>
                      <Badge
                        variant="outline"
                        className={
                          req.status === 'Pendente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : req.status === 'Aprovado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Ref: {docs.find((d) => d.id === req.documentId)?.name || 'Documento excluído'}
                    </p>
                    {req.status === 'Pendente' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                          onClick={() => handleRequest(req.id, 'Aprovado')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-red-50 text-red-700 hover:bg-red-100 border-red-200"
                          onClick={() => handleRequest(req.id, 'Negado')}
                        >
                          <X className="h-4 w-4 mr-1" /> Negar
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="signatures">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Gestão de Assinaturas Digitais</CardTitle>
              <CardDescription>
                Acompanhe os documentos enviados para os clientes aprovarem e assinarem.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Destinatário</TableHead>
                    <TableHead>Data Envio</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signatures.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma assinatura solicitada ainda.
                      </TableCell>
                    </TableRow>
                  )}
                  {signatures.map((sig) => {
                    const link = `${window.location.origin}/assinatura/${sig.id}`
                    return (
                      <TableRow key={sig.id}>
                        <TableCell className="font-medium">{sig.documentName}</TableCell>
                        <TableCell>
                          <div>{sig.clientName}</div>
                          <div className="text-xs text-muted-foreground">{sig.clientPhone}</div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(sig.sentDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              sig.status === 'Assinado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {sig.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {sig.status === 'Pendente' ? (
                            <div className="flex justify-end gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                title="Copiar Link"
                                onClick={() => {
                                  navigator.clipboard.writeText(link)
                                  toast({ title: 'Link Copiado' })
                                }}
                              >
                                <Copy className="h-4 w-4 text-gray-600" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                title="Enviar WhatsApp"
                                className="text-[#25D366] border-[#25D366]/30 hover:bg-[#25D366]/10"
                                onClick={() => {
                                  const text = encodeURIComponent(
                                    `Olá ${sig.clientName}, segue o link para assinatura do documento ${sig.documentName}: ${link}`,
                                  )
                                  window.open(
                                    `https://wa.me/${sig.clientPhone.replace(/\D/g, '')}?text=${text}`,
                                    '_blank',
                                  )
                                }}
                              >
                                <WhatsAppIcon className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                              <CheckCircle className="h-3 w-3" /> Concluído
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="smart-templates">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {smartTemplates.map((t) => {
              const Icon = t.icon
              return (
                <Card
                  key={t.id}
                  className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col"
                >
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{t.title}</CardTitle>
                    <CardDescription className="text-sm mt-2 line-clamp-2">
                      {t.desc}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button asChild className="w-full">
                      <Link to={`/admin/acervo/template/${t.id}`}>Gerar Documento</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-navy">{previewDoc?.name}</DialogTitle>
            <DialogDescription>
              Categoria: {previewDoc?.category} | Número do Documento:{' '}
              {previewDoc?.docNumber || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-white border shadow-inner p-6 rounded-lg whitespace-pre-wrap text-sm text-gray-800 font-medium leading-relaxed mt-4">
            {previewDoc?.content || (
              <span className="text-gray-400 italic">
                Este documento não possui texto detalhado armazenado no acervo. Apenas metadados
                disponíveis ou o arquivo foi anexado em outro formato.
              </span>
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              className="gap-2 text-blue-700 border-blue-200 hover:bg-blue-50"
              onClick={() => handleExportWord(previewDoc!)}
            >
              <FileText className="h-4 w-4" /> Salvar em Word
            </Button>
            <Button
              variant="outline"
              className="gap-2 text-red-700 border-red-200 hover:bg-red-50"
              onClick={() => handleExportPDF(previewDoc!)}
            >
              <FileIcon className="h-4 w-4" /> Salvar em PDF
            </Button>
            <Button onClick={() => setPreviewDoc(null)}>Fechar Visualização</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Documento ao Acervo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Arquivo (PDF, Word, Imagens - Máx 2MB)</Label>
              <Input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              />
            </div>
            <div className="space-y-2">
              <Label>Nome do Arquivo / Documento</Label>
              <Input
                required
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                placeholder="Ex: Planta Baixa - Térreo.pdf"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select
                  value={newDoc.category}
                  onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plantas">Plantas e Desenhos</SelectItem>
                    <SelectItem value="Manuais">Manuais Técnicos</SelectItem>
                    <SelectItem value="Laudos Técnicos">Laudos Técnicos</SelectItem>
                    <SelectItem value="AVCB">AVCB / Bombeiros</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vínculo</Label>
                <Select
                  value={newDoc.projectId}
                  onValueChange={(v) => setNewDoc({ ...newDoc, projectId: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global (Todos)</SelectItem>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t mt-4">
              <Checkbox
                id="restricted"
                checked={newDoc.isRestricted}
                onCheckedChange={(c) => setNewDoc({ ...newDoc, isRestricted: !!c })}
              />
              <Label htmlFor="restricted" className="cursor-pointer">
                Documento Restrito (Exige Aprovação do Cliente)
              </Label>
            </div>
            <Button type="submit" className="w-full mt-4">
              Salvar no Acervo
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSignatureOpen} onOpenChange={setIsSignatureOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Solicitar Assinatura Digital</DialogTitle>
            <DialogDescription>
              Enviaremos um link seguro para o cliente assinar o documento{' '}
              <strong>{sigTarget?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRequestSignature} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Cliente / Responsável</Label>
              <Input
                required
                value={sigForm.clientName}
                onChange={(e) => setSigForm({ ...sigForm, clientName: e.target.value })}
                placeholder="Ex: Carlos Silva"
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone (WhatsApp)</Label>
              <Input
                required
                value={sigForm.clientPhone}
                onChange={(e) => setSigForm({ ...sigForm, clientPhone: e.target.value })}
                placeholder="Ex: 11 99999-9999"
              />
            </div>
            <Button type="submit" className="w-full mt-2">
              Gerar Link de Assinatura
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
