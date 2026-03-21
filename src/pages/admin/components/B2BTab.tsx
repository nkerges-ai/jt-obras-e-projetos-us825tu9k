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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { HardHat, Wrench, Plus, BriefcaseBusiness } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getPpe, savePpe, getEquipment, saveEquipment, Ppe, Equipment } from '@/lib/storage'

export function B2BTab() {
  const { toast } = useToast()

  const [ppes, setPpes] = useState<Ppe[]>([])
  const [equipments, setEquipments] = useState<Equipment[]>([])

  const [isPpeOpen, setIsPpeOpen] = useState(false)
  const [isEqOpen, setIsEqOpen] = useState(false)

  const [newPpe, setNewPpe] = useState<Partial<Ppe>>({
    name: '',
    category: '',
    description: '',
    availability: 0,
  })

  const [newEq, setNewEq] = useState<Partial<Equipment>>({
    type: '',
    specs: '',
    rentalStatus: 'Disponível',
  })

  useEffect(() => {
    setPpes(getPpe())
    setEquipments(getEquipment())
  }, [])

  const handleAddPpe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPpe.name || !newPpe.category) return
    const ppe: Ppe = {
      id: `ppe_${Date.now()}`,
      name: newPpe.name,
      category: newPpe.category,
      description: newPpe.description || '',
      availability: Number(newPpe.availability) || 0,
    }
    const updated = [...ppes, ppe]
    setPpes(updated)
    savePpe(updated)
    setIsPpeOpen(false)
    setNewPpe({ name: '', category: '', description: '', availability: 0 })
    toast({ title: 'EPI Adicionado', description: 'Item cadastrado no catálogo.' })
  }

  const handleAddEq = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEq.type || !newEq.specs) return
    const eq: Equipment = {
      id: `eq_${Date.now()}`,
      type: newEq.type,
      specs: newEq.specs,
      rentalStatus: (newEq.rentalStatus as any) || 'Disponível',
    }
    const updated = [...equipments, eq]
    setEquipments(updated)
    saveEquipment(updated)
    setIsEqOpen(false)
    setNewEq({ type: '', specs: '', rentalStatus: 'Disponível' })
    toast({ title: 'Equipamento Adicionado', description: 'Item cadastrado para locação.' })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5 text-primary" /> B2B - EPIs e Locação
          </h3>
          <p className="text-muted-foreground text-sm">
            Catálogo de equipamentos de segurança e locação de maquinário pesado.
          </p>
        </div>
      </div>

      <Tabs defaultValue="epi" className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
          <TabsTrigger
            value="epi"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <HardHat className="h-4 w-4 mr-2" /> Catálogo de EPIs
          </TabsTrigger>
          <TabsTrigger
            value="eq"
            className="h-10 px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full border shadow-sm"
          >
            <Wrench className="h-4 w-4 mr-2" /> Equipamentos (Locação)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="epi" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsPpeOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo EPI
            </Button>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Disponibilidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ppes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum EPI cadastrado no catálogo.
                    </TableCell>
                  </TableRow>
                )}
                {ppes.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.description}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={p.availability > 0 ? 'outline' : 'destructive'}
                        className={
                          p.availability > 0 ? 'bg-green-50 text-green-700 border-green-200' : ''
                        }
                      >
                        {p.availability} em estoque
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="eq" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setIsEqOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Novo Equipamento
            </Button>
          </div>
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead>Equipamento / Tipo</TableHead>
                  <TableHead>Especificações Técnicas</TableHead>
                  <TableHead className="text-right">Status de Locação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      Nenhum equipamento cadastrado para locação.
                    </TableCell>
                  </TableRow>
                )}
                {equipments.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{e.specs}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          e.rentalStatus === 'Disponível'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : e.rentalStatus === 'Locado'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-orange-50 text-orange-700 border-orange-200'
                        }
                      >
                        {e.rentalStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isPpeOpen} onOpenChange={setIsPpeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo EPI</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPpe} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do EPI</Label>
              <Input
                required
                value={newPpe.name}
                onChange={(e) => setNewPpe({ ...newPpe, name: e.target.value })}
                placeholder="Ex: Capacete de Segurança"
              />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                required
                value={newPpe.category}
                onValueChange={(v) => setNewPpe({ ...newPpe, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Proteção da Cabeça">Proteção da Cabeça</SelectItem>
                  <SelectItem value="Proteção Auditiva">Proteção Auditiva</SelectItem>
                  <SelectItem value="Proteção Respiratória">Proteção Respiratória</SelectItem>
                  <SelectItem value="Proteção Visual">Proteção Visual</SelectItem>
                  <SelectItem value="Proteção em Altura">Proteção em Altura</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantidade Disponível (Estoque)</Label>
              <Input
                type="number"
                min="0"
                required
                value={newPpe.availability}
                onChange={(e) => setNewPpe({ ...newPpe, availability: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={newPpe.description}
                onChange={(e) => setNewPpe({ ...newPpe, description: e.target.value })}
                placeholder="Detalhes ou normas..."
              />
            </div>
            <Button type="submit" className="w-full">
              Salvar EPI
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEqOpen} onOpenChange={setIsEqOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Equipamento (Locação)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddEq} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Tipo / Nome do Equipamento</Label>
              <Input
                required
                value={newEq.type}
                onChange={(e) => setNewEq({ ...newEq, type: e.target.value })}
                placeholder="Ex: Betoneira 400L"
              />
            </div>
            <div className="space-y-2">
              <Label>Especificações Técnicas</Label>
              <Textarea
                required
                value={newEq.specs}
                onChange={(e) => setNewEq({ ...newEq, specs: e.target.value })}
                placeholder="Voltagem, capacidade, acessórios inclusos..."
              />
            </div>
            <div className="space-y-2">
              <Label>Status Atual</Label>
              <Select
                required
                value={newEq.rentalStatus}
                onValueChange={(v) => setNewEq({ ...newEq, rentalStatus: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Disponível">Disponível</SelectItem>
                  <SelectItem value="Locado">Locado</SelectItem>
                  <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Salvar Equipamento
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
