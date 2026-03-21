import React from 'react'
import logo from '@/assets/logotipo-c129e.jpg'
import { PGRDocument } from '@/lib/storage'
import { CheckCircle } from 'lucide-react'

export function PGRPreview({ data }: { data: Partial<PGRDocument> }) {
  return (
    <div className="flex-1 flex justify-center print:block print:w-full">
      <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:m-0 print:p-0">
        <div className="p-[15mm] border border-gray-400 min-h-[297mm] flex flex-col print:border-gray-800 m-[5mm] print:m-0">
          <header className="flex justify-between items-center border-b-2 border-brand-navy pb-4 mb-6">
            <img src={logo} className="h-12 object-contain" alt="JT Obras Logo" />
            <div className="text-right">
              <h1 className="font-extrabold text-lg text-brand-navy">
                PROGRAMA DE GERENCIAMENTO DE RISCOS
              </h1>
              <p className="font-semibold text-sm mt-1 text-gray-600">
                Norma Regulamentadora 01 (NR-01)
              </p>
            </div>
          </header>

          <main className="flex-1 text-[12px] text-gray-800 leading-relaxed">
            <div className="mb-6 border border-gray-300 rounded p-3 bg-gray-50/50">
              <h2 className="font-bold text-[11px] uppercase border-b border-gray-300 pb-1 mb-2">
                1. Identificação da Empresa e Obra
              </h2>
              <div className="grid grid-cols-2 gap-y-2">
                <p>
                  <strong>Empresa Avaliada:</strong> {data.empresa || '___________________________'}
                </p>
                <p>
                  <strong>CNPJ:</strong> {data.cnpj || '____________________'}
                </p>
                <p>
                  <strong>Data de Elaboração:</strong>{' '}
                  {data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '__/__/____'}
                </p>
                <p>
                  <strong>Elaborador/Responsável:</strong>{' '}
                  {data.elaborador || '___________________________'}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-3">
                2. Inventário de Riscos Ocupacionais
              </h2>
              {!data.riscos || data.riscos.length === 0 ? (
                <p className="text-center py-8 text-gray-500 border border-dashed">
                  Nenhum risco cadastrado na matriz.
                </p>
              ) : (
                <table className="w-full border-collapse border border-gray-400 text-left text-[11px]">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 p-1.5 w-1/4">Atividade / Fonte</th>
                      <th className="border border-gray-400 p-1.5 w-1/5">Perigo (Risco)</th>
                      <th className="border border-gray-400 p-1.5 w-1/5">Dano Potencial</th>
                      <th className="border border-gray-400 p-1.5">
                        Medidas de Controle Preventivas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.riscos.map((r) => (
                      <tr key={r.id}>
                        <td className="border border-gray-400 p-1.5 align-top">{r.atividade}</td>
                        <td className="border border-gray-400 p-1.5 align-top">{r.perigo}</td>
                        <td className="border border-gray-400 p-1.5 align-top">{r.dano}</td>
                        <td className="border border-gray-400 p-1.5 align-top whitespace-pre-wrap">
                          {r.medidas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="mt-8 border border-gray-300 rounded p-3 text-justify text-[11px]">
              <p>
                As informações contidas neste Programa de Gerenciamento de Riscos (PGR) foram
                elaboradas com base nas condições observadas e informadas para a presente obra. O
                cumprimento das medidas preventivas descritas na matriz de riscos é obrigatório para
                a liberação de Ordens de Serviço (OS) e emissão de Permissões de Trabalho.
              </p>
            </div>

            <div className="mt-16 text-center w-64 mx-auto flex flex-col items-center">
              {data.adminSignature?.type === 'govbr' ? (
                <div className="flex flex-col items-center justify-center h-12 mb-2 text-center">
                  <span className="text-[10px] font-bold text-blue-800 border border-blue-800 px-2 py-1 rounded bg-blue-50">
                    ASSINADO GOV.BR
                  </span>
                </div>
              ) : data.adminSignature?.data ? (
                <div className="h-12 flex items-center justify-center mb-2">
                  <img
                    src={data.adminSignature.data}
                    alt="Assinatura"
                    className="max-h-full mix-blend-multiply"
                  />
                </div>
              ) : (
                <div className="border-t border-black w-full mx-auto mb-2 mt-12"></div>
              )}
              {data.adminSignature && data.adminSignature.type !== 'govbr' && (
                <div className="border-t border-black w-full mx-auto mb-2"></div>
              )}
              <p className="font-bold text-xs">{data.elaborador || 'Responsável Técnico'}</p>
              <p className="text-[10px] text-gray-500 uppercase">Elaborador do PGR</p>
              {data.adminSignature?.biometric && (
                <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold mt-1">
                  <CheckCircle className="h-3 w-3" /> Validação Emissora Confirmada
                </p>
              )}
            </div>
          </main>

          <footer className="mt-auto pt-3 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500">
            <span>JT OBRAS E MANUTENÇÕES LTDA - CNPJ: 63.243.791/0001-09</span>
            <span>Rua Tommaso Giordani, 371 vila Guacuri – SP Cep- 04.475-210</span>
            <span className="print:block hidden">Página 1</span>
          </footer>
        </div>
      </div>
    </div>
  )
}
