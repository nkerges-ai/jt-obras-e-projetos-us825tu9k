import { Building2, User, AlertTriangle } from 'lucide-react'

export function OSPreview({ data }: { data: any }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 md:p-12 print:p-0 min-h-[1056px] print:min-h-0 shadow-sm print:shadow-none text-gray-900 border border-gray-200 print:border-none print:w-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-blue-900 text-white flex items-center justify-center font-bold text-2xl rounded-sm shadow-sm">
            JT
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">
              JT Obras e Manutenções
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              Ordem de Serviço - Segurança do Trabalho
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-xl text-gray-900">NR-01</p>
          <p className="text-sm text-gray-500 font-medium">Revisão: {data.revision || '00'}</p>
        </div>
      </div>

      {/* Employee Data */}
      <div className="bg-gray-50 p-5 border border-gray-300 mb-8 rounded-sm">
        <h2 className="font-bold border-b border-gray-300 pb-2 mb-4 flex items-center gap-2 uppercase text-sm text-gray-800">
          <User className="h-4 w-4" /> Identificação do Colaborador
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
          <div>
            <span className="text-gray-500 block text-[10px] font-bold uppercase tracking-wider mb-1">
              Nome Completo
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {data.employee?.name || 'Não informado'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-bold uppercase tracking-wider mb-1">
              Função / Cargo
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {data.employee?.role || 'Não informada'}
            </span>
          </div>
          <div>
            <span className="text-gray-500 block text-[10px] font-bold uppercase tracking-wider mb-1">
              Data de Emissão
            </span>
            <span className="font-semibold text-gray-900 text-base">
              {data.employee?.date
                ? new Date(data.employee.date).toLocaleDateString('pt-BR')
                : 'Não informada'}
            </span>
          </div>
        </div>
      </div>

      {/* Responsibilities - Rich Text rendered via prose */}
      <div className="mb-10">
        <h2 className="font-bold bg-blue-900 text-white px-4 py-2.5 mb-5 uppercase text-sm flex items-center gap-2 rounded-sm shadow-sm">
          <Building2 className="h-4 w-4" /> 1. Obrigações do Empregado (Normas Gerais)
        </h2>
        <div
          className="prose prose-sm max-w-none text-gray-800 px-2"
          dangerouslySetInnerHTML={{
            __html:
              data.safetyInstructions?.responsibilities ||
              '<p class="text-gray-500 italic">Nenhuma instrução informada.</p>',
          }}
        />
      </div>

      {/* Prohibitions - Rich Text rendered via prose */}
      <div className="mb-16">
        <h2 className="font-bold bg-red-700 text-white px-4 py-2.5 mb-5 uppercase text-sm flex items-center gap-2 rounded-sm shadow-sm">
          <AlertTriangle className="h-4 w-4" /> 2. Proibições e Atos Inseguros
        </h2>
        <div
          className="prose prose-sm max-w-none text-gray-800 px-2"
          dangerouslySetInnerHTML={{
            __html:
              data.safetyInstructions?.prohibitions ||
              '<p class="text-gray-500 italic">Nenhuma proibição informada.</p>',
          }}
        />
      </div>

      {/* Signatures */}
      <div className="mt-20 pt-10 border-t-2 border-dashed border-gray-300 grid grid-cols-2 gap-12 text-center relative print:break-inside-avoid">
        {data.adminSignature && (
          <div className="absolute top-[-50px] left-[25%] transform -translate-x-1/2 flex flex-col items-center">
            {data.adminSignature.type === 'govbr' ? (
              <div className="border-2 border-blue-800 px-4 py-1.5 bg-white print:bg-white rounded shadow-md transform -rotate-3 z-10 print:shadow-none print:border-blue-800">
                <span className="text-[10px] font-black tracking-widest text-blue-800 print:text-blue-800 block">
                  ASSINADO DIGITALMENTE
                </span>
                <span className="text-[10px] font-bold text-blue-600 print:text-blue-600 block">
                  VIA PORTAL GOV.BR
                </span>
              </div>
            ) : (
              <img
                src={data.adminSignature.data}
                alt="Assinatura Admin"
                className="h-20 mix-blend-multiply print:mix-blend-normal opacity-90 z-10"
              />
            )}
          </div>
        )}

        <div className="relative z-0">
          <div className="border-t border-black w-full mb-2 mx-auto max-w-[280px]"></div>
          <p className="font-bold text-sm text-gray-900">Responsável Técnico</p>
          <p className="text-xs text-gray-500">JT Obras e Manutenções LTDA</p>
        </div>
        <div className="relative z-0">
          <div className="border-t border-black w-full mb-2 mx-auto max-w-[280px]"></div>
          <p className="font-bold text-sm text-gray-900">
            {data.employee?.name || 'Assinatura do Empregado'}
          </p>
          <p className="text-xs text-gray-500">
            {data.employee?.role || 'Declaro ter recebido treinamento e EPIs'}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-16 text-center text-[10px] text-gray-400 border-t pt-4">
        <p>
          Documento gerado pelo Sistema Integrado de Gestão JT Obras. Em conformidade absoluta com a
          NR-01 do MTE.
        </p>
        <p>
          Este documento deve ser mantido no arquivo da empresa e uma cópia fornecida ao
          trabalhador.
        </p>
      </div>
    </div>
  )
}
