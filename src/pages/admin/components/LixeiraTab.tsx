import { useState, useEffect } from 'react'
import { getDeletedItems, saveDeletedItems, DeletedItem, addAuditLog, saveTechnicalDocuments, getTechnicalDocuments } from '@/lib/storage'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Trash2, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function LixeiraTab() {
  const [items, setItems] = useState<DeletedItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setItems(getDeletedItems())
  }, [])

  const handleRestore = (item: DeletedItem) => {
    if (item.type === 'Document') {
      const docs = getTechnicalDocuments()
      saveTechnicalDocuments([item.data, ...docs])
    }
    
    const newItems = items.filter(i => i.id !== item.id)
    setItems(newItems)
    saveDeletedItems(newItems)
    addAuditLog({ userId: 'Admin', action: 'Restaurar', table: item.type, newData: JSON.stringify(item.data) })
    
    toast({ title: 'Item Restaurado', description: 'O item foi movido de volta para a base ativa.' })
  }

  const handlePurge = (id: string) => {
    const newItems = items.filter(i => i.id !== id)
    setItems(newItems)
    saveDeletedItems(newItems)
    addAuditLog({ userId: 'Admin', action: 'Exclusão Permanente', table: 'Lixeira' })
    toast({ title: 'Item Excluído Permanentemente' })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
          <Trash2 className="h-5 w-5 text-red-500" /> Lixeira de Documentos
        </h3>
        <p className="text-muted-foreground text-sm">
          Itens excluídos permanecem aqui e podem ser restaurados ou permanentemente apagados.
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/50">
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Identificação</TableHead>
              <TableHead>Data de Exclusão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  A lixeira está vazia.
                </TableCell>
              </TableRow>
            )}
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.data?.name || item.data?.title || 'Sem Nome'}</TableCell>
                <TableCell>{new Date(item.deletedAt).toLocaleString('pt-BR')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleRestore(item)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" title="Restaurar">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handlePurge(item.id)} className="text-red-600 hover:text-red-800 hover:bg-red-50" title="Excluir Permanentemente">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
