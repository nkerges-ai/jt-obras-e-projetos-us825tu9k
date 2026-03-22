import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FileText, File as FileIcon, Download } from 'lucide-react'
import { exportHtmlToWord } from '@/lib/export-utils'

interface ExportDocumentDialogProps {
  title: string
  elementId?: string
  trigger?: React.ReactNode
  onExportWord?: () => void
  onExportPDF?: () => void
}

export function ExportDocumentDialog({
  title,
  elementId = 'document-letterhead-root',
  trigger,
  onExportWord,
  onExportPDF,
}: ExportDocumentDialogProps) {
  const [open, setOpen] = useState(false)

  const handleWord = () => {
    if (onExportWord) {
      onExportWord()
    } else if (elementId) {
      const el = document.getElementById(elementId)
      if (el) exportHtmlToWord(el.innerHTML, title)
    }
    setOpen(false)
  }

  const handlePDF = () => {
    if (onExportPDF) {
      onExportPDF()
    } else {
      window.print()
    }
    setOpen(false)
  }

  return (
    <>
      <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
        {trigger || (
          <Button size="sm" className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white">
            <Download className="h-4 w-4" /> Exportar / Salvar
          </Button>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-xl text-brand-navy text-center">
              Exportar Documento
            </DialogTitle>
            <DialogDescription className="text-center">{title}</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <p className="font-medium text-lg mb-6 text-gray-700">Abrir documento como:</p>
            <div className="flex justify-center gap-6">
              <Button
                variant="outline"
                className="h-28 w-32 flex flex-col gap-3 border-blue-200 hover:bg-blue-50 hover:border-blue-400 text-blue-700 shadow-sm transition-all hover:scale-105"
                onClick={handleWord}
              >
                <FileText className="h-10 w-10" />
                <span className="font-bold">Word (.doc)</span>
              </Button>
              <Button
                variant="outline"
                className="h-28 w-32 flex flex-col gap-3 border-red-200 hover:bg-red-50 hover:border-red-400 text-red-700 shadow-sm transition-all hover:scale-105"
                onClick={handlePDF}
              >
                <FileIcon className="h-10 w-10" />
                <span className="font-bold">PDF</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
