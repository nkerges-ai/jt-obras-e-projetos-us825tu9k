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
  FileText,
  Upload,
  File as FileIcon,
  MessageCircle,
  PenTool,
  CheckCircle,
  Download,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  getTechnicalDocuments,
  saveTechnicalDocuments,
  softDelete,
  addAuditLog,
  TechnicalDocument,
} from '@/lib/storage'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type DocFile = {
  id: number
  name: string
  type: string
  date: string
  status: string
}

export function DocumentsTab() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [files, setFiles] = useState<TechnicalDocument[]>([])
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [shareToken, setShareToken] = useState('')

  useEffect(() => {
    setFiles(getTechnicalDocuments())
  }, [])

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        const doc: TechnicalDocument = {
          id: `doc_${Date.now()}`,
          name: newFile.name,
          category: 'Geral',
          uploadDate: new Date().toISOString(),
          projectId: 'global',
          isRestricted: false,
          url: event.target?.result as string,
        }
        const updated = [doc, ...files]
        setFiles(updated)
        saveTechnicalDocuments(updated)
        addAuditLog({
          userId: 'Admin',
          action: 'Upload',
          table: 'Document',
          newData: JSON.stringify(doc),
        })
        toast({ title: 'Arquivo salvo', description: `${newFile.name} adicionado.` })
      }
      reader.readAsDataURL(newFile)
      e.target.value = ''
    }
  }

  const handleDelete = (doc: TechnicalDocument) => {
    softDelete('Document', doc)
    const updated = files.filter((f) => f.id !== doc.id)
    setFiles(updated)
    saveTechnicalDocuments(updated)
    addAuditLog({
      userId: 'Admin',
      action: 'Delete',
      table: 'Document',
      previousData: JSON.stringify(doc),
    })
    toast({ title: 'Movido para Lixeira' })
  }

  const handleShare = (docId: string) => {
    const token = btoa(docId).replace(/=/g, '')
    setShareToken(`${window.location.origin}/publico/documento/${token}`)
    setIsShareOpen(true)
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
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Repositório de Arquivos
          </h3>
          <p className="text-muted-foreground text-sm">
            Armazene PDFs e arquivos Word com segurança na nuvem.
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
                  Nenhum arquivo adicionado.
                </TableCell>
              </TableRow>
            )}
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-blue-500 shrink-0" />
                  <span className="truncate max-w-[180px] md:max-w-md block">{file.name}</span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Disponível
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(file.uploadDate).toLocaleDateString('pt-BR')}
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
                      onClick={() => handleSendWhatsApp(file.name)}
                      title="Enviar por WhatsApp"
                    >
                      <MessageCircle className="h-4 w-4 text-green-600" />
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
    </div>
  )
}
