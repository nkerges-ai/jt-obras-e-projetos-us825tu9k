import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileSignature, Calculator } from 'lucide-react'

export function TemplatesTab() {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className="hover:shadow-lg transition-all border-primary/20 bg-white">
        <CardHeader>
          <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
            <FileSignature className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">Novo Contrato</CardTitle>
          <CardDescription className="text-base mt-2 leading-relaxed">
            Gere um contrato de prestação de serviços completo com folha timbrada, pronto para
            assinatura digital, impressão ou envio automatizado via WhatsApp ou E-mail.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full h-12 text-lg font-bold">
            <Link to="/admin/template/contrato">Preencher Contrato</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-all border-primary/20 bg-white">
        <CardHeader>
          <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-primary">
            <Calculator className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">Novo Orçamento</CardTitle>
          <CardDescription className="text-base mt-2 leading-relaxed">
            Crie uma proposta comercial formal para apresentar aos seus clientes, formatada com a
            identidade visual da empresa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full h-12 text-lg font-bold">
            <Link to="/admin/template/orcamento">Preencher Orçamento</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
