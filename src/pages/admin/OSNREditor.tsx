import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, Fingerprint, PenTool } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { saveServiceOrders, getServiceOrders, addAuditLog } from '@/lib/storage'
import { OSForm } from './components/OSForm'
import { OSPreview } from './components/OSPreview'
import { WizardStepper } from '@/components/WizardStepper'

export default function OSNREditor() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const wizardSteps = ['Identificação', 'Instruções e Proibições', 'Revisão e Assinatura']

  const [data, setData] = useState<any>({
    id: `os_${Date.now()}`,
    osNumber: '001',
    revision: '00',
    status: 'Rascunho',
    employee: { name: '', role: '', date: new Date().toISOString().split('T')[0] },
    safetyInstructions: {
      responsibilities:
        'a) Cumprir as disposições legais e regulamentares sobre segurança e medicina do trabalho, inclusive as ordens de serviço expedidas pelo empregador;\nb) Usar o EPI fornecido pelo empregador;\nc) Submeter-se aos exames médicos previstos nas Normas Regulamentadoras – NR;\nd) Colaborar com a empresa na aplicação das Normas Regulamentadoras – NR.\n\nObs: Constitui ato faltoso a recusa injustificada do empregado ao cumprimento do disposto no item anterior, podendo acarretar demissão por justa causa.\n\nEm caso de Acidentes, Incidentes ou Condições Inseguras, comunicar imediatamente, Departamento de Segurança, Engenheiro, Administrativo, Mestre de obra e Encarregado.',
      prohibitions:
        'Deixar de usar EPI;\nApresentar-se ao trabalho embriagado;\nOperar máquinas ou equipamentos sem treinamento/autorização.',
    },
  })

  const handleSave = () => {
    const orders = getServiceOrders()
    saveServiceOrders([data, ...orders])
    addAuditLog({
      userId: 'Admin',
      action: 'Criar OS NR01',
      table: 'Ordem de Serviço',
      newData: JSON.stringify(data),
    })
    toast({ title: 'Salvo no Acervo', description: 'Ordem de Serviço salva com sucesso.' })
  }

  const signEletronic = () => {
    setData({
      ...data,
      adminSignature: {
        type: 'draw',
        data: 'https://img.usecurling.com/i?q=signature&color=blue&shape=hand-drawn',
        date: new Date().toLocaleString(),
      },
    })
    toast({ title: 'Assinado', description: 'Assinatura eletrônica aplicada.' })
  }

  const signGovbr = () => {
    setData({ ...data, adminSignature: { type: 'govbr', date: new Date().toLocaleString() } })
    toast({ title: 'Validado Gov.br', description: 'Assinatura digital Gov.br aplicada.' })
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate hidden sm:block">
              Gerador OS (NR-01 Padrão)
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {step === wizardSteps.length && (
              <>
                <Button
                  size="sm"
                  onClick={signEletronic}
                  variant="outline"
                  className="gap-2 text-brand-navy"
                >
                  <PenTool className="h-4 w-4" /> Assinatura Eletrônica
                </Button>
                <Button
                  size="sm"
                  onClick={signGovbr}
                  className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white"
                >
                  <Fingerprint className="h-4 w-4" /> Assinatura Gov.br
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className="gap-2 hidden sm:flex"
                >
                  <Save className="h-4 w-4" /> Salvar Acervo
                </Button>
                <Button onClick={() => window.print()} size="sm" className="gap-2">
                  <Printer className="h-4 w-4" /> Imprimir
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <WizardStepper steps={wizardSteps} currentStep={step} setStep={setStep} />

      <div className="container mx-auto px-4 print:p-0 flex flex-col lg:flex-row items-start gap-8 mt-6">
        {step < wizardSteps.length && (
          <div className="w-full lg:w-[450px] shrink-0 bg-white p-6 md:p-8 rounded-xl border shadow-sm print:hidden flex flex-col sticky top-[180px]">
            <OSForm data={data} setData={setData} currentStep={step} />
            <div className="flex justify-between mt-auto pt-8 border-t mt-8">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
                Voltar
              </Button>
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-brand-light hover:bg-brand-light/90 text-white"
              >
                Avançar
              </Button>
            </div>
          </div>
        )}
        <div
          className={`w-full bg-white shadow-xl border print:shadow-none print:border-none ${step === wizardSteps.length ? 'mx-auto max-w-4xl' : ''}`}
        >
          <OSPreview data={data} />
        </div>
      </div>
    </div>
  )
}
