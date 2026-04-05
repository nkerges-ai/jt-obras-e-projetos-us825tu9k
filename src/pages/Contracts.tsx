import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Trash, MoreVertical, Edit, Mail, Eye } from 'lucide-react'
import { EmailSenderDialog } from '@/components/EmailSenderDialog'

export default function Contracts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<any[]>([])
  const [clientName, setClientName] = useState('')
  const [contentHtml, setContentHtml] = useState('')
  const [activeTab, setActiveTab] = useState('list')
  const [editingId, setEditingId] = useState<string | null>(null)

  const [emailOpen, setEmailOpen] = useState(false)
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  const fetchContracts = async () => {
    try {
      const records = await pb.collection('contracts').getFullList({ sort: '-created' })
      setContracts(records)
    } catch (e) {
      console.error(e)
    }
  }
  useEffect(() => {
    fetchContracts()
  }, [])

  const loadTemplate = () => {
    setContentHtml(`<h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS</h1>
<p><strong>CONTRATADA:</strong> JT OBRAS E MANUTENÇÕES LTDA, representada por ${user?.name || ''}, devidamente registrada.</p>
<p><strong>CONTRATANTE:</strong> ${clientName || '________________________________________________'}</p>
<br/>
<h3>CLÁUSULA PRIMEIRA - DO OBJETO</h3>
<p>O presente instrumento tem por objeto a prestação de serviços de engenharia e segurança do trabalho, conforme as Normas Regulamentadoras vigentes.</p>
<br/>
<h3>CLÁUSULA SEGUNDA - DO VALOR</h3>
<p>Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor ajustado de R$ X.XXX,XX.</p>
<br/>
<p>Assinam as partes:</p>
<br/>
<p>___________________________________<br/>CONTRATADA</p>
<p>___________________________________<br/>CONTRATANTE</p>
`)
  }

  const resetForm = () => {
    setClientName('')
    setContentHtml('')
    setEditingId(null)
  }

  const handleEdit = (c: any) => {
    setClientName(c.client_name)
    setContentHtml(c.content_html)
    setEditingId(c.id)
    setActiveTab('editor')
  }

  const handleSave = async () => {
    try {
      const payload = {
        user_id: user.id,
        client_name: clientName,
        content_html: contentHtml,
        status: 'active',
      }

      let record
      if (editingId) {
        record = await pb.collection('contracts').update(editingId, payload)
      } else {
        record = await pb.collection('contracts').create(payload)
      }

      await pb.send(`/backend/v1/documents/contracts/${record.id}/generate-pdf`, { method: 'POST' })

      toast({ title: 'Sucesso', description: 'Contrato salvo no sistema e PDF gerado.' })
      fetchContracts()
      resetForm()
      setActiveTab('list')
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar contrato.', variant: 'destructive' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este contrato?')) return
    await pb.collection('contracts').delete(id)
    fetchContracts()
    toast({ title: 'Excluído', description: 'Contrato removido.' })
  }

  const handleGeneratePdf = async (id: string) => {
    toast({ title: 'Gerando PDF', description: 'Aguarde...' })
    try {
      await pb.send(`/backend/v1/documents/contracts/${id}/generate-pdf`, { method: 'POST' })
      toast({ title: 'Sucesso', description: 'PDF gerado.' })
      fetchContracts()
    } catch {
      toast({ title: 'Erro', description: 'Falha ao gerar.', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Editor de Contratos</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-slate-800">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
          >
            Contratos Salvos
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
            onClick={resetForm}
          >
            {editingId ? 'Editar Contrato' : 'Novo Contrato'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-slate-800/50">
                <TableRow className="border-slate-800">
                  <TableHead className="text-slate-300">Cliente/Contratante</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Data de Criação</TableHead>
                  <TableHead className="text-right text-slate-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-white">{c.client_name}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold uppercase">
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(c.created).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#0f172a] border-slate-800 text-slate-200 w-48"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEdit(c)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Edit className="h-4 w-4 mr-2" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleGeneratePdf(c.id)}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Eye className="h-4 w-4 mr-2" /> Gerar PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedDoc(c)
                              setEmailOpen(true)
                            }}
                            className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                          >
                            <Mail className="h-4 w-4 mr-2" /> Enviar Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-800" />
                          <DropdownMenuItem
                            onClick={() => handleDelete(c.id)}
                            className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-300 focus:bg-red-950 focus:text-red-300"
                          >
                            <Trash className="h-4 w-4 mr-2" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {contracts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                      Nenhum contrato gerado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <div className="bg-[#1e293b] rounded-lg shadow-sm border border-slate-800 p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="flex-1 w-full space-y-2">
                <Label className="text-slate-300">Nome do Cliente ou Empresa Contratante</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <Button
                onClick={loadTemplate}
                variant="outline"
                className="w-full md:w-auto min-h-[44px] border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white bg-transparent"
              >
                Preencher Padrão
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold text-white">Conteúdo do Documento</Label>
              <p className="text-sm text-slate-400 mb-2">
                Utilize o editor rico abaixo para formatar as cláusulas e assinaturas.
              </p>
              <div className="mt-2 min-h-[400px] text-black">
                <RichTextEditor
                  value={contentHtml}
                  onChange={setContentHtml}
                  className="min-h-[400px] bg-white rounded-md"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto bg-[#3498db] text-white hover:bg-[#2980b9] px-8 min-h-[48px] text-lg"
              >
                Salvar e Gerar PDF
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {selectedDoc && (
        <EmailSenderDialog
          open={emailOpen}
          onOpenChange={setEmailOpen}
          documentName={`Contrato - ${selectedDoc.client_name}`}
        />
      )}
    </div>
  )
}
