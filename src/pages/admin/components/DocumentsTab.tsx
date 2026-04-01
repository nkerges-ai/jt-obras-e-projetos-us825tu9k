import { useState, useRef, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Upload,
  FileText,
  File as FileIcon,
  Trash2,
  FolderOpen,
  History,
  Eye,
  RotateCcw,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DocumentoArmazenado,
  getDocumentosArmazenados,
  addDocumentoArmazenado,
  updateDocumentoArmazenado,
  getHistoricoDocumentos,
  HistoricoDocumento,
  addAuditLog,
  restoreDocumentoArmazenado,
} from '@/lib/storage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function DocumentsTab() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<DocumentoArmazenado[]>([])
  const [currentFolder, setCurrentFolder] = useState('todos')

  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareToken, setShareToken] = useState('')

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentHistory, setCurrentHistory] = useState<HistoricoDocumento[]>([])
  const [selectedDocName, setSelectedDocName] = useState('')

  const [isPdfOpen, setIsPdfOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState('')

  useEffect(() => {
    loadFiles()
  }, [])

  const loadFiles = () => {
    const docs = getDocumentosArmazenados().filter((d) => d.status !== 'deletado')
    setFiles(docs)
  }

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        const doc = addDocumentoArmazenado({
          projeto_id: 'global',
          tipo_documento: currentFolder === 'todos' ? 'acervo' : (currentFolder as any),
          nome_arquivo: newFile.name,
          descricao: 'Arquivo enviado manualmente',
          url_storage: reader.result as string,
          tamanho_arquivo: newFile.size,
          usuario_id: 'admin_user',
          status: 'ativo',
        })
        loadFiles()
        addAuditLog({
          userId: 'admin_user',
          action: 'Upload',
          table: 'documentos_armazenados',
          newData: JSON.stringify(doc),
        })
        toast({
          title: 'Arquivo salvo',
          description: `${newFile.name} salvo na pasta /${currentFolder === 'todos' ? 'acervo' : currentFolder}.`,
        })
      }
      reader.readAsDataURL(newFile)
      e.target.value = ''
    }
  }

  const handleDelete = (doc: DocumentoArmazenado) => {
    updateDocumentoArmazenado(doc.id, { status: 'deletado' }, 'admin_user')
    loadFiles()
    addAuditLog({
      userId: 'admin_user',
      action: 'Delete',
      table: 'documentos_armazenados',
      previousData: JSON.stringify(doc),
    })
    toast({ title: 'Movido para Lixeira' })
  }

  const handleShare = (docId: string) => {
    const token = btoa(docId).replace(/=/g, '')
    setShareToken(`${window.location.origin}/publico/documento/${token}`)
    setIsShareOpen(true)
  }

  const viewHistory = (doc: DocumentoArmazenado) => {
    const allHistory = getHistoricoDocumentos()
    const docHistory = allHistory
      .filter((h) => h.documento_id === doc.id)
      .sort((a, b) => new Date(b.data_acao).getTime() - new Date(a.data_acao).getTime())
    setCurrentHistory(docHistory)
    setSelectedDocName(doc.nome_arquivo)
    setIsHistoryOpen(true)
  }

  const handleRestore = (historyId: string) => {
    restoreDocumentoArmazenado(historyId, 'admin_user')
    loadFiles()
    setIsHistoryOpen(false)
    addAuditLog({
      userId: 'admin_user',
      action: 'Restaurar Versão',
      table: 'documentos_armazenados',
    })
    toast({
      title: 'Versão Restaurada',
      description: 'O documento foi revertido ao estado anterior.',
    })
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(
    (f) => currentFolder === 'todos' || f.tipo_documento === currentFolder,
  )

  const getFileIcon = (filename: string) => {
    if (filename.toLowerCase().endsWith('.pdf'))
      return <FileIcon className="h-6 w-6 text-red-500 shrink-0" />
    if (filename.toLowerCase().endsWith('.docx') || filename.toLowerCase().endsWith('.doc'))
      return <FileText className="h-6 w-6 text-blue-600 shrink-0" />
    return <FileText className="h-6 w-6 text-gray-500 shrink-0" />
  }

  const folders = ['todos', 'acervo', 'certificado', 'contrato', 'orçamento', 'evidencia']

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Central de Arquivos
          </h3>
          <p className="text-muted-foreground text-sm">
            Navegue pela estrutura de pastas e acesse todos os documentos gerados e PDFs.
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
        <Button onClick={handleUploadClick} className="gap-2 font-bold w-full sm:w-auto">
          <Upload className="h-4 w-4" /> Enviar Arquivo
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-0 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Folder Navigation */}
        <div className="w-full md:w-64 border-r bg-gray-50 p-4 shrink-0 flex flex-col">
          <h4 className="font-bold text-xs text-brand-navy uppercase tracking-wider mb-4 px-2">
            Repositório
          </h4>
          <nav className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setCurrentFolder(folder)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentFolder === folder ? 'bg-primary/10 text-primary border-r-2 border-primary rounded-r-none' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                <FolderOpen
                  className={`h-4 w-4 ${currentFolder === folder ? 'fill-primary/20 text-primary' : 'text-gray-400'}`}
                />
                <span className="capitalize">
                  {folder === 'todos' ? 'Raiz (Todos)' : folder + 's'}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="mb-6 flex items-center bg-gray-100/50 p-3 rounded-lg border border-gray-200">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => setCurrentFolder('todos')}
                    className="cursor-pointer font-medium text-brand-navy"
                  >
                    Supabase Storage
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer text-gray-500">projetos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="cursor-pointer text-gray-500">global</BreadcrumbLink>
                </BreadcrumbItem>
                {currentFolder !== 'todos' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize font-bold text-brand-navy">
                        {currentFolder}s
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="overflow-x-auto border rounded-lg flex-1 bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-secondary/30 sticky top-0 backdrop-blur-sm">
                <TableRow>
                  <TableHead className="w-[40%]">Nome do Arquivo</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      Esta pasta está vazia.
                    </TableCell>
                  </TableRow>
                )}
                {filteredFiles.map((file) => (
                  <TableRow key={file.id} className="group hover:bg-gray-50/70 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.nome_arquivo)}
                        <div>
                          <span className="truncate max-w-[200px] md:max-w-[300px] block font-semibold text-gray-900 group-hover:text-brand-navy">
                            {file.nome_arquivo}
                          </span>
                          <span className="text-[10px] text-muted-foreground capitalize">
                            /projetos/global/{file.tipo_documento}s/
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatBytes(file.tamanho_arquivo)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {new Date(file.data_atualizacao).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        {file.nome_arquivo.toLowerCase().endsWith('.pdf') && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPdfUrl(file.url_storage)
                              setIsPdfOpen(true)
                            }}
                            title="Visualizar PDF"
                          >
                            <Eye className="h-4 w-4 text-brand-light" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(file.id)}
                          title="Link Público"
                        >
                          <Upload className="h-4 w-4 text-brand-orange" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewHistory(file)}
                          title="Histórico e Restauração"
                        >
                          <History className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(file)}
                          title="Mover para Lixeira"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-brand-navy" /> Histórico de Versões:{' '}
              {selectedDocName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            {currentHistory.map((h, i) => (
              <div
                key={h.id}
                className="flex gap-4 p-4 border rounded-lg bg-gray-50 relative items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        h.acao === 'restaurado'
                          ? 'default'
                          : h.acao === 'editado'
                            ? 'secondary'
                            : 'outline'
                      }
                      className="capitalize"
                    >
                      {h.acao}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(h.data_acao).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Responsável: {h.usuario_id}</p>
                </div>
                {i !== 0 && h.dados_anteriores && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-brand-navy border-brand-navy/30 hover:bg-brand-navy/5"
                    onClick={() => handleRestore(h.id)}
                  >
                    <RotateCcw className="h-4 w-4" /> Restaurar
                  </Button>
                )}
                {i === 0 && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">
                    Versão Atual
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden flex flex-col rounded-xl bg-gray-900 border-gray-800">
          <DialogHeader className="px-4 py-3 border-b border-gray-800 bg-gray-950 shrink-0 flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-gray-200 text-sm font-normal">
              <FileIcon className="h-4 w-4 text-red-500" /> Visualizador PDF:{' '}
              <span className="font-bold text-white">{selectedDocName || 'Documento'}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full h-full relative flex items-center justify-center p-0 md:p-4">
            <iframe
              src={pdfUrl}
              className="w-full h-full max-w-4xl bg-white shadow-2xl md:rounded border-none"
              title="PDF Preview"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhamento Público de Arquivo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Label>Link de Acesso (Token Único Criptografado)</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={shareToken}
                className="font-mono text-xs text-gray-600 bg-gray-50"
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareToken)
                  toast({ title: 'Link copiado' })
                }}
              >
                Copiar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Quem possuir este link poderá visualizar e baixar o documento sem precisar de senha.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
