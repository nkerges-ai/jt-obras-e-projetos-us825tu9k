import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { RichTextEditor } from '@/components/RichTextEditor'
import { Printer, Download } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { exportHtmlToWord } from '@/lib/export-utils'

export default function Contracts() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [printDoc, setPrintDoc] = useState<any>(null)
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
    const contratada = user?.company || 'JT OBRAS E MANUTENÇÕES LTDA'
    const cnpj = user?.cnpj || '63.243.791/0001-09'
    const address = user?.address || 'Rua Tommaso Giordani, 371 vila Guacuri – São Paulo - SP'

    setContentHtml(`<h1 style="text-align: center; color: #005A9C;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS TÉCNICOS</h1>
<br/>
<p><strong>CONTRATADA:</strong> ${contratada}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº ${cnpj}, com sede em ${address}, neste ato representada por ${user?.name || 'seu representante legal'}.</p>
<p><strong>CONTRATANTE:</strong> ${clientName || '__________________________________________________________________'}, doravante denominado simplesmente CONTRATANTE.</p>
<br/>
<p>As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes:</p>
<br/>
<h3 style="color: #005A9C;">CLÁUSULA 1ª - DO OBJETO</h3>
<p>O presente instrumento tem por objeto a prestação de serviços técnicos especializados de engenharia, manutenção e segurança do trabalho, em conformidade com as Normas Regulamentadoras vigentes e escopo aprovado em proposta comercial anexa.</p>

<h3 style="color: #005A9C;">CLÁUSULA 2ª - DOS SERVIÇOS E EXECUÇÃO</h3>
<p>A CONTRATADA obriga-se a fornecer mão de obra qualificada, bem como utilizar equipamentos adequados para a perfeita execução dos serviços, zelando sempre pela qualidade e segurança.</p>

<h3 style="color: #005A9C;">CLÁUSULA 3ª - DO PRAZO</h3>
<p>O prazo para a execução dos serviços será estipulado na Ordem de Serviço ou Orçamento aprovado, podendo ser prorrogado mediante aditivo contratual e concordância mútua das partes.</p>

<h3 style="color: #005A9C;">CLÁUSULA 4ª - DO PREÇO E CONDIÇÕES DE PAGAMENTO</h3>
<p>Pelos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA o valor ajustado em proposta comercial, de acordo com o cronograma de desembolso aprovado pelas partes.</p>

<h3 style="color: #005A9C;">CLÁUSULA 5ª - DOS REAJUSTES</h3>
<p>O preço estipulado na Cláusula 4ª será reajustado anualmente pelo índice do IGPM/FGV ou IPCA, em caso de contratos com duração superior a 12 (doze) meses.</p>

<h3 style="color: #005A9C;">CLÁUSULA 6ª - DAS OBRIGAÇÕES DA CONTRATADA</h3>
<p>Constituem obrigações da CONTRATADA: a) Executar os serviços com zelo; b) Fornecer EPIs aos seus funcionários; c) Arcar com todos os encargos trabalhistas e previdenciários de sua equipe.</p>

<h3 style="color: #005A9C;">CLÁUSULA 7ª - DAS OBRIGAÇÕES DA CONTRATANTE</h3>
<p>Constituem obrigações da CONTRATANTE: a) Fornecer as condições e acessos necessários no local da obra; b) Efetuar os pagamentos nas datas aprazadas.</p>

<h3 style="color: #005A9C;">CLÁUSULA 8ª - DA RESPONSABILIDADE CIVIL E TRABALHISTA</h3>
<p>A CONTRATADA assume integral responsabilidade por eventuais danos causados a terceiros ou à CONTRATANTE, desde que comprovadamente decorrentes de imperícia, imprudência ou negligência de seus colaboradores.</p>

<h3 style="color: #005A9C;">CLÁUSULA 9ª - DAS PENALIDADES E MULTAS</h3>
<p>O descumprimento de qualquer cláusula sujeitará o infrator a multa correspondente a 10% (dez por cento) do valor do contrato, sem prejuízo de eventuais perdas e danos.</p>

<h3 style="color: #005A9C;">CLÁUSULA 10ª - DA RESCISÃO</h3>
<p>O presente contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 (trinta) dias, ou imediatamente por justa causa nos termos da lei.</p>

<h3 style="color: #005A9C;">CLÁUSULA 11ª - DA CONFIDENCIALIDADE</h3>
<p>As partes obrigam-se a manter sigilo sobre as informações técnicas e comerciais que venham a ter acesso em virtude deste contrato.</p>

<h3 style="color: #005A9C;">CLÁUSULA 12ª - DA PROTEÇÃO DE DADOS (LGPD)</h3>
<p>As partes comprometem-se a observar as diretrizes da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), tratando os dados pessoais unicamente para a finalidade de execução deste contrato.</p>

<h3 style="color: #005A9C;">CLÁUSULA 13ª - DO FORO</h3>
<p>Fica eleito o foro da comarca da sede da CONTRATADA para dirimir quaisquer dúvidas oriundas do presente contrato, com renúncia a qualquer outro por mais privilegiado que seja.</p>
<br/>
<p>E, por estarem assim justos e contratados, firmam o presente instrumento em 02 (duas) vias de igual teor e forma.</p>
<br/>
<p>Data: _____/_____/_______</p>
<br/><br/>
<table style="width: 100%; text-align: center; margin-top: 40px; border: none;">
  <tr>
    <td style="width: 50%; border: none;">
      ___________________________________<br/>
      <strong>${contratada}</strong><br/>
      CONTRATADA
    </td>
    <td style="width: 50%; border: none;">
      ___________________________________<br/>
      <strong>${clientName || 'CONTRATANTE'}</strong><br/>
      CONTRATANTE
    </td>
  </tr>
</table>
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
        <TabsList className="grid w-full grid-cols-2 bg-slate-200 p-1">
          <TabsTrigger
            value="list"
            className="data-[state=active]:bg-white text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-xs sm:text-sm font-medium"
          >
            Contratos Salvos
          </TabsTrigger>
          <TabsTrigger
            value="editor"
            className="data-[state=active]:bg-white text-slate-600 data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-xs sm:text-sm font-medium"
          >
            Novo Contrato
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border w-full overflow-hidden">
            <div className="overflow-x-auto w-full">
              <Table className="w-full min-w-[600px] md:min-w-full">
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Cliente/Contratante</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
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
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {c.pdf_url ? (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="h-8 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              <a
                                href={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${c.collectionId}/${c.id}/${c.pdf_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="h-3.5 w-3.5" /> PDF
                              </a>
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 border-green-200 text-green-700 hover:bg-green-50"
                              onClick={async () => {
                                try {
                                  await pb
                                    .collection('contracts')
                                    .update(c.id, { status: 'active' })
                                  fetchContracts()
                                  toast({
                                    title: 'Contrato Ativado',
                                    description:
                                      'O contrato foi finalizado e aguarda geração do PDF.',
                                  })
                                } catch (e) {
                                  toast({
                                    title: 'Erro',
                                    description: 'Falha ao ativar contrato.',
                                    variant: 'destructive',
                                  })
                                }
                              }}
                            >
                              Finalizar
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-700 hover:text-[#3498db] hover:bg-blue-50"
                            onClick={() => setPrintDoc(c)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
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

            <div className="pt-4 flex justify-end w-full">
              <Button
                onClick={handleSave}
                className="w-full sm:w-auto bg-[#3498db] text-white hover:bg-[#2980b9] px-8 min-h-[48px] text-lg shrink-0"
              >
                Salvar e Gerar PDF
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Print View Overlay */}
      {printDoc && (
        <div className="fixed inset-0 bg-black/60 z-[100] overflow-y-auto print:bg-white print:overflow-visible">
          <div className="min-h-screen py-8 px-4 print:p-0 print:m-0 flex flex-col items-center">
            <div className="bg-white p-4 w-full max-w-[210mm] flex justify-between items-center rounded-t-lg print:hidden shrink-0 shadow-lg">
              <h2 className="font-bold text-lg">Visualização do Contrato</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const el = document.getElementById('contract-print-area')
                    if (el) exportHtmlToWord(el.innerHTML, `Contrato_${printDoc.client_name}`)
                  }}
                >
                  <Download className="h-4 w-4 mr-2" /> Exportar Word
                </Button>
                <Button onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Imprimir PDF
                </Button>
                <Button variant="ghost" onClick={() => setPrintDoc(null)}>
                  Fechar
                </Button>
              </div>
            </div>

            <div id="contract-print-area" className="w-full flex justify-center">
              <DocumentLetterhead
                title="CONTRATO DE PRESTAÇÃO DE SERVIÇOS"
                subtitle={`Cliente: ${printDoc.client_name}`}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: printDoc.content_html }}
                  className="prose max-w-none text-justify text-[13px] leading-relaxed"
                />
              </DocumentLetterhead>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
