import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, MessageCircle, ScanFace, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import {
  ServiceOrder,
  getServiceOrders,
  saveServiceOrders,
  addLog,
  BiometricValidation,
} from '@/lib/storage'
import { OSForm } from './components/OSForm'
import { OSPreview } from './components/OSPreview'
import { BiometricCapture } from '@/components/BiometricCapture'

export default function OSNREditor() {
  const { toast } = useToast()
  const [data, setData] = useState<Partial<ServiceOrder>>({
    osNumber: '',
    revision: '00',
    status: 'Rascunho',
    prestadora: { nome: '', cnpj: '', endereco: '', responsavel: '', telefone: '' },
    execucao: { local: '', dataInicio: '', dataFim: '' },
    atividade: { descricao: '', setor: '' },
    epis: [],
    epcs: [],
  })

  const [isBiometricOpen, setIsBiometricOpen] = useState(false)

  useEffect(() => {
    const orders = getServiceOrders()
    const nextId = String(orders.length + 1).padStart(4, '0')
    setData((prev) => ({ ...prev, osNumber: nextId }))
  }, [])

  const handleSave = () => {
    const orders = getServiceOrders()
    const newOrder = { ...data, id: data.id || `os_${Date.now()}` } as ServiceOrder
    setData(newOrder)

    if (data.id) {
      saveServiceOrders(orders.map((o) => (o.id === data.id ? newOrder : o)))
    } else {
      saveServiceOrders([newOrder, ...orders])
    }
    toast({ title: 'Rascunho Salvo', description: 'Ordem de Serviço salva com sucesso.' })
  }

  const handlePrint = () => window.print()

  const handleWhatsApp = () => {
    addLog({
      type: 'WhatsApp',
      recipient: data.prestadora?.nome || 'Prestadora',
      message: `Link da OS NR01 ${data.osNumber} gerado e disparado via WhatsApp.`,
      status: 'Enviado',
    })
    const text = encodeURIComponent(
      `Olá! Segue a Ordem de Serviço NR01 referente às atividades acordadas.`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
    toast({ title: 'Notificação', description: 'Mensagem de WhatsApp disparada com sucesso.' })
  }

  const onBiometricCapture = (bioData: BiometricValidation) => {
    const orders = getServiceOrders()
    const updated = {
      ...data,
      id: data.id || `os_${Date.now()}`,
      status: 'Finalizado',
      biometricValidation: bioData,
    } as ServiceOrder

    setData(updated)
    if (data.id) {
      saveServiceOrders(orders.map((o) => (o.id === updated.id ? updated : o)))
    } else {
      saveServiceOrders([updated, ...orders])
    }

    setIsBiometricOpen(false)
    toast({ title: 'OS Assinada', description: 'Validação biométrica registrada com sucesso.' })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <BiometricCapture
        open={isBiometricOpen}
        onCapture={onBiometricCapture}
        onCancel={() => setIsBiometricOpen(false)}
      />

      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate hidden sm:block">
              Ordem de Serviço (NR01)
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="outline" size="sm" onClick={handleWhatsApp} className="gap-2">
              <MessageCircle className="h-4 w-4 text-green-600" />{' '}
              <span className="hidden sm:inline">WhatsApp</span>
            </Button>

            {data.status !== 'Finalizado' ? (
              <>
                <Button variant="outline" size="sm" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" /> <span className="hidden sm:inline">Salvar</span>
                </Button>
                <Button
                  onClick={() => setIsBiometricOpen(true)}
                  size="sm"
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ScanFace className="h-4 w-4" /> <span className="hidden sm:inline">Assinar</span>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="gap-2 bg-green-100 text-green-700 pointer-events-none"
              >
                <CheckCircle className="h-4 w-4" />{' '}
                <span className="hidden sm:inline">Finalizada</span>
              </Button>
            )}

            <Button
              onClick={handlePrint}
              size="sm"
              className="gap-2 border-brand-navy text-brand-navy"
            >
              <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Imprimir</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 print:p-0 print:w-full print:max-w-none flex flex-col lg:flex-row gap-8 items-start">
        <OSForm data={data} setData={setData} />
        <OSPreview data={data} />
      </div>
    </div>
  )
}
