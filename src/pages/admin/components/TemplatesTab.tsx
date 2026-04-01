import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, FileSignature, Receipt, Award } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { addAuditLog } from '@/lib/storage'

export function TemplatesTab() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [isContractOpen, setIsContractOpen] = useState(false)
  const [isBudgetOpen, setIsBudgetOpen] = useState(false)

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault()
    setIsContractOpen(false)
    addAuditLog({ userId: 'Admin', action: 'Gerar Contrato', table: 'Documentos' })
    toast({ title: 'Contrato Gerado', description: 'O modelo de contrato foi criado e arquivado.' })
  }

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBudgetOpen(false)
    addAuditLog({ userId: 'Admin', action: 'Gerar Orçamento', table: 'Documentos' })
    toast({
      title: 'Orçamento Gerado',
      description: 'O modelo de orçamento foi criado e arquivado.',
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <FileSignature className="h-5 w-5 text-primary" /> Geradores de Documentos e NRs
        </h3>
        <p className="text-muted-foreground text-sm">
          Gere certificados profissionais, ordens de serviço (NR-01) e contratos usando templates
          padronizados.
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
              <h4 className="font-bold text-lg text-brand-navy">OS NR-01 (Padrão)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Ordem de Serviço de Segurança e Medicina do Trabalho (Documento).
              </p>
            </div>
            <Button variant="default" className="w-full mt-2 bg-brand-navy text-white">
              Emitir OS (Documento)
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setIsContractOpen(true)}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
              <FileSignature className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Gerador de Contrato</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Crie contratos de prestação de serviços rapidamente.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-2">
              Criar Contrato
            </Button>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate('/admin/template/nr18')}
        >
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">PGR (NR-18)</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Programa de Gerenciamento de Riscos.
              </p>
            </div>
            <Button variant="outline" className="w-full mt-2">
              Emitir NR-18
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isContractOpen} onOpenChange={setIsContractOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Gerar Novo Contrato</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateContract} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente / Contratante</Label>
                <Input required placeholder="Razão Social" />
              </div>
              <div className="space-y-2">
                <Label>CNPJ / CPF</Label>
                <Input required placeholder="00.000.000/0000-00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Objeto do Contrato</Label>
              <Textarea required placeholder="Descreva os serviços..." />
            </div>
            <Button type="submit" className="w-full">
              Gerar PDF
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
