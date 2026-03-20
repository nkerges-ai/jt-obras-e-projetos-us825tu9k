import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileSignature, Calculator, ClipboardCheck } from 'lucide-react'

export function TemplatesTab() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
        <CardHeader>
          <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
            <FileSignature className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl lg:text-2xl">Novo Contrato</CardTitle>
          <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
            Gere um contrato de prestação de serviços completo com folha timbrada, pronto para
            assinatura digital e envio automatizado.
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
            Crie uma proposta comercial formal para apresentar aos seus clientes, formatada com a
            identidade visual da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <Button asChild className="w-full h-12 text-base font-bold">
            <Link to="/admin/template/orcamento">Preencher Orçamento</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all border-primary/20 bg-white flex flex-col">
        <CardHeader>
          <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
            <ClipboardCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-xl lg:text-2xl">Ordem de Serviço (OS)</CardTitle>
          <CardDescription className="text-sm lg:text-base mt-2 leading-relaxed">
            Gere a OS NR01 com as normas de segurança para prestadores de serviço, incluindo EPIs,
            EPCs e termo de ciência.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-auto">
          <Button asChild className="w-full h-12 text-base font-bold">
            <Link to="/admin/template/os-nr01">Criar OS (NR01)</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
