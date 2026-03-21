import { useState, useEffect } from 'react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Upload, Lock, Unlock, FileText, Check, X } from 'lucide-react'
import {
  getTechnicalDocuments,
  saveTechnicalDocuments,
  getAccessRequests,
  saveAccessRequests,
  getProjects,
  TechnicalDocument,
  DocumentAccessRequest,
  Project,
} from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'

export function LibraryTab() {
  const { toast } = useToast()
  const [docs, setDocs] = useState<TechnicalDocument[]>([])
  const [requests, setRequests] = useState<DocumentAccessRequest[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newDoc, setNewDoc] = useState<Partial<TechnicalDocument>>({
    name: '',
    category: 'Plantas',
    projectId: 'global',
    isRestricted: false,
  })

  useEffect(() => {
    setDocs(getTechnicalDocuments())
    setRequests(getAccessRequests())
    setProjects(getProjects())
  }, [])

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    const doc: TechnicalDocument = {
      id: `doc_${Date.now()}`,
      name: newDoc.name || 'Documento Sem Nome',
      category: newDoc.category || 'Outros',
      uploadDate: new Date().toISOString(),
      projectId: newDoc.projectId || 'global',
      isRestricted: !!newDoc.isRestricted,
      url: '#',
    }
    const updated = [doc, ...docs]
    setDocs(updated)
    saveTechnicalDocuments(updated)
    setIsUploadOpen(false)
    setNewDoc({ name: '', category: 'Plantas', projectId: 'global', isRestricted: false })
    toast({ title: 'Documento Adicionado', description: 'Acervo técnico atualizado.' })
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

  const getProjectName = (id: string) => {
    if (id === 'global') return 'Acervo Global'
    return projects.find((p) => p.id === id)?.name || 'Desconhecido'
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Acervo Técnico Centralizado
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie plantas, manuais, laudos e acessos de clientes.
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" /> Novo Arquivo
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Documentos Registrados</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>Documento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Vinculação</TableHead>
                    <TableHead className="text-center">Acesso</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Nenhum documento no acervo.
                      </TableCell>
                    </TableRow>
                  )}
                  {docs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" /> {doc.name}
                      </TableCell>
                      <TableCell className="text-sm">{doc.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getProjectName(doc.projectId)}
                      </TableCell>
                      <TableCell className="text-center">
                        {doc.isRestricted ? (
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200 gap-1"
                          >
                            <Lock className="h-3 w-3" /> Restrito
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 gap-1"
                          >
                            <Unlock className="h-3 w-3" /> Público
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
      </div>

      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Documento ao Acervo</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Arquivo / Documento</Label>
              <Input
                required
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                placeholder="Ex: Planta Baixa - Térreo"
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
                    <SelectItem value="Garantias">Garantias</SelectItem>
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
    </div>
  )
}
