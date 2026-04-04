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
import { Trash, Plus } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'

export default function AttendanceLists() {
  const { toast } = useToast()
  const [certificates, setCertificates] = useState<any[]>([])
  const [selectedCert, setSelectedCert] = useState('')
  const [attendees, setAttendees] = useState<any[]>([])
  const [newName, setNewName] = useState('')

  useEffect(() => {
    pb.collection('certificates').getFullList().then(setCertificates)
  }, [])

  useEffect(() => {
    if (selectedCert) {
      pb.collection('attendance_lists')
        .getFullList({ filter: `certificate_id="${selectedCert}"` })
        .then(setAttendees)
    } else {
      setAttendees([])
    }
  }, [selectedCert])

  const handleAdd = async () => {
    if (!selectedCert || !newName) return
    try {
      const record = await pb.collection('attendance_lists').create({
        certificate_id: selectedCert,
        name: newName,
        presence: true,
        observations: '',
      })
      setAttendees([...attendees, record])
      setNewName('')
    } catch (e) {
      toast({ title: 'Erro', description: 'Falha ao adicionar.', variant: 'destructive' })
    }
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
    await pb.collection('attendance_lists').delete(id)
    setAttendees(attendees.filter((a) => a.id !== id))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Listas de Presença</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-8">
        <div className="space-y-3">
          <Label className="text-base font-semibold text-slate-800">
            Selecione o Certificado Base / Treinamento
          </Label>
          <Select value={selectedCert} onValueChange={setSelectedCert}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Escolha um treinamento finalizado ou em andamento..." />
            </SelectTrigger>
            <SelectContent>
              {certificates.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex justify-between w-full pr-4">
                    <span className="font-semibold mr-2">{c.nr_type}</span>
                    <span className="text-slate-500">
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
            <div className="flex gap-3 items-end mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex-1 space-y-2">
                <Label>Adicionar Novo Participante</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Nome completo do participante"
                  className="bg-white"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
              </div>
              <Button
                onClick={handleAdd}
                className="bg-[#3498db] text-white hover:bg-[#2980b9] h-10 px-6"
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="w-20 text-center">Presença</TableHead>
                    <TableHead>Nome do Colaborador</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendees.map((a) => (
                    <TableRow key={a.id} className={a.presence ? 'bg-white' : 'bg-slate-50'}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={a.presence}
                          onCheckedChange={() => handleTogglePresence(a.id, a.presence)}
                          className="mx-auto"
                        />
                      </TableCell>
                      <TableCell
                        className={`font-medium ${a.presence ? 'text-slate-900' : 'text-slate-400 line-through'}`}
                      >
                        {a.name}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {attendees.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-10 text-slate-500">
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
