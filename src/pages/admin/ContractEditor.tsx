import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, FileSignature } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { SignatureInput } from '@/components/SignatureInput'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'

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
    clientSignature: '',
  })

  const [errors, setErrors] = useState<{ client?: string }>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (id) {
      pb.collection('contracts')
        .getOne(id)
        .then((doc) => {
          setData((prev) => ({
            ...prev,
            clientName: doc.client_name || '',
            clientDocument: doc.collaborator_cpf || '',
            contractObject: doc.content_html.replace(/<[^>]*>?/gm, '') || prev.contractObject,
            date: new Date(doc.created).toLocaleDateString('pt-BR'),
          }))
        })
        .catch(() => {
          // ignore
        })
    }
  }, [id])

  const handleSave = async () => {
    if (!data.clientName) {
      setErrors({ client: 'Nome do cliente é obrigatório' })
      toast({
        title: 'Atenção',
        description: 'Preencha o Nome do Cliente',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    try {
      if (!pb.authStore.record) {
        await pb.collection('users').authWithPassword('admin@jtobras.com.br', 'JOELTATIANA')
      }

      const payload = {
        user_id: pb.authStore.record?.id,
        client_name: data.clientName,
        content_html: `<p><strong>Objeto:</strong> ${data.contractObject}</p><p><strong>Condições:</strong> ${data.contractConditions}</p>`,
        status: 'active',
        collaborator_cpf: data.clientDocument,
      }

      if (id) {
        await pb.collection('contracts').update(id, payload)
      } else {
        await pb.collection('contracts').create(payload)
      }
      toast({ title: 'Salvo no Acervo', description: 'Contrato salvo com sucesso no PocketBase.' })
    } catch (err) {
      toast({ title: 'Erro ao salvar', description: getErrorMessage(err), variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-28 print:bg-white print:pb-0">
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" /> {isSaving ? 'Salvando...' : 'Salvar Acervo'}
            </Button>
            <Button onClick={() => window.print()} size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir (PDF)
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 print:p-0 flex flex-col xl:flex-row items-start gap-8 mt-6 print:m-0">
        <div className="w-full xl:w-[480px] shrink-0 bg-white p-6 rounded-xl border shadow-sm print:hidden h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          <h2 className="font-bold mb-4 text-brand-navy border-b pb-2 sticky top-0 bg-white z-10">
            Dados do Contrato
          </h2>
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label>Nome do Cliente / Contratante</Label>
              <Input
                value={data.clientName}
                onChange={(e) => {
                  setData({ ...data, clientName: e.target.value })
                  setErrors({ ...errors, client: '' })
                }}
                className={errors.client ? 'border-red-500' : ''}
              />
              {errors.client && <p className="text-xs text-red-500">{errors.client}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>CNPJ / CPF</Label>
              <Input
                value={data.clientDocument}
                onChange={(e) => setData({ ...data, clientDocument: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Endereço Completo</Label>
              <Input
                value={data.clientAddress}
                onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Objeto do Contrato</Label>
              <Textarea
                value={data.contractObject}
                onChange={(e) => setData({ ...data, contractObject: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Valor Acordado (R$)</Label>
              <Input
                value={data.contractValue}
                onChange={(e) => setData({ ...data, contractValue: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Condições de Pagamento</Label>
              <Textarea
                value={data.contractConditions}
                onChange={(e) => setData({ ...data, contractConditions: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data do Contrato</Label>
              <Input
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t space-y-3">
              <Label className="font-bold text-gray-800 text-lg">Assinatura do Cliente</Label>
              <p className="text-sm text-gray-500 mb-2">
                Colete a assinatura do cliente pelo dispositivo para emitir o contrato já assinado.
              </p>
              <SignatureInput
                value={data.clientSignature}
                onChange={(val) => setData({ ...data, clientSignature: val })}
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

              <h4 className="font-bold uppercase pt-4 text-brand-navy">Cláusula 1ª - Do Objeto</h4>
              <p className="pl-4">
                O presente contrato tem por objeto a prestação de serviços de: <br />
                <span className="font-medium text-gray-800 mt-2 block whitespace-pre-wrap">
                  {data.contractObject ||
                    '__________________________________________________________________________________'}
                </span>
              </p>

              <h4 className="font-bold uppercase pt-4 text-brand-navy">
                Cláusula 2ª - Do Valor e Forma de Pagamento
              </h4>
              <p className="pl-4">
                Pelos serviços prestados, a CONTRATANTE pagará à CONTRATADA o valor total de{' '}
                <strong>R$ {data.contractValue || '________'}</strong>.
                <br />
                <br />
                <strong>Condições:</strong> <br />
                <span className="text-gray-800">{data.contractConditions}</span>
              </p>

              <h4 className="font-bold uppercase pt-4 text-brand-navy">
                Cláusula 3ª - Das Obrigações
              </h4>
              <p className="pl-4">
                A CONTRATADA obriga-se a fornecer os serviços com qualidade e cumprir com as Normas
                Regulamentadoras vigentes (NR-01, NR-18, NR-35).
              </p>

              <div className="pt-24 text-center">
                <p>São Paulo, {data.date}.</p>

                <div className="flex flex-col sm:flex-row justify-center gap-16 mt-20 px-10">
                  <div className="flex flex-col items-center w-64 relative">
                    <div className="w-full border-t border-black mb-2"></div>
                    <p className="font-bold uppercase text-sm">JT OBRAS E MANUTENÇÕES LTDA</p>
                    <p className="text-xs text-gray-600">Contratada</p>
                  </div>
                  <div className="flex flex-col items-center w-64 relative">
                    {data.clientSignature && (
                      <img
                        src={data.clientSignature}
                        className="absolute -top-14 h-16 max-w-[240px] mix-blend-multiply print:mix-blend-normal z-10"
                        alt="Assinatura"
                      />
                    )}
                    <div className="w-full border-t border-black mb-2 relative z-0"></div>
                    <p className="font-bold uppercase text-sm">
                      {data.clientName || 'CONTRATANTE'}
                    </p>
                    <p className="text-xs text-gray-600">Contratante</p>
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
