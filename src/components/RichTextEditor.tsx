import React, { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Underline } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
}

export function RichTextEditor({ value, onChange, className, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || ''
      }
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, val: string = '') => {
    document.execCommand(command, false, val)
    if (editorRef.current) {
      editorRef.current.focus()
      onChange(editorRef.current.innerHTML)
    }
  }

  return (
    <div
      className={cn(
        'border rounded-md overflow-hidden bg-white flex flex-col focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 shadow-sm transition-shadow',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1 p-1.5 border-b bg-gray-50/80">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('bold')}
          title="Negrito"
        >
          <Bold className="h-4 w-4 text-gray-700" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('italic')}
          title="Itálico"
        >
          <Italic className="h-4 w-4 text-gray-700" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('underline')}
          title="Sublinhado"
        >
          <Underline className="h-4 w-4 text-gray-700" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('insertUnorderedList')}
          title="Lista com Marcadores"
        >
          <List className="h-4 w-4 text-gray-700" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('insertOrderedList')}
          title="Lista Numerada"
        >
          <ListOrdered className="h-4 w-4 text-gray-700" />
        </Button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('formatBlock', 'H1')}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4 text-gray-700" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-gray-200"
          onClick={() => execCommand('formatBlock', 'H2')}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4 text-gray-700" />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="p-4 min-h-[150px] outline-none prose prose-sm max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60 bg-white"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  )
}
