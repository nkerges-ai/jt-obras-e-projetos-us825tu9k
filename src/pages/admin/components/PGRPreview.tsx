import React from 'react'
import logo from '@/assets/logotipo-c129e.jpg'
import { PGRDocument } from '@/lib/storage'
import { CheckCircle } from 'lucide-react'

export function PGRPreview({ data }: { data: Partial<PGRDocument> }) {
  return (
    <div className="flex-1 flex justify-center print:block print:w-full">
      <div className="bg-white shadow-xl w-full max-w-[210mm] mx-auto print:shadow-none print:m-0 print:p-0 print-page-container flex flex-col">
        <div className="p-[12mm] lg:p-[15mm] border border-gray-400 min-h-[297mm] flex flex-col flex-1 print:border-none m-[5mm] print:m-0 print:p-[10mm_15mm]">
          <header className="flex justify-between items-center border-b-2 border-brand-navy pb-4 mb-6 print-header-group">
            <img src={logo} className="h-10 md:h-12 object-contain" alt="JT Obras Logo" />
            <div className="text-right">
              <h1 className="font-extrabold text-[15px] md:text-lg text-brand-navy leading-tight">
                PROGRAMA DE GERENCIAMENTO DE RISCOS
              </h1>
              <p className="font-semibold text-xs md:text-sm mt-0.5 text-gray-600">
                Segurança e Saúde no Trabalho - NR-01
              </p>
            </div>
          </header>

          <main className="flex-1 text-[11px] md:text-[12px] text-gray-800 leading-relaxed space-y-6">
            <section className="border border-gray-300 rounded p-3 bg-gray-50/50 break-inside-avoid">
              <h2 className="font-bold text-[11px] md:text-[12px] uppercase border-b border-gray-300 pb-1 mb-2 text-brand-navy">
                1. Identificação da Empresa e Escopo
              </h2>
              <div className="grid grid-cols-2 gap-y-2">
                <p>
                  <strong className="text-gray-600">Razão Social:</strong>
                  <br />
                  <span className="font-semibold text-sm">
                    {data.empresa || '___________________________'}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">CNPJ:</strong>
                  <br />
                  <span className="font-semibold text-sm">
                    {data.cnpj || '____________________'}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-600">Data de Emissão:</strong>
                  <br />
                  {data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '__/__/____'}
                </p>
                <p>
                  <strong className="text-gray-600">Responsável Técnico / Emissor:</strong>
                  <br />
                  {data.elaborador || '___________________________'}
                </p>
              </div>
            </section>

            <section>
              <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                2. Matriz de Avaliação e Inventário de Riscos Ocupacionais
              </h2>
              <div className="text-[9px] text-gray-500 mb-2 px-1 border-l-2 border-brand-orange ml-1">
                <strong>Metodologia de Matriz de Risco:</strong> A avaliação considera a combinação
                entre a Probabilidade (Baixa, Média, Alta) de ocorrência do evento e a Severidade
                (Baixa, Média, Alta) da lesão ou agravo, resultando no Nível de Risco (Baixo, Médio,
                Alto, Crítico) para priorização das ações.
              </div>

              {!data.riscos || data.riscos.length === 0 ? (
                <p className="text-center py-6 text-gray-500 border border-dashed text-xs">
                  Nenhum risco cadastrado na matriz.
                </p>
              ) : (
                <table className="w-full border-collapse border border-gray-400 text-left text-[10px] md:text-[11px]">
                  <thead className="print-table-header">
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 p-1.5 w-[20%]">Atividade / Fonte</th>
                      <th className="border border-gray-400 p-1.5 w-[18%]">
                        Perigo (Risco) e Dano
                      </th>
                      <th
                        className="border border-gray-400 p-1 text-center w-[6%]"
                        title="Probabilidade"
                      >
                        P
                      </th>
                      <th
                        className="border border-gray-400 p-1 text-center w-[6%]"
                        title="Severidade"
                      >
                        S
                      </th>
                      <th className="border border-gray-400 p-1 text-center w-[8%] font-bold">
                        Nível
                      </th>
                      <th className="border border-gray-400 p-1.5">
                        Medidas de Controle (Prevenção e Proteção)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.riscos.map((r) => (
                      <tr key={r.id} className="print-row-avoid-break">
                        <td className="border border-gray-400 p-1.5 align-top font-medium text-gray-700">
                          {r.atividade}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-top">
                          <span className="font-bold text-red-700 block mb-0.5">{r.perigo}</span>
                          <span className="text-[9px] leading-tight block">Dano: {r.dano}</span>
                        </td>
                        <td className="border border-gray-400 p-1 align-middle text-center text-[9px]">
                          {r.probabilidade?.[0] || '-'}
                        </td>
                        <td className="border border-gray-400 p-1 align-middle text-center text-[9px]">
                          {r.severidade?.[0] || '-'}
                        </td>
                        <td className="border border-gray-400 p-1 align-middle text-center font-bold text-[9px]">
                          {r.nivelRisco || '-'}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-top whitespace-pre-wrap leading-tight">
                          {r.medidas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {data.planoAcao && data.planoAcao.length > 0 && (
              <section className="print-force-break-if-needed mt-4">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-orange text-white px-2 py-1 mb-2">
                  3. Plano de Ação (Mitigação e Gestão de Medidas)
                </h2>
                <table className="w-full border-collapse border border-gray-400 text-left text-[10px] md:text-[11px]">
                  <thead className="print-table-header">
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-1.5 w-[40%]">
                        Ação a ser executada / Requisito
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[20%]">Responsável</th>
                      <th className="border border-gray-400 p-1.5 w-[15%] text-center">
                        Data Início
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[15%] text-center">
                        Previsão Fim
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[10%] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.planoAcao.map((p) => (
                      <tr key={p.id} className="print-row-avoid-break">
                        <td className="border border-gray-400 p-1.5 align-middle font-medium">
                          {p.what}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-middle">{p.who}</td>
                        <td className="border border-gray-400 p-1.5 align-middle text-center">
                          {p.startDate ? new Date(p.startDate).toLocaleDateString('pt-BR') : '--'}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-middle text-center font-semibold text-gray-700">
                          {p.endDate ? new Date(p.endDate).toLocaleDateString('pt-BR') : '--'}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-middle text-center font-bold">
                          <span
                            className={`px-1 py-0.5 rounded text-[9px] ${p.status === 'Concluído' ? 'bg-green-100 text-green-800' : p.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}
                          >
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            <section className="mt-6 border border-gray-300 rounded p-3 text-justify text-[10px] md:text-[11px] text-gray-600 bg-gray-50/30 break-inside-avoid">
              <p>
                <strong>Termo de Responsabilidade:</strong> As informações contidas neste Programa
                de Gerenciamento de Riscos (PGR) foram elaboradas para o gerenciamento de Segurança
                e Saúde no Trabalho da contratada/frente de serviço. O cumprimento rigoroso das
                medidas preventivas descritas na matriz de riscos e a execução tempestiva do plano
                de ação são de caráter obrigatório, condicionando a liberação das Ordens de Serviço
                (OS) e emissão de Permissões de Trabalho (PT).
              </p>
            </section>

            <section className="mt-12 text-center w-64 mx-auto flex flex-col items-center break-inside-avoid">
              {data.adminSignature?.type === 'govbr' ? (
                <div className="flex flex-col items-center justify-center h-12 mb-2 text-center">
                  <span className="text-[10px] font-bold text-blue-800 border border-blue-800 px-2 py-1 rounded bg-blue-50">
                    ASSINADO ELETRONICAMENTE - GOV.BR
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
              <p className="font-bold text-xs">{data.elaborador || 'Responsável Técnico SST'}</p>
              <p className="text-[10px] text-gray-500 uppercase">Elaborador do PGR / Emissor</p>
              {data.adminSignature?.biometric && (
                <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold mt-1">
                  <CheckCircle className="h-3 w-3" /> Validação Emissora Confirmada (
                  {data.adminSignature.date})
                </p>
              )}
            </section>
          </main>

          <footer className="mt-auto pt-3 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500 print-footer">
            <span>JT OBRAS E MANUTENÇÕES LTDA - CNPJ: 63.243.791/0001-09</span>
            <span className="hidden md:inline">Rua Tommaso Giordani, 371 vila Guacuri – SP</span>
            <span className="print:block hidden page-number">Documento Oficial de SST</span>
          </footer>
        </div>
      </div>
    </div>
  )
}
