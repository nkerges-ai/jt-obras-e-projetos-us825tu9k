import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, FileSignature, Receipt, Award, FileStack } from 'lucide-react'

export function TemplatesTab() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <FileSignature className="h-5 w-5 text-primary" /> Geradores de Documentos e NRs
        </h3>
        <p className="text-muted-foreground text-sm">
          Gere certificados profissionais, ordens de serviço (NR-01), contratos, orçamentos e papéis
          timbrados com persistência de dados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer border-brand-light/30"
          onClick={() => navigate('/admin/template/certificado')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-blue-50 text-brand-light rounded-full flex items-center justify-center">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Gerador de Certificado</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Template dinâmico para certificados de treinamentos (NR-35, etc).
              </p>
            </div>
            <Button variant="default" className="w-full mt-2 bg-brand-light text-white">
              Criar Certificado
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer border-brand-navy/30"
          onClick={() => navigate('/admin/template/os-nr01')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-blue-50 text-brand-navy rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Ordem de Serviço (NR-01)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ordem de Serviço de Segurança e Medicina do Trabalho.
              </p>
            </div>
            <Button variant="default" className="w-full mt-2 bg-brand-navy text-white">
              Emitir OS
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/template/contrato')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
              <FileSignature className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Contrato de Serviço</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Crie contratos de prestação de serviços com persistência.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-2">
              Criar Contrato
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/template/orcamento')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <Receipt className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Orçamentos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Gere propostas financeiras detalhadas para clientes.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-2 text-green-700 border-green-200 hover:bg-green-50"
            >
              Criar Orçamento
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/template/nr18')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Certificado da Construção Civil</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Certificação baseada na NR-18 para a Construção Civil.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-2 text-orange-700 border-orange-200 hover:bg-orange-50"
            >
              Emitir NR-18
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/template/timbrado')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <FileStack className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Papel Timbrado em Branco</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Documento livre com o cabeçalho oficial da empresa.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-2 text-purple-700 border-purple-200 hover:bg-purple-50"
            >
              Gerar Timbrado
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
