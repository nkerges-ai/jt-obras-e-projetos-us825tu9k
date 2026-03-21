import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ShieldAlert, Plus, BellRing, CheckCircle, Clock } from 'lucide-react'
import { getValidityDocs, saveValidityDocs, ValidityDocument, addLog } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

export function ValidityAlertsTab() {
  const { toast } = useToast()
  const [docs, setDocs] = useState<ValidityDocument[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newDoc, setNewDoc] = useState<Partial<ValidityDocument>>({
    name: '',
    category: 'ART',
    expirationDate: '',
    warningDays: 30,
  })

  useEffect(() => {
    setDocs(getValidityDocs())
  }, [])

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDoc.name || !newDoc.expirationDate) return

    const doc: ValidityDocument = {
      id: `val_${Date.now()}`,
      name: newDoc.name,
      category: newDoc.category || 'Outros',
      expirationDate: newDoc.expirationDate,
      warningDays: Number(newDoc.warningDays) || 30,
    }

    const updated = [...docs, doc]
    setDocs(updated)
    saveValidityDocs(updated)
    setIsDialogOpen(false)
    setNewDoc({ name: '', category: 'ART', expirationDate: '', warningDays: 30 })
    toast({ title: 'Documento Adicionado', description: 'Monitoramento de validade ativado.' })
  }

  const handleCheckAlerts = () => {
    let alertedCount = 0
    const today = new Date()

    docs.forEach((doc) => {
      const expDate = new Date(doc.expirationDate)
      const diffTime = expDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= doc.warningDays && diffDays >= 0) {
        addLog({
          type: 'WhatsApp',
          recipient: 'Joel Nascimento (Gestor)',
          message: `ALERTA VENCIMENTO: O documento "${doc.name}" (${doc.category}) vencerá em ${diffDays} dias!`,
          status: 'Enviado',
        })
        alertedCount++
      } else if (diffDays < 0) {
        addLog({
          type: 'Email',
          recipient: 'jt.obrasemanutencao@gmail.com',
          message: `ALERTA CRÍTICO: O documento "${doc.name}" está VENCIDO há ${Math.abs(diffDays)} dias.`,
          status: 'Enviado',
        })
        alertedCount++
      }
    })

    if (alertedCount > 0) {
      toast({
        title: 'Notificações Disparadas',
        description: `${alertedCount} alertas foram enviados com sucesso.`,
      })
    } else {
      toast({
        title: 'Tudo em dia',
        description: 'Nenhum documento crítico no momento.',
        variant: 'default',
      })
    }
  }

  const getStatus = (doc: ValidityDocument) => {
    const exp = new Date(doc.expirationDate)
    const diff = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

    if (diff < 0) return { label: 'Expirado', color: 'bg-red-100 text-red-800 border-red-200' }
    if (diff <= doc.warningDays)
      return {
        label: 'Vencendo em breve',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
      }
    return { label: 'Válido', color: 'bg-green-100 text-green-800 border-green-200' }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" /> Alertas de Validade
          </h3>
          <p className="text-muted-foreground text-sm">
            Monitore o vencimento de ARTs, PGRs, AVCB e laudos técnicos.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleCheckAlerts}
            className="gap-2 w-full sm:w-auto text-orange-600 border-orange-200 hover:bg-orange-50"
          >
            <BellRing className="h-4 w-4" /> Verificar Alertas
          </Button>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="gap-2 font-bold w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Documento Monitorado</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead>Alerta (Dias)</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum documento sendo monitorado.
                </TableCell>
              </TableRow>
            )}
            {docs.map((doc) => {
              const status = getStatus(doc)
              return (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal text-xs">
                      {doc.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    {new Date(doc.expirationDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.warningDays} dias</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Monitorar Novo Documento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDoc} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Documento / Identificação</Label>
              <Input
                required
                value={newDoc.name}
                onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                placeholder="Ex: ART - Estrutura Metálica"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={newDoc.category}
                onValueChange={(v) => setNewDoc({ ...newDoc, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ART">ART (Engenharia)</SelectItem>
                  <SelectItem value="PGR">PGR (NR-01)</SelectItem>
                  <SelectItem value="AVCB">AVCB / Bombeiros</SelectItem>
                  <SelectItem value="Certificação NR">Certificação NR</SelectItem>
                  <SelectItem value="Licença Ambiental">Licença Ambiental</SelectItem>
                  <SelectItem value="Alvará">Alvará de Funcionamento</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Input
                  type="date"
                  required
                  value={newDoc.expirationDate}
                  onChange={(e) => setNewDoc({ ...newDoc, expirationDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Avisar com antecedência (dias)</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={newDoc.warningDays}
                  onChange={(e) => setNewDoc({ ...newDoc, warningDays: Number(e.target.value) })}
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2">
              <CheckCircle className="h-4 w-4" /> Iniciar Monitoramento
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
