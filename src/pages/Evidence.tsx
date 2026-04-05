import { useState, useEffect } from 'react'
import pb from '@/lib/pocketbase/client'
import { FileText, Video } from 'lucide-react'

export default function Evidence() {
  const [evidences, setEvidences] = useState<any[]>([])

  useEffect(() => {
    const fetchEvidences = async () => {
      try {
        const records = await pb.collection('evidence').getFullList({ sort: '-created' })
        setEvidences(records)
      } catch (e) {
        console.error(e)
      }
    }
    fetchEvidences()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Evidências de Obras</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {evidences.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border shadow-sm overflow-hidden group">
            <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
              {item.type === 'photo' ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/evidence/${item.id}/${item.file}`}
                  className="w-full h-full object-cover"
                  alt="Evidência"
                />
              ) : item.type === 'video' ? (
                <Video className="h-10 w-10 text-slate-400" />
              ) : (
                <FileText className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <div className="p-4">
              <p className="font-semibold text-slate-800 truncate">
                {item.description || 'Sem descrição'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(item.created).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        {evidences.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 bg-white rounded-lg border border-dashed">
            Nenhuma evidência carregada.
          </div>
        )}
      </div>
    </div>
  )
}
