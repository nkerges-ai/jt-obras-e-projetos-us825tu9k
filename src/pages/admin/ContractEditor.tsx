import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, FileSignature } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { addAuditLog, getTechnicalDocuments, saveTechnicalDocuments } from '@/lib/storage'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'

export default function ContractEditor() {
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState({
    clientName: '',
    clientDocument: '',
    clientAddress: '',
    contractObject: '',
    contractValue: '',
    contractConditions:
      'O pagamento será realizado em 2 parcelas, sendo 50% no início e 50% na entrega.',
    date: new Date().toLocaleDateString('pt-BR'),
  })

  useEffect(() => {
    if (id) {
      const docs = getTechnicalDocuments()
      const doc = docs.find((d) => d.id === id)
      if (doc && doc.data) {
        setData(doc.data)
      }
    }
  }, [id])

  const handleSave = () => {
    const docs = getTechnicalDocuments()
    const newDoc = {
      id: id || `contrato_${Date.now()}`,
      name: `Contrato_${data.clientName || 'Cliente'}.pdf`,
      category: 'Contrato',
      uploadDate: new Date().toISOString(),
      projectId: 'global',
      isRestricted: false,
      url: 'data:application/pdf;base64,dummy',
      type: 'contrato' as const,
      data: data,
    }

    if (id) {
      saveTechnicalDocuments(docs.map((d) => (d.id === id ? newDoc : d)))
    } else {
      saveTechnicalDocuments([newDoc, ...docs])
    }

    addAuditLog({
      userId: 'Admin',
      action: id ? 'Editar Contrato' : 'Gerar Contrato',
      table: 'Documentos',
      newData: JSON.stringify(data),
    })
    toast({ title: 'Salvo no Acervo', description: 'Contrato salvo com sucesso.' })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate flex items-center gap-2">
              <FileSignature className="h-5 w-5" /> Editor de Contrato
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Salvar Acervo
            </Button>
            <Button onClick={() => window.print()} size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir (PDF)
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 print:p-0 flex flex-col xl:flex-row items-start gap-8 mt-6 print:m-0">
        <div className="w-full xl:w-[450px] shrink-0 bg-white p-6 rounded-xl border shadow-sm print:hidden">
          <h2 className="font-bold mb-4 text-brand-navy border-b pb-2">Dados do Contrato</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Nome do Cliente / Contratante</Label>
              <Input
                value={data.clientName}
                onChange={(e) => setData({ ...data, clientName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>CNPJ / CPF</Label>
              <Input
                value={data.clientDocument}
                onChange={(e) => setData({ ...data, clientDocument: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Endereço Completo</Label>
              <Input
                value={data.clientAddress}
                onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Objeto do Contrato</Label>
              <Textarea
                value={data.contractObject}
                onChange={(e) => setData({ ...data, contractObject: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-1">
              <Label>Valor Acordado (R$)</Label>
              <Input
                value={data.contractValue}
                onChange={(e) => setData({ ...data, contractValue: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Condições de Pagamento</Label>
              <Textarea
                value={data.contractConditions}
                onChange={(e) => setData({ ...data, contractConditions: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-1">
              <Label>Data do Contrato</Label>
              <Input
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center pb-12 print:pb-0">
          <DocumentLetterhead title="CONTRATO DE PRESTAÇÃO DE SERVIÇOS">
            <div className="space-y-6 text-justify">
              <p>
                Pelo presente instrumento particular de prestação de serviços, de um lado{' '}
                <strong>JT OBRAS E MANUTENÇÕES LTDA</strong>, inscrita no CNPJ sob o nº
                63.243.791/0001-09, doravante denominada <strong>CONTRATADA</strong>, e de outro
                lado <strong>{data.clientName || '_________________________________'}</strong>,
                inscrito no CNPJ/CPF sob o nº{' '}
                <strong>{data.clientDocument || '___________________'}</strong>,
                residente/sediado(a) em{' '}
                <strong>{data.clientAddress || '_________________________________'}</strong>,
                doravante denominado <strong>CONTRATANTE</strong>.
              </p>

              <h4 className="font-bold uppercase pt-4">Cláusula 1ª - Do Objeto</h4>
              <p>
                O presente contrato tem por objeto a prestação de serviços de: <br />
                {data.contractObject ||
                  '__________________________________________________________________________________'}
              </p>

              <h4 className="font-bold uppercase pt-4">
                Cláusula 2ª - Do Valor e Forma de Pagamento
              </h4>
              <p>
                Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor total de{' '}
                <strong>R$ {data.contractValue || '________'}</strong>.
                <br />
                Condições: {data.contractConditions}
              </p>

              <h4 className="font-bold uppercase pt-4">Cláusula 3ª - Das Obrigações</h4>
              <p>
                A CONTRATADA obriga-se a fornecer os serviços com qualidade e cumprir com as Normas
                Regulamentadoras vigentes (NR-01, NR-18, NR-35).
              </p>

              <div className="pt-12 text-center">
                <p>São Paulo, {data.date}.</p>

                <div className="flex justify-between mt-16 px-10">
                  <div className="flex flex-col items-center w-64">
                    <div className="w-full border-t border-black mb-2"></div>
                    <p className="font-bold">JT OBRAS E MANUTENÇÕES LTDA</p>
                    <p className="text-xs">Contratada</p>
                  </div>
                  <div className="flex flex-col items-center w-64">
                    <div className="w-full border-t border-black mb-2"></div>
                    <p className="font-bold">{data.clientName || 'CONTRATANTE'}</p>
                    <p className="text-xs">Contratante</p>
                  </div>
                </div>
              </div>
            </div>
          </DocumentLetterhead>
        </div>
      </div>
    </div>
  )
}
