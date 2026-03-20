import { useState, useEffect, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Package, Plus, AlertTriangle, ArrowDownUp, Search } from 'lucide-react'
import { getInventory, saveInventory, Material } from '@/lib/storage'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export function InventoryTab() {
  const { toast } = useToast()
  const [inventory, setInventory] = useState<Material[]>([])
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Todos')

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [moveAmount, setMoveAmount] = useState('')
  const [moveType, setMoveType] = useState<'in' | 'out'>('in')

  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [newMaterial, setNewMaterial] = useState<Partial<Material>>({
    name: '',
    category: 'Básico',
    quantity: 0,
    minQuantity: 10,
    unit: 'un',
  })

  useEffect(() => {
    setInventory(getInventory())
  }, [])

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = filterCat === 'Todos' || item.category === filterCat
      return matchSearch && matchCat
    })
  }, [inventory, search, filterCat])

  const categories = ['Todos', ...Array.from(new Set(inventory.map((i) => i.category)))]

  const handleMovement = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMaterial) return
    const amount = Number(moveAmount)
    if (isNaN(amount) || amount <= 0) return

    const updatedQty =
      moveType === 'in' ? selectedMaterial.quantity + amount : selectedMaterial.quantity - amount

    if (updatedQty < 0) {
      toast({
        title: 'Operação Inválida',
        description: 'Estoque não pode ficar negativo.',
        variant: 'destructive',
      })
      return
    }

    const newList = inventory.map((item) =>
      item.id === selectedMaterial.id ? { ...item, quantity: updatedQty } : item,
    )
    setInventory(newList)
    saveInventory(newList)
    setIsMoveDialogOpen(false)
    setMoveAmount('')
    toast({
      title: 'Estoque Atualizado',
      description: `O estoque de ${selectedMaterial.name} foi atualizado.`,
    })
  }

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMaterial.name) return

    const mat: Material = {
      id: `m_${Date.now()}`,
      name: newMaterial.name,
      category: newMaterial.category || 'Outros',
      quantity: Number(newMaterial.quantity) || 0,
      minQuantity: Number(newMaterial.minQuantity) || 0,
      unit: newMaterial.unit || 'un',
    }

    const newList = [...inventory, mat]
    setInventory(newList)
    saveInventory(newList)
    setIsNewDialogOpen(false)
    setNewMaterial({ name: '', category: 'Básico', quantity: 0, minQuantity: 10, unit: 'un' })
    toast({ title: 'Material Cadastrado', description: `${mat.name} foi adicionado ao estoque.` })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Gestão de Estoque
          </h3>
          <p className="text-muted-foreground text-sm">Controle de materiais, entradas e saídas.</p>
        </div>
        <Button
          onClick={() => setIsNewDialogOpen(true)}
          className="gap-2 font-bold w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Novo Material
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar material..."
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Material / Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Quantidade</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum material encontrado no estoque.
                </TableCell>
              </TableRow>
            )}
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{item.category}</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.quantity}{' '}
                  <span className="text-muted-foreground font-normal text-xs">{item.unit}</span>
                </TableCell>
                <TableCell className="text-center">
                  {item.quantity <= item.minQuantity ? (
                    <Badge
                      variant="destructive"
                      className="gap-1 bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-none"
                    >
                      <AlertTriangle className="h-3 w-3" /> Baixo
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      Regular
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-primary"
                    onClick={() => {
                      setSelectedMaterial(item)
                      setIsMoveDialogOpen(true)
                    }}
                  >
                    Movimentar <ArrowDownUp className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Movimentação de Estoque</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <form onSubmit={handleMovement} className="space-y-4 pt-4">
              <div className="bg-secondary/30 p-4 rounded-lg text-sm mb-4">
                <span className="text-muted-foreground block">Material Selecionado:</span>
                <span className="font-bold text-lg">{selectedMaterial.name}</span>
                <div className="mt-1 text-muted-foreground">
                  Estoque Atual: {selectedMaterial.quantity} {selectedMaterial.unit}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Movimento</Label>
                  <Select value={moveType} onValueChange={(v: any) => setMoveType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">Entrada (Compra)</SelectItem>
                      <SelectItem value="out">Saída (Uso em Obra)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Quantidade ({selectedMaterial.unit})</Label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={moveAmount}
                    onChange={(e) => setMoveAmount(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Registrar Movimentação
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Material</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMaterial} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Nome do Material</Label>
              <Input
                required
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                placeholder="Ex: Cimento CP II"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Input
                  value={newMaterial.category}
                  onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                  placeholder="Ex: Básico"
                />
              </div>
              <div className="space-y-2">
                <Label>Unidade de Medida</Label>
                <Input
                  value={newMaterial.unit}
                  onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                  placeholder="Ex: sc, un, lt, kg"
                />
              </div>
              <div className="space-y-2">
                <Label>Qtd. Inicial</Label>
                <Input
                  type="number"
                  required
                  value={newMaterial.quantity}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Estoque Mínimo (Alerta)</Label>
                <Input
                  type="number"
                  required
                  value={newMaterial.minQuantity}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, minQuantity: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Salvar Material
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
