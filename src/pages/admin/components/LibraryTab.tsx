import { useState, useEffect } from 'react'
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
} from 'lucide-react'
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
import { cn } from '@/lib/utils'

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
    if (id === 'global') return 'Acervo Global'
    return projects.find((p) => p.id === id)?.name || 'Desconhecido'
  }

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
      title: 'PT',
      desc: 'Permissão de Trabalho. Liberação para atividades específicas.',
      icon: Activity,
    },
    {
      id: 'arpt',
      title: 'ARPT',
      desc: 'Análise de Risco e PT. Avaliação detalhada antes da execução.',
      icon: AlertTriangle,
    },
  ]

  const engModels = [
    {
      id: 1,
      title: 'Planta Elétrica Padrão',
      category: 'Elétrica',
      img: 'https://img.usecurling.com/p/400/300?q=blueprint&color=blue',
    },
    {
      id: 2,
      title: 'Esquema Hidráulico Base',
      category: 'Hidráulica',
      img: 'https://img.usecurling.com/p/400/300?q=pipes&color=blue',
    },
    {
      id: 3,
      title: 'Layout de Canteiro',
      category: 'Civil',
      img: 'https://img.usecurling.com/p/400/300?q=construction%20plan&color=gray',
    },
    {
      id: 4,
      title: 'Reforço Estrutural Viga',
      category: 'Estrutural',
      img: 'https://img.usecurling.com/p/400/300?q=steel%20beams&color=gray',
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Acervo Técnico Centralizado
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie documentos, modelos inteligentes e desenhos técnicos.
          </p>
        </div>
        <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" /> Novo Arquivo
        </Button>
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
            value="smart-templates"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Modelos de Preenchimento Inteligente
          </TabsTrigger>
          <TabsTrigger
            value="engineering-models"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            Modelos de Projetos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="repository" className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-none bg-white">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-lg">Documentos e Plantas</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-secondary/30">
                    <TableRow>
                      <TableHead>Documento</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Vinculação</TableHead>
                      <TableHead className="text-center">Liberar p/ Cliente</TableHead>
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
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={!doc.isRestricted}
                              onCheckedChange={() => toggleRestriction(doc)}
                            />
                            <span
                              className={cn(
                                'text-xs font-medium w-[60px]',
                                !doc.isRestricted ? 'text-green-600' : 'text-orange-600',
                              )}
                            >
                              {!doc.isRestricted ? 'Liberado' : 'Restrito'}
                            </span>
                          </div>
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

        <TabsContent value="engineering-models">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Biblioteca de Modelos de Projetos</CardTitle>
              <CardDescription>
                Acesse desenhos técnicos, esquemas e layouts estruturais padronizados.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {engModels.map((model) => (
                  <Card
                    key={model.id}
                    className="overflow-hidden border shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 bg-secondary/50 overflow-hidden relative group">
                      <img
                        src={model.img}
                        alt={model.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold shadow-sm">
                        {model.category}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-sm text-brand-navy mb-1 line-clamp-1">
                        {model.title}
                      </h4>
                      <Button variant="outline" size="sm" className="w-full text-xs h-8 mt-2">
                        Visualizar Padrão
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    <SelectItem value="Modelos de Projeto">Modelos de Projeto</SelectItem>
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
