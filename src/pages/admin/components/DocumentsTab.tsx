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
import {
  FileText,
  File as FileIcon,
  FolderOpen,
  Edit,
  Trash2,
  ShieldCheck,
  FileSignature,
  Receipt,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import { useRealtime } from '@/hooks/use-realtime'

type UnifiedDoc = {
  id: string
  collection: 'certificates' | 'contracts' | 'budgets'
  title: string
  subtitle: string
  status: string
  updated: string
  pdf_url?: string
}

export function DocumentsTab() {
  const { toast } = useToast()
  const [docs, setDocs] = useState<UnifiedDoc[]>([])
  const [filter, setFilter] = useState<'all' | 'certificates' | 'contracts' | 'budgets'>('all')
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [certs, conts, buds] = await Promise.all([
        pb.collection('certificates').getFullList({ sort: '-updated' }),
        pb.collection('contracts').getFullList({ sort: '-updated' }),
        pb.collection('budgets').getFullList({ sort: '-updated' }),
      ])

      const unified: UnifiedDoc[] = [
        ...certs.map((c) => ({
          id: c.id,
          collection: 'certificates' as const,
          title: `Certificado ${c.nr_type}`,
          subtitle: c.collaborator_name,
          status: c.status,
          updated: c.updated,
          pdf_url: c.pdf_url ? pb.files.getUrl(c, c.pdf_url) : undefined,
        })),
        ...conts.map((c) => ({
          id: c.id,
          collection: 'contracts' as const,
          title: `Contrato`,
          subtitle: c.client_name,
          status: c.status,
          updated: c.updated,
          pdf_url: c.pdf_url ? pb.files.getUrl(c, c.pdf_url) : undefined,
        })),
        ...buds.map((b) => ({
          id: b.id,
          collection: 'budgets' as const,
          title: `Orçamento`,
          subtitle: b.client_name,
          status: b.status,
          updated: b.updated,
          pdf_url: b.pdf_url ? pb.files.getUrl(b, b.pdf_url) : undefined,
        })),
      ].sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())

      setDocs(unified)
    } catch (error) {
      toast({ title: 'Erro', description: getErrorMessage(error), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('certificates', loadData)
  useRealtime('contracts', loadData)
  useRealtime('budgets', loadData)

  const handleDelete = async (doc: UnifiedDoc) => {
    if (!confirm('Deseja realmente excluir este documento?')) return
    try {
      await pb.collection(doc.collection).delete(doc.id)
      toast({ title: 'Sucesso', description: 'Documento excluído.' })
    } catch (err) {
      toast({ title: 'Erro', description: getErrorMessage(err), variant: 'destructive' })
    }
  }

  const filteredDocs = docs.filter((d) => filter === 'all' || d.collection === filter)

  const getIcon = (collection: string) => {
    switch (collection) {
      case 'certificates':
        return <ShieldCheck className="h-5 w-5 text-green-600" />
      case 'contracts':
        return <FileSignature className="h-5 w-5 text-blue-600" />
      case 'budgets':
        return <Receipt className="h-5 w-5 text-orange-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getEditPath = (doc: UnifiedDoc) => {
    switch (doc.collection) {
      case 'certificates':
        return `/admin/template/certificado/${doc.id}`
      case 'contracts':
        return `/admin/template/contrato/${doc.id}`
      case 'budgets':
        return `/admin/template/orcamento/${doc.id}`
      default:
        return '#'
    }
  }

  const translateStatus = (status: string) => {
    const map: Record<string, string> = {
      draft: 'Rascunho',
      active: 'Ativo',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      sent: 'Enviado',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    }
    return map[status] || status
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" /> Acervo Técnico
          </h3>
          <p className="text-muted-foreground text-sm">
            Gerencie certificados, contratos e orçamentos da empresa.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-0 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Folder Navigation */}
        <div className="w-full md:w-64 border-r bg-gray-50 p-4 shrink-0 flex flex-col">
          <h4 className="font-bold text-xs text-brand-navy uppercase tracking-wider mb-4 px-2">
            Filtros
          </h4>
          <nav className="space-y-1">
            <button
              onClick={() => setFilter('all')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'all' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <FolderOpen className="h-4 w-4" /> Todos
            </button>
            <button
              onClick={() => setFilter('certificates')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'certificates' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <ShieldCheck className="h-4 w-4" /> Certificados
            </button>
            <button
              onClick={() => setFilter('contracts')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'contracts' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <FileSignature className="h-4 w-4" /> Contratos
            </button>
            <button
              onClick={() => setFilter('budgets')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${filter === 'budgets' ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-200'}`}
            >
              <Receipt className="h-4 w-4" /> Orçamentos
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 md:p-6 flex flex-col">
          <div className="overflow-x-auto border rounded-lg flex-1 bg-white shadow-sm">
            <Table>
              <TableHeader className="bg-secondary/30 sticky top-0">
                <TableRow>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : filteredDocs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                      <FolderOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      Nenhum documento encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocs.map((doc) => (
                    <TableRow
                      key={`${doc.collection}-${doc.id}`}
                      className="group hover:bg-gray-50/70"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getIcon(doc.collection)}
                          <div>
                            <span className="font-semibold text-gray-900 block">{doc.title}</span>
                            <span className="text-xs text-muted-foreground">{doc.subtitle}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {translateStatus(doc.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(doc.updated).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" asChild title="Editar">
                          <Link to={getEditPath(doc)}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        {doc.pdf_url && (
                          <Button variant="ghost" size="icon" asChild title="Visualizar PDF">
                            <a href={doc.pdf_url} target="_blank" rel="noopener noreferrer">
                              <FileIcon className="h-4 w-4 text-red-500" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
