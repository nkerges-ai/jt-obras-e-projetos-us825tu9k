import { useState, useRef } from 'react'
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
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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

  const [files, setFiles] = useState<DocFile[]>([])

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0]
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
        description: `${newFile.name} foi adicionado ao repositório.`,
      })
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
    </div>
  )
}
