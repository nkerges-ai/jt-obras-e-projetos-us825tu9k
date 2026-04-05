import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Trash, Plus, MoreVertical, Edit } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export default function AttendanceLists() {
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedCert, setSelectedCert] = useState('')
  const [attendees, setAttendees] = useState<any[]>([])

  const [newName, setNewName] = useState('')
  const [newCpf, setNewCpf] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    pb.collection('certificates').getFullList().then(setCertificates)
  }, [])

  useEffect(() => {
    if (selectedCert) {
      loadAttendees()
    } else {
      setAttendees([])
    }
  }, [selectedCert])

  const loadAttendees = () => {
    pb.collection('attendance_lists')
      .getFullList({ filter: `certificate_id="${selectedCert}"`, sort: '+created' })
      .then(setAttendees)
  }

  const formatCpf = (v: string) => {
    let val = v.replace(/\D/g, '')
    if (val.length > 11) val = val.slice(0, 11)
    val = val.replace(/(\d{3})(\d)/, '$1.$2')
    val = val.replace(/(\d{3})(\d)/, '$1.$2')
    val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return val
  }

  const handleSave = async () => {
    if (!selectedCert || !newName) return
    try {
      const payload = {
        certificate_id: selectedCert,
        name: newName,
        cpf: newCpf,
        presence: true,
        observations: '',
      }

      if (editingId) {
        await pb.collection('attendance_lists').update(editingId, payload)
        toast({ title: 'Sucesso', description: 'Participante atualizado.' })
      } else {
        await pb.collection('attendance_lists').create(payload)
        toast({ title: 'Sucesso', description: 'Participante adicionado.' })
      }

      setNewName('')
      setNewCpf('')
      setEditingId(null)
      loadAttendees()
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao salvar.', variant: 'destructive' })
    }
  }

  const handleEdit = (a: any) => {
    setNewName(a.name)
    setNewCpf(a.cpf || '')
    setEditingId(a.id)
  }

  const handleTogglePresence = async (id: string, currentVal: boolean) => {
    try {
      const updated = await pb.collection('attendance_lists').update(id, { presence: !currentVal })
      setAttendees(attendees.map((a) => (a.id === id ? updated : a)))
    } catch (e) {
      console.error(e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover participante?')) return
    await pb.collection('attendance_lists').delete(id)
    setAttendees(attendees.filter((a) => a.id !== id))
  }

  const cancelEdit = () => {
    setNewName('')
    setNewCpf('')
    setEditingId(null)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-white">Listas de Presença</h1>

      <div className="bg-[#1e293b] p-6 rounded-lg shadow-sm border border-slate-800 space-y-8">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-white">
            Selecione o Certificado Base / Treinamento
          </Label>
          <Select value={selectedCert} onValueChange={setSelectedCert}>
            <SelectTrigger className="h-12 bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Escolha um treinamento finalizado ou em andamento..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {certificates.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex justify-between w-full pr-4">
                    <span className="font-semibold mr-2 text-[#3498db]">{c.nr_type}</span>
                    <span className="text-slate-400">
                      {c.collaborator_name} - {c.training_date?.split(' ')[0]}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCert && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-3 items-end mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="flex-1 space-y-2 w-full">
                <Label className="text-slate-300">Nome do Participante</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome completo"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>
              <div className="flex-1 space-y-2 w-full">
                <Label className="text-slate-300">CPF</Label>
                <Input
                  value={newCpf}
                  onChange={(e) => setNewCpf(formatCpf(e.target.value))}
                  placeholder="000.000.000-00"
                  className="bg-slate-800 border-slate-700 text-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                {editingId && (
                  <Button
                    variant="outline"
                    onClick={cancelEdit}
                    className="h-10 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 flex-1 md:flex-none"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleSave}
                  className="bg-[#3498db] text-white hover:bg-[#2980b9] h-10 px-6 flex-1 md:flex-none"
                >
                  {editingId ? (
                    'Salvar'
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" /> Adicionar
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="border border-slate-800 rounded-lg overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader className="bg-slate-800/50">
                  <TableRow className="border-slate-800">
                    <TableHead className="w-20 text-center text-slate-300">Presença</TableHead>
                    <TableHead className="text-slate-300">Nome do Colaborador</TableHead>
                    <TableHead className="text-slate-300">CPF</TableHead>
                    <TableHead className="text-right text-slate-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((a) => (
                    <TableRow
                      key={a.id}
                      className={`border-slate-800 ${a.presence ? 'bg-transparent' : 'bg-slate-900/30'}`}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={a.presence}
                          onCheckedChange={() => handleTogglePresence(a.id, a.presence)}
                          className="mx-auto border-slate-500 data-[state=checked]:bg-[#3498db] data-[state=checked]:border-[#3498db]"
                        />
                      </TableCell>
                      <TableCell
                        className={`font-medium ${a.presence ? 'text-white' : 'text-slate-500 line-through'}`}
                      >
                        {a.name}
                      </TableCell>
                      <TableCell
                        className={`${a.presence ? 'text-slate-300' : 'text-slate-600 line-through'}`}
                      >
                        {a.cpf || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-white"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-[#0f172a] border-slate-800 text-slate-200"
                          >
                            <DropdownMenuItem
                              onClick={() => handleEdit(a)}
                              className="cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white"
                            >
                              <Edit className="h-4 w-4 mr-2" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-800" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(a.id)}
                              className="cursor-pointer text-red-400 hover:bg-red-950 hover:text-red-300 focus:bg-red-950 focus:text-red-300"
                            >
                              <Trash className="h-4 w-4 mr-2" /> Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {attendees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-slate-500">
                        A lista de presença está vazia para este treinamento.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
