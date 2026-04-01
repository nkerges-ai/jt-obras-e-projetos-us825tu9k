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
import { Upload, File as FileIcon, Trash2, FolderOpen, History } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  DocumentoArmazenado,
  getDocumentosArmazenados,
  addDocumentoArmazenado,
  updateDocumentoArmazenado,
  getHistoricoDocumentos,
  HistoricoDocumento,
  addAuditLog,
} from '@/lib/storage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function DocumentsTab() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<DocumentoArmazenado[]>([])
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareToken, setShareToken] = useState('')

  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [currentHistory, setCurrentHistory] = useState<HistoricoDocumento[]>([])
  const [selectedDocName, setSelectedDocName] = useState('')

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
          tipo_documento: 'acervo',
          nome_arquivo: newFile.name,
          descricao: 'Arquivo enviado manualmente',
          url_storage: `/projetos/global/acervo/${newFile.name.replace(/\s+/g, '_')}`,
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
          description: `${newFile.name} adicionado à arquitetura ilimitada.`,
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Arquitetura de Armazenamento Ilimitado
          </h3>
          <p className="text-muted-foreground text-sm">
            Gestão hierárquica e versionamento de arquivos por projeto.
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

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Tamanho</TableHead>
              <TableHead>Caminho Storage</TableHead>
              <TableHead>Atualizado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum arquivo no repositório.
                </TableCell>
              </TableRow>
            )}
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <FileIcon className="h-5 w-5 text-blue-500 shrink-0" />
                    <div>
                      <span className="truncate max-w-[180px] md:max-w-[250px] block">
                        {file.nome_arquivo}
                      </span>
                      <Badge variant="outline" className="text-[10px] h-4 mt-1 bg-gray-50">
                        {file.tipo_documento.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {formatBytes(file.tamanho_arquivo)}
                </TableCell>
                <TableCell
                  className="text-xs font-mono text-gray-500 max-w-[150px] truncate"
                  title={file.url_storage}
                >
                  {file.url_storage}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {new Date(file.data_atualizacao).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end items-center gap-2">
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
                      title="Histórico de Versões"
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

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" /> Histórico: {selectedDocName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4 max-h-[60vh] overflow-y-auto">
            {currentHistory.map((h) => (
              <div key={h.id} className="flex gap-4 p-4 border rounded-lg bg-gray-50 relative">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        h.acao === 'deletado'
                          ? 'destructive'
                          : h.acao === 'criado'
                            ? 'default'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {h.acao}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(h.data_acao).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm font-medium">Usuário: {h.usuario_id}</p>

                  {h.acao === 'editado' && (
                    <div className="mt-2 text-xs font-mono bg-white p-2 rounded border">
                      <span className="text-red-500">- Antigo: {h.dados_anteriores?.status}</span>
                      <br />
                      <span className="text-green-500">+ Novo: {h.dados_novos?.status}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {currentHistory.length === 0 && (
              <p className="text-center text-muted-foreground py-4">Nenhum histórico encontrado.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
