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

export default function Contracts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<any[]>([])
  const [clientName, setClientName] = useState('')
  const [contentHtml, setContentHtml] = useState('')

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

  const handleSave = async () => {
    try {
      await pb.collection('contracts').create({
        user_id: user.id,
        client_name: clientName,
        content_html: contentHtml,
        status: 'draft',
      })
      toast({ title: 'Sucesso', description: 'Contrato salvo no sistema.' })
      fetchContracts()
      setClientName('')
      setContentHtml('')
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar contrato.', variant: 'destructive' })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Editor de Contratos</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="bg-slate-200">
          <TabsTrigger value="list" className="data-[state=active]:bg-white">
            Contratos Salvos
          </TabsTrigger>
          <TabsTrigger value="editor" className="data-[state=active]:bg-white">
            Novo Contrato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Cliente/Contratante</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Criação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.client_name}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold uppercase">
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(c.created).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
                {contracts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                      Nenhum contrato gerado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-100">
              <div className="flex-1 w-full space-y-2">
                <Label>Nome do Cliente ou Empresa Contratante</Label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="bg-white"
                />
              </div>
              <Button
                onClick={loadTemplate}
                variant="outline"
                className="w-full md:w-auto min-h-[44px] border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white"
              >
                Preencher Padrão
              </Button>
            </div>

            <div className="space-y-2">
              <Label className="text-lg font-semibold">Conteúdo do Documento</Label>
              <p className="text-sm text-slate-500 mb-2">
                Utilize o editor rico abaixo para formatar as cláusulas e assinaturas.
              </p>
              <div className="mt-2 min-h-[400px]">
                <RichTextEditor
                  value={contentHtml}
                  onChange={setContentHtml}
                  className="min-h-[400px]"
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
    </div>
  )
}
