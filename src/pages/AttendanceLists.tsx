import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function AttendanceLists() {
  const [lists, setLists] = useState<any[]>([])

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const records = await pb.collection('attendance_lists').getFullList({ sort: '-created' })
        setLists(records)
      } catch (e) {
        console.error(e)
      }
    }
    fetchLists()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Listas de Presença</h1>
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Presença</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">{list.name}</TableCell>
                <TableCell>{list.cpf || 'N/A'}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${list.presence ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {list.presence ? 'Presente' : 'Ausente'}
                  </span>
                </TableCell>
                <TableCell>{new Date(list.created).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {lists.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  Nenhuma lista de presença registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
