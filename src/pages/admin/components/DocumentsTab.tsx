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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, File as FileIcon, Trash2, FolderOpen, History, Eye, RotateCcw } from 'lucide-react'
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
          url_storage: reader.result as string, // Using Base64 to enable PDF viewing
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
          description: `${newFile.name} salvo no repositório unificado.`,
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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Repositório Unificado de Documentos
          </h3>
          <p className="text-muted-foreground text-sm">
            Navegação baseada em pastas, visualizador de PDF e recuperação de versões.
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
        />
        <Button onClick={handleUploadClick} className="gap-2 font-bold w-full sm:w-auto">
          <Upload className="h-4 w-4" /> Enviar PDF
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-4">
        <Tabs value={currentFolder} onValueChange={setCurrentFolder} className="w-full">
          <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 mb-4 overflow-x-auto">
            {['todos', 'acervo', 'certificado', 'contrato', 'orçamento', 'evidencia'].map(
              (folder) => (
                <TabsTrigger
                  key={folder}
                  value={folder}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 py-2 capitalize font-medium text-muted-foreground"
                >
                  {folder === 'todos' ? 'Todas as Pastas' : folder + 's'}
                </TabsTrigger>
              ),
            )}
          </TabsList>
        </Tabs>

        <div className="overflow-hidden border rounded-lg">
          <Table>
            <TableHeader className="bg-secondary/50">
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Pasta / Categoria</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    <FolderOpen className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                    Nenhum documento encontrado nesta pasta.
                  </TableCell>
                </TableRow>
              )}
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-5 w-5 text-red-500 shrink-0" />
                      <span className="truncate max-w-[180px] md:max-w-[250px] block font-semibold text-brand-navy">
                        {file.nome_arquivo}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {formatBytes(file.tamanho_arquivo)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      /projetos/global/{file.tipo_documento}s/
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                    {new Date(file.data_atualizacao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      {file.nome_arquivo.endsWith('.pdf') && (
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
                        title="Recuperação e Histórico"
                      >
                        <History className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(file)}
                        title="Excluir"
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

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" /> Recuperação de Versão: {selectedDocName}
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
                      {new Date(h.data_acao).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Responsável: {h.usuario_id}</p>
                </div>
                {i !== 0 && h.dados_anteriores && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 text-brand-navy border-brand-navy/30"
                    onClick={() => handleRestore(h.id)}
                  >
                    <RotateCcw className="h-4 w-4" /> Restaurar
                  </Button>
                )}
                {i === 0 && (
                  <Badge className="bg-green-100 text-green-800 border-none hover:bg-green-100">
                    Versão Atual
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-4xl h-[85vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="px-6 py-4 border-b bg-gray-50 shrink-0">
            <DialogTitle>Visualizador Integrado de PDF</DialogTitle>
          </DialogHeader>
          <div className="flex-1 bg-gray-900 w-full h-full relative">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none absolute inset-0"
              title="PDF Preview"
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartilhamento Público</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Label>Link de Acesso (Token Único)</Label>
            <div className="flex gap-2">
              <Input readOnly value={shareToken} />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(shareToken)
                  toast({ title: 'Link copiado' })
                }}
              >
                Copiar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
