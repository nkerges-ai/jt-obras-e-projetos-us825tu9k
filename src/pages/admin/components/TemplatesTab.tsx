import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  FileSignature,
  Calculator,
  ClipboardCheck,
  GraduationCap,
  ShieldAlert,
  FileText,
} from 'lucide-react'

export function TemplatesTab() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-brand-navy border-b pb-3">
          Documentos Comerciais e Gerais
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="hover:shadow-lg transition-all border-brand-light/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-brand-light/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-brand-light">
                <FileSignature className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl text-brand-navy">Novo Contrato</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Gere um contrato de prestação de serviços completo com folha timbrada, pronto para
                assinatura digital e envio.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                asChild
                className="w-full h-12 text-base font-bold bg-brand-navy hover:bg-brand-navy/90"
              >
                <Link to="/admin/template/contrato">Preencher Contrato</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-brand-light/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-brand-light/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-brand-light">
                <Calculator className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl text-brand-navy">Novo Orçamento</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Crie uma proposta comercial formal para apresentar aos seus clientes, formatada com
                sua identidade visual.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                asChild
                className="w-full h-12 text-base font-bold bg-brand-navy hover:bg-brand-navy/90"
              >
                <Link to="/admin/template/orcamento">Preencher Orçamento</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-brand-light/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-brand-light/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-brand-light">
                <FileText className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl text-brand-navy">
                Papel Timbrado (Em Branco)
              </CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Matriz limpa com o cabeçalho e rodapé oficiais da empresa, ideal para comunicados,
                cartas e relatórios livres.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                asChild
                className="w-full h-12 text-base font-bold bg-brand-light hover:bg-brand-light/90"
              >
                <Link to="/admin/template/timbrado">Criar Documento Livre</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-brand-navy border-b pb-3">
          Gerenciamento de Riscos e NRs
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="hover:shadow-lg transition-all border-brand-light/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-brand-light/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-brand-light">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl text-brand-navy">
                Programa de Riscos (PGR)
              </CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Módulo completo para gerenciar o PGR (NR-01) com sincronização automática para as
                Ordens de Serviço.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                asChild
                className="w-full h-12 text-base font-bold bg-brand-navy hover:bg-brand-navy/90"
              >
                <Link to="/admin/acervo/pgr">Criar/Editar PGR</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-brand-light/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-brand-light/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-brand-light">
                <ClipboardCheck className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl text-brand-navy">
                OS NR-01 (Avançada)
              </CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Formulário completo de Ordem de Serviço com checklist de EPIs e EPCs, sincronizado
                com o PGR.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                asChild
                className="w-full h-12 text-base font-bold bg-brand-navy hover:bg-brand-navy/90"
              >
                <Link to="/admin/template/os-nr01">Acessar OS Avançada</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-brand-light/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-brand-light/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-brand-light">
                <GraduationCap className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl text-brand-navy">
                Certificados (NRs)
              </CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Gere certificados para treinamentos de normas regulamentadoras com lista de presença
                e fotos.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto grid grid-cols-2 gap-2">
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold h-10 border-brand-navy text-brand-navy"
              >
                <Link to="/admin/acervo/template/nr35">NR-35 (Altura)</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold h-10 border-brand-navy text-brand-navy"
              >
                <Link to="/admin/acervo/template/nr10">NR-10 (Elétrica)</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold h-10 border-brand-navy text-brand-navy"
              >
                <Link to="/admin/acervo/template/nr06">NR-06 (EPI)</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full text-xs font-bold h-10 border-brand-navy text-brand-navy"
              >
                <Link to="/admin/acervo/template/nr18">NR-18 (Civil)</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
