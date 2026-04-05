import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, FileSignature, Receipt, CheckCircle, Activity } from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Visão Geral</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-800 shadow-sm bg-[#1e293b]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Certificados Pendentes
            </CardTitle>
            <FileText className="h-5 w-5 text-[#3498db]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">12</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 shadow-sm bg-[#1e293b]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Contratos em Andamento
            </CardTitle>
            <FileSignature className="h-5 w-5 text-[#3498db]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">5</div>
          </CardContent>
        </Card>
        <Card className="border-slate-800 shadow-sm bg-[#1e293b]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 uppercase tracking-wider">
              Orçamentos Aprovados
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">8</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold text-white mt-8 mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5 text-slate-400" />
        Últimas Ações
      </h2>
      <div className="bg-[#1e293b] shadow-sm border border-slate-800 rounded-lg p-6">
        <ul className="space-y-4">
          <li className="flex items-center gap-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0"></div>
            <p className="text-sm text-slate-300 flex-1">
              Certificado NR-35 criado para{' '}
              <span className="font-semibold text-white">João Silva</span>
            </p>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
              Há 2 horas
            </span>
          </li>
          <li className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
            <p className="text-sm text-slate-300 flex-1">
              Orçamento aprovado para{' '}
              <span className="font-semibold text-white">Construtora Alpha</span>
            </p>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
              Há 5 horas
            </span>
          </li>
          <li className="flex items-center gap-4">
            <div className="w-2 h-2 bg-yellow-500 rounded-full shrink-0"></div>
            <p className="text-sm text-slate-300 flex-1">
              Contrato de Prestação de Serviços enviado para assinatura
            </p>
            <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">Ontem</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
