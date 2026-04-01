import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getTechnicalDocuments, TechnicalDocument } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

export default function PublicDocument() {
  const { token } = useParams()
  const [doc, setDoc] = useState<TechnicalDocument | null>(null)

  useEffect(() => {
    if (token) {
      const docId = atob(token)
      const docs = getTechnicalDocuments()
      const found = docs.find(d => d.id === docId)
      if (found) setDoc(found)
    }
  }, [token])

  if (!doc) {
    return <div className="min-h-screen flex items-center justify-center p-8 text-center text-muted-foreground bg-gray-50">Documento não encontrado ou token inválido.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <FileText className="h-8 w-8" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-navy mb-2">{doc.name}</h1>
          <p className="text-sm text-gray-500">Compartilhado via JT Obras e Projetos</p>
        </div>
        <Button asChild className="w-full gap-2 text-lg h-12" size="lg">
          <a href={doc.url} download={doc.name}>
            <Download className="h-5 w-5" /> Baixar Documento
          </a>
        </Button>
      </div>
    </div>
  )
}
