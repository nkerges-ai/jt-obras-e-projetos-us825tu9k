import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, FileStack } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAuditLog, getTechnicalDocuments, saveTechnicalDocuments } from '@/lib/storage'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { RichTextEditor } from '@/components/RichTextEditor'

export default function LetterheadEditor() {
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState({
    title: 'COMUNICADO OFICIAL',
    content: '<p>Digite o conteúdo do seu documento oficial aqui.</p>',
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
      id: id || `timbrado_${Date.now()}`,
      name: `${data.title || 'Documento'}.pdf`,
      category: 'Documento Geral',
      uploadDate: new Date().toISOString(),
      projectId: 'global',
      isRestricted: false,
      url: 'data:application/pdf;base64,dummy',
      type: 'timbrado' as const,
      data: data,
    }

    if (id) {
      saveTechnicalDocuments(docs.map((d) => (d.id === id ? newDoc : d)))
    } else {
      saveTechnicalDocuments([newDoc, ...docs])
    }

    addAuditLog({
      userId: 'Admin',
      action: id ? 'Editar Documento Timbrado' : 'Gerar Documento Timbrado',
      table: 'Documentos',
      newData: JSON.stringify(data),
    })
    toast({ title: 'Salvo no Acervo', description: 'Documento salvo com sucesso.' })
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
              <FileStack className="h-5 w-5" /> Documento Timbrado Livre
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
          <h2 className="font-bold mb-4 text-brand-navy border-b pb-2">Informações do Documento</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Título / Assunto</Label>
              <Input
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>Conteúdo do Documento</Label>
              <RichTextEditor
                value={data.content}
                onChange={(val) => setData({ ...data, content: val })}
                className="min-h-[250px]"
              />
            </div>

            <div className="space-y-1 pt-4">
              <Label>Data</Label>
              <Input
                value={data.date}
                onChange={(e) => setData({ ...data, date: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center pb-12 print:pb-0">
          <DocumentLetterhead title={data.title}>
            <div className="space-y-6 text-justify min-h-[500px] flex flex-col">
              <div
                className="prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />

              <div className="mt-auto pt-16 flex flex-col items-center">
                <p className="mb-12">São Paulo, {data.date}.</p>
                <div className="w-64 border-t border-black mb-2"></div>
                <p className="font-bold text-brand-navy">JT OBRAS E MANUTENÇÕES LTDA</p>
              </div>
            </div>
          </DocumentLetterhead>
        </div>
      </div>
    </div>
  )
}
