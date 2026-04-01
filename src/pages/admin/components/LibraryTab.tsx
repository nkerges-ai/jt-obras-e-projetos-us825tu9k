import { useState, useRef, useEffect } from 'react'
import {
  getTechnicalDocuments,
  saveTechnicalDocuments,
  softDelete,
  addAuditLog,
  TechnicalDocument,
  addLog,
} from '@/lib/storage'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Mail, Trash2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function LibraryTab() {
  const [docs, setDocs] = useState<TechnicalDocument[]>([])
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDocs(getTechnicalDocuments())
  }, [])

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newDoc: TechnicalDocument = {
          id: `acervo_${Date.now()}`,
          name: file.name,
          category: 'Acervo Técnico',
          uploadDate: new Date().toISOString(),
          projectId: 'global',
          isRestricted: false,
          url: ev.target?.result as string,
        }
        const updated = [newDoc, ...docs]
        setDocs(updated)
        saveTechnicalDocuments(updated)
        addAuditLog({
          userId: 'Admin',
          action: 'Upload Acervo Técnico',
          table: 'Document',
          newData: JSON.stringify(newDoc),
        })
        toast({ title: 'Acervo Técnico', description: 'Documento armazenado com sucesso.' })
      }
      reader.readAsDataURL(file)
      e.target.value = ''
    }
  }

  const handleEmailShare = (doc: TechnicalDocument) => {
    const token = btoa(doc.id).replace(/=/g, '')
    const link = `${window.location.origin}/publico/documento/${token}`

    addLog({
      type: 'Email',
      recipient: 'cliente@exemplo.com',
      message: `Acesse o documento técnico: ${link}`,
      status: 'Enviado',
    })

    toast({
      title: 'Enviado por E-mail',
      description: 'O link seguro foi encaminhado para o cliente.',
    })
  }

  const handleDelete = (doc: TechnicalDocument) => {
    softDelete('Document', doc)
    const updated = docs.filter((d) => d.id !== doc.id)
    setDocs(updated)
    saveTechnicalDocuments(updated)
    addAuditLog({
      userId: 'Admin',
      action: 'Excluir',
      table: 'Document',
      previousData: JSON.stringify(doc),
    })
    toast({ title: 'Movido para a Lixeira' })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" /> Acervo Técnico Oficial
          </h3>
          <p className="text-muted-foreground text-sm">
            Repositório central de ARTs, memoriais descritivos e projetos as-built.
          </p>
        </div>
        <input type="file" ref={fileRef} onChange={handleUpload} className="hidden" />
        <Button
          onClick={() => fileRef.current?.click()}
          className="gap-2 font-bold w-full sm:w-auto"
        >
          <Upload className="h-4 w-4" /> Upload Acervo Técnico
        </Button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Documento</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Nenhum documento no acervo.
                </TableCell>
              </TableRow>
            )}
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" /> {doc.name}
                </TableCell>
                <TableCell>{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEmailShare(doc)}
                    title="Enviar por E-mail"
                    className="text-blue-600"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(doc)}
                    title="Excluir"
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
