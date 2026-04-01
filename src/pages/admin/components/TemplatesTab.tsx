import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, FileSignature, Receipt } from 'lucide-react'
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
    toast({ title: 'Orçamento Gerado', description: 'O modelo de orçamento foi criado e arquivado.' })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <FileSignature className="h-5 w-5 text-primary" /> Geradores de Documentos e NRs
        </h3>
        <p className="text-muted-foreground text-sm">
          Gere contratos, orçamentos e formulários de Normas Regulamentadoras automaticamente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsContractOpen(true)}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <FileSignature className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Gerador de Contrato</h4>
              <p className="text-sm text-muted-foreground mt-1">Crie contratos de prestação de serviços com cláusulas padrão.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Criar Contrato</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setIsBudgetOpen(true)}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <Receipt className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">Gerador de Orçamento</h4>
              <p className="text-sm text-muted-foreground mt-1">Crie propostas comerciais detalhadas com itens e valores.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Criar Orçamento</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/template/os-nr01')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">OS NR-01</h4>
              <p className="text-sm text-muted-foreground mt-1">Ordem de Serviço baseada na NR-01.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Emitir OS</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/template/nr18')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">PGR (NR-18)</h4>
              <p className="text-sm text-muted-foreground mt-1">Programa de Gerenciamento de Riscos.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Emitir NR-18</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/template/nr35')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">NR-35</h4>
              <p className="text-sm text-muted-foreground mt-1">Permissão de Trabalho em Altura.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Emitir NR-35</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/template/nr10')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">NR-10</h4>
              <p className="text-sm text-muted-foreground mt-1">Trabalhos com Eletricidade.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Emitir NR-10</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin/template/nr06')}>
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-16 w-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8" />
            </div>
            <div>
              <h4 className="font-bold text-lg text-brand-navy">NR-06</h4>
              <p className="text-sm text-muted-foreground mt-1">Controle de Equipamentos de Proteção.</p>
            </div>
            <Button variant="outline" className="w-full mt-2">Emitir NR-06</Button>
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
              <Textarea required placeholder="Descreva os serviços a serem prestados..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valor Total (R$)</Label>
                <Input required type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Prazo de Execução (Dias)</Label>
                <Input required type="number" />
              </div>
            </div>
            <Button type="submit" className="w-full">Gerar PDF</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isBudgetOpen} onOpenChange={setIsBudgetOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Gerar Orçamento (Proposta Comercial)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBudget} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input required placeholder="Nome do cliente" />
            </div>
            <div className="border p-4 rounded bg-gray-50 space-y-4">
              <Label className="font-bold">Itens do Orçamento</Label>
              <div className="grid grid-cols-12 gap-2 text-xs font-bold text-gray-500">
                <div className="col-span-6">Descrição</div>
                <div className="col-span-2">Qtd</div>
                <div className="col-span-2">Valor Unit.</div>
                <div className="col-span-2">Subtotal</div>
              </div>
              <div className="grid grid-cols-12 gap-2 items-center">
                <Input className="col-span-6 h-8 text-sm" placeholder="Item 1" />
                <Input className="col-span-2 h-8 text-sm" type="number" defaultValue="1" />
                <Input className="col-span-2 h-8 text-sm" type="number" placeholder="R$" />
                <Input className="col-span-2 h-8 text-sm bg-gray-100" readOnly placeholder="R$" />
              </div>
              <Button type="button" variant="outline" size="sm"><Plus className="h-4 w-4 mr-2"/> Add Item</Button>
            </div>
            <Button type="submit" className="w-full">Gerar Orçamento em PDF</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
