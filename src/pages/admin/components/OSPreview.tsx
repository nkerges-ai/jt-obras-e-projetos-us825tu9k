import React from 'react'

export function OSPreview({ data }: { data: any }) {
  return (
    <div className="w-full bg-white p-4 md:p-8 flex justify-center print:p-0">
      <div className="w-full max-w-[800px]">
        <table className="w-full border-collapse text-[12px] font-sans text-black">
          <tbody>
            <tr>
              <td
                colSpan={2}
                className="border-2 border-black text-center font-extrabold p-3 text-[14px] uppercase tracking-wide bg-gray-50"
              >
                ORDEM DE SERVIÇO - SEGURANÇA E MEDICINA DO TRABALHO
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border border-black border-t-0 p-3 text-justify text-[11px] leading-relaxed"
              >
                Conforme estabelecido no item 1.7 letra "b", NR-01 da Portaria 3214/MTE, cabe ao
                empregador elaborar Ordem de Serviço (OS) sobre Segurança e Medicina do Trabalho,
                dando ciência aos empregados.
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2.5 w-2/3">
                <span className="font-bold mr-2 uppercase">NOME:</span>
                <span className="uppercase">
                  {data.employee?.name || '______________________________________'}
                </span>
              </td>
              <td className="border border-black p-2.5 w-1/3">
                <span className="font-bold mr-2 uppercase">DATA:</span>
                <span>{data.employee?.date || '__/__/____'}</span>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="border border-black p-2.5">
                <span className="font-bold mr-2 uppercase">FUNÇÃO:</span>
                <span className="uppercase">
                  {data.employee?.role || '______________________________________'}
                </span>
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border-2 border-black border-x-2 bg-gray-100 font-bold p-2 text-center text-[13px] tracking-widest mt-2"
              >
                INSTRUÇÃO DE SEGURANÇA:
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border border-black font-extrabold p-1.5 text-center bg-gray-50 text-[12px] uppercase"
              >
                CABE AO EMPREGADO
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border border-black p-4 whitespace-pre-wrap text-[11px] leading-loose text-justify font-medium"
              >
                {data.safetyInstructions?.responsibilities}
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border border-black font-extrabold p-1.5 text-center bg-gray-50 text-[12px] uppercase"
              >
                PROIBIÇÕES
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border border-black p-4 whitespace-pre-wrap text-[11px] leading-loose font-medium"
              >
                {data.safetyInstructions?.prohibitions}
              </td>
            </tr>
            <tr>
              <td
                colSpan={2}
                className="border-2 border-black border-t-0 p-8 text-center bg-white relative"
              >
                <div className="flex flex-col items-center justify-center mt-12 mb-4 relative z-10">
                  {data.adminSignature?.type === 'govbr' ? (
                    <div className="absolute bottom-6 flex flex-col items-center bg-white px-4 border border-blue-900 rounded py-1">
                      <span className="text-[10px] font-bold text-blue-900">
                        ASSINADO DIGITALMENTE VIA GOV.BR
                      </span>
                      <span className="text-[8px] text-gray-500">{data.adminSignature?.date}</span>
                    </div>
                  ) : data.adminSignature?.data ? (
                    <img
                      src={data.adminSignature.data}
                      className="absolute bottom-4 h-16 mix-blend-multiply"
                      alt="Assinatura"
                    />
                  ) : null}
                  <div className="w-80 border-t border-black"></div>
                  <span className="mt-2 font-bold text-[12px] uppercase">
                    {data.employee?.name || 'Assinatura do Empregado'}
                  </span>
                  <span className="mt-0.5 text-[10px] text-gray-600">
                    {data.employee?.role || 'Função'}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
