import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function TemplateEditor() {
  const { type } = useParams()
  const { toast } = useToast()

  const getTitle = () => {
    switch(type) {
      case 'nr06': return 'Controle de EPI (NR-06)'
      case 'nr10': return 'Trabalhos com Eletricidade (NR-10)'
      case 'nr18': return 'Segurança na Indústria da Construção (NR-18)'
      case 'nr35': return 'Permissão de Trabalho em Altura (NR-35)'
      default: return `Formulário ${type?.toUpperCase()}`
    }
  }

  const handleSave = () => {
    toast({ title: 'Salvo com sucesso', description: 'O formulário foi arquivado na base de dados.' })
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
            <h1 className="font-bold text-lg text-brand-navy truncate hidden sm:block">
              {getTitle()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Salvar
            </Button>
            <Button onClick={() => window.print()} size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir / PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 print:p-0">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border print:border-none print:shadow-none min-h-[800px]">
          <div className="text-center border-b pb-6 mb-8">
            <h2 className="text-2xl font-extrabold text-brand-navy uppercase">{getTitle()}</h2>
            <p className="text-sm text-gray-500 mt-2">Documento Oficial em Conformidade com o Ministério do Trabalho</p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3 print:hidden">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <p className="text-sm text-blue-900">
                Este modelo está pré-configurado com os requisitos legais da norma. 
                Preencha os campos em branco antes de gerar a versão final para assinatura.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Empresa Executante</label>
                <input type="text" className="w-full border rounded-md p-2 h-10" defaultValue="JT Obras e Projetos" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">CNPJ</label>
                <input type="text" className="w-full border rounded-md p-2 h-10" defaultValue="63.243.791/0001-09" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold">Responsável Técnico</label>
              <input type="text" className="w-full border rounded-md p-2 h-10" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold">Checklist de Medidas de Segurança ({type?.toUpperCase()})</label>
              <textarea className="w-full border rounded-md p-3 min-h-[200px]" defaultValue={`1. Avaliação prévia do local de trabalho.\n2. Isolamento e sinalização da área.\n3. Verificação das condições dos EPIs.\n4. Autorização expressa do supervisor.`}></textarea>
            </div>
            
            <div className="pt-16 mt-16 border-t flex justify-between px-12">
              <div className="text-center w-64">
                <div className="border-b border-black mb-2"></div>
                <p className="text-sm font-bold">Assinatura do Responsável</p>
              </div>
              <div className="text-center w-64">
                <div className="border-b border-black mb-2"></div>
                <p className="text-sm font-bold">Assinatura do Colaborador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
