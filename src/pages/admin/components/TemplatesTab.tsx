import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileSignature, Calculator, ClipboardCheck, GraduationCap } from 'lucide-react'

export function TemplatesTab() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-2xl font-bold mb-6 text-brand-navy border-b pb-3">
          Documentos Comerciais
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                <FileSignature className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl">Novo Contrato</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Gere um contrato de prestação de serviços completo com folha timbrada, pronto para
                assinatura digital e envio.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full h-12 text-base font-bold">
                <Link to="/admin/template/contrato">Preencher Contrato</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                <Calculator className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl">Novo Orçamento</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Crie uma proposta comercial formal para apresentar aos seus clientes, formatada com
                sua identidade visual.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full h-12 text-base font-bold">
                <Link to="/admin/template/orcamento">Preencher Orçamento</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6 text-brand-navy border-b pb-3">
          Gerar Documentos NR e Técnicos
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                <ClipboardCheck className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl">OS NR-01 (Simples)</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Documento rápido de Ordem de Serviço com declarações legais, campos para riscos e
                medidas de controle em conformidade com as NRs.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full h-12 text-base font-bold">
                <Link to="/admin/acervo/template/osnr01">Gerar OS Simples</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl">Certificado de Treinamento</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Gere certificados de integração e treinamentos de Segurança do Trabalho para validar
                o engajamento da sua equipe.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild className="w-full h-12 text-base font-bold">
                <Link to="/admin/acervo/template/treinamento">Gerar Certificado</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
            <CardHeader>
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
                <ClipboardCheck className="h-7 w-7" />
              </div>
              <CardTitle className="text-xl lg:text-2xl">OS NR-01 (Avançada)</CardTitle>
              <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
                Formulário completo de Ordem de Serviço com checklist de dezenas de EPIs e EPCs,
                voltado para obras maiores.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild variant="secondary" className="w-full h-12 text-base font-bold">
                <Link to="/admin/template/os-nr01">Acessar OS Avançada</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
