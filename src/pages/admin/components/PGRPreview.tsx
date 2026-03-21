import React from 'react'
import logo from '@/assets/logotipo-c129e.jpg'
import { PGRDocument } from '@/lib/storage'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PGRPreview({ data }: { data: Partial<PGRDocument> }) {
  const getRiskColor = (nivel?: string) => {
    switch (nivel) {
      case 'Intolerável':
        return 'bg-purple-700 text-white'
      case 'Substancial':
        return 'bg-red-600 text-white'
      case 'Moderado':
        return 'bg-orange-500 text-white'
      case 'Tolerável':
        return 'bg-yellow-400 text-black'
      case 'Aceitável':
        return 'bg-green-600 text-white'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'Urgente':
        return 'text-red-700 font-bold'
      case 'Alta':
        return 'text-orange-600 font-bold'
      case 'Média':
        return 'text-blue-600 font-semibold'
      case 'Baixa':
        return 'text-gray-500'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <div className="flex-1 flex justify-center print:block print:w-full">
      <div className="bg-white shadow-xl w-full max-w-[210mm] mx-auto print:shadow-none print:m-0 print:p-0 print-page-container flex flex-col">
        <div className="p-[12mm] lg:p-[15mm] border border-gray-200 min-h-[297mm] flex flex-col flex-1 print:border-none m-[5mm] print:m-0 print:p-[10mm_15mm]">
          {/* LETTERHEAD HEADER */}
          <header className="flex justify-between items-end border-b-2 border-brand-navy pb-4 mb-6 print-header-group">
            <img src={logo} className="h-14 md:h-16 object-contain" alt="JT Obras Logo" />
            <div className="text-right text-[10px] md:text-[11px] text-gray-600 space-y-0.5">
              <p className="font-extrabold text-[13px] text-brand-navy">
                JT OBRAS E MANUTENÇÕES LTDA
              </p>
              <p>CNPJ: 63.243.791/0001-09</p>
              <p>Rua Tommaso Giordani, 371, Vila Guacuri - SP</p>
            </div>
          </header>

          <main className="flex-1 text-[11px] md:text-[12px] text-gray-800 leading-relaxed space-y-6 text-justify">
            <h1 className="font-extrabold text-center text-[15px] md:text-lg text-brand-navy leading-tight uppercase tracking-widest mb-6">
              Programa de Gerenciamento de Riscos (PGR) <br />
              <span className="text-sm font-semibold tracking-normal text-gray-600">
                Norma Regulamentadora Nº 01
              </span>
            </h1>

            {/* SECTION 1 */}
            <section className="break-inside-avoid">
              <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                1. Identificação da Empresa e Projeto
              </h2>
              <table className="w-full border-collapse border border-gray-300 text-left text-[11px]">
                <tbody>
                  <tr>
                    <th className="border border-gray-300 p-1.5 w-[25%] bg-gray-50 text-gray-600">
                      Razão Social:
                    </th>
                    <td className="border border-gray-300 p-1.5 font-bold" colSpan={3}>
                      {data.empresa || '___________________________'}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-1.5 bg-gray-50 text-gray-600">CNPJ:</th>
                    <td className="border border-gray-300 p-1.5 font-medium w-[25%]">
                      {data.cnpj || '____________________'}
                    </td>
                    <th className="border border-gray-300 p-1.5 bg-gray-50 text-gray-600 w-[20%]">
                      Data Base:
                    </th>
                    <td className="border border-gray-300 p-1.5 font-medium w-[30%]">
                      {data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '__/__/____'}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-1.5 bg-gray-50 text-gray-600">
                      Endereço (Obra/Sede):
                    </th>
                    <td className="border border-gray-300 p-1.5 font-medium" colSpan={3}>
                      {data.endereco || '___________________________'}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 p-1.5 bg-gray-50 text-gray-600">
                      Diretor Administrativo:
                    </th>
                    <td className="border border-gray-300 p-1.5 font-medium">
                      {data.diretorAdmin || '____________________'}
                    </td>
                    <th className="border border-gray-300 p-1.5 bg-gray-50 text-gray-600">
                      Responsável Técnico:
                    </th>
                    <td className="border border-gray-300 p-1.5 font-medium">
                      {data.responsavelTecnico || '____________________'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* SECTIONS 2 & 3 */}
            <section className="space-y-4">
              <div className="break-inside-avoid">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                  2. Introdução
                </h2>
                <p className="whitespace-pre-wrap">{data.introducao}</p>
              </div>
              <div className="break-inside-avoid">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                  3. Escopo de Aplicação
                </h2>
                <p className="whitespace-pre-wrap">{data.escopo}</p>
              </div>
            </section>

            {/* SECTION 4 - METHODOLOGY MATRIX */}
            <section className="break-inside-avoid mt-6">
              <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-3">
                4. Metodologia de Avaliação (Matriz de Risco)
              </h2>
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 text-[10px]">
                  <p className="mb-2">
                    A avaliação do risco ocupacional (Nível de Risco) é determinada pela combinação
                    da <strong>Severidade</strong> da possível lesão ou agravo à saúde com a{' '}
                    <strong>Probabilidade</strong> ou chance de sua ocorrência (Matriz 5x5).
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <table className="w-full border-collapse border border-gray-300 text-center">
                      <thead>
                        <tr>
                          <th colSpan={2} className="bg-gray-100 border border-gray-300 p-1">
                            Classificação de Cores
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="bg-green-600 text-white font-bold border border-gray-300 p-1 w-1/2">
                            Aceitável (1 a 4)
                          </td>
                          <td className="text-left px-2 border border-gray-300 text-[9px]">
                            Manter controles existentes.
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-yellow-400 text-black font-bold border border-gray-300 p-1">
                            Tolerável (5 a 9)
                          </td>
                          <td className="text-left px-2 border border-gray-300 text-[9px]">
                            Monitorar e padronizar.
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-orange-500 text-white font-bold border border-gray-300 p-1">
                            Moderado (10 a 14)
                          </td>
                          <td className="text-left px-2 border border-gray-300 text-[9px]">
                            Ações corretivas programadas.
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-red-600 text-white font-bold border border-gray-300 p-1">
                            Substancial (15 a 19)
                          </td>
                          <td className="text-left px-2 border border-gray-300 text-[9px]">
                            Ações urgentes requeridas.
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-purple-700 text-white font-bold border border-gray-300 p-1">
                            Intolerável (20 a 25)
                          </td>
                          <td className="text-left px-2 border border-gray-300 text-[9px]">
                            Paralisar atividade imediatamente.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 5x5 Visual Matrix */}
                <div className="shrink-0 mx-auto">
                  <table className="w-auto text-center text-[10px] border-collapse border border-gray-400">
                    <tbody>
                      <tr>
                        <td
                          rowSpan={6}
                          className="bg-gray-100 font-bold border border-gray-400 w-6"
                          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                        >
                          PROBABILIDADE
                        </td>
                        <td className="bg-gray-100 font-bold border border-gray-400 h-6 px-2 text-right">
                          5
                        </td>
                        <td className="bg-yellow-400 border border-gray-400 w-8">5</td>
                        <td className="bg-orange-500 text-white border border-gray-400 w-8">10</td>
                        <td className="bg-red-600 text-white border border-gray-400 w-8">15</td>
                        <td className="bg-purple-700 text-white border border-gray-400 w-8">20</td>
                        <td className="bg-purple-700 text-white border border-gray-400 w-8">25</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-100 font-bold border border-gray-400 h-6 px-2 text-right">
                          4
                        </td>
                        <td className="bg-green-600 text-white border border-gray-400">4</td>
                        <td className="bg-yellow-400 border border-gray-400">8</td>
                        <td className="bg-orange-500 text-white border border-gray-400">12</td>
                        <td className="bg-red-600 text-white border border-gray-400">16</td>
                        <td className="bg-purple-700 text-white border border-gray-400">20</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-100 font-bold border border-gray-400 h-6 px-2 text-right">
                          3
                        </td>
                        <td className="bg-green-600 text-white border border-gray-400">3</td>
                        <td className="bg-yellow-400 border border-gray-400">6</td>
                        <td className="bg-yellow-400 border border-gray-400">9</td>
                        <td className="bg-orange-500 text-white border border-gray-400">12</td>
                        <td className="bg-red-600 text-white border border-gray-400">15</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-100 font-bold border border-gray-400 h-6 px-2 text-right">
                          2
                        </td>
                        <td className="bg-green-600 text-white border border-gray-400">2</td>
                        <td className="bg-green-600 text-white border border-gray-400">4</td>
                        <td className="bg-yellow-400 border border-gray-400">6</td>
                        <td className="bg-yellow-400 border border-gray-400">8</td>
                        <td className="bg-orange-500 text-white border border-gray-400">10</td>
                      </tr>
                      <tr>
                        <td className="bg-gray-100 font-bold border border-gray-400 h-6 px-2 text-right">
                          1
                        </td>
                        <td className="bg-green-600 text-white border border-gray-400">1</td>
                        <td className="bg-green-600 text-white border border-gray-400">2</td>
                        <td className="bg-green-600 text-white border border-gray-400">3</td>
                        <td className="bg-green-600 text-white border border-gray-400">4</td>
                        <td className="bg-yellow-400 border border-gray-400">5</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="border-none"></td>
                        <td className="bg-gray-100 font-bold border border-gray-400 h-6">1</td>
                        <td className="bg-gray-100 font-bold border border-gray-400">2</td>
                        <td className="bg-gray-100 font-bold border border-gray-400">3</td>
                        <td className="bg-gray-100 font-bold border border-gray-400">4</td>
                        <td className="bg-gray-100 font-bold border border-gray-400">5</td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="border-none"></td>
                        <td
                          colSpan={5}
                          className="bg-gray-100 font-bold border border-gray-400 h-6 tracking-widest"
                        >
                          SEVERIDADE
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 5 - INVENTORY */}
            <section className="print-force-break-if-needed mt-6">
              <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                5. Inventário de Riscos Ocupacionais
              </h2>
              {!data.riscos || data.riscos.length === 0 ? (
                <p className="text-center py-4 text-gray-500 border border-dashed text-xs">
                  Inventário vazio.
                </p>
              ) : (
                <table className="w-full border-collapse border border-gray-400 text-left text-[10px] md:text-[11px]">
                  <thead className="print-table-header">
                    <tr className="bg-gray-200">
                      <th className="border border-gray-400 p-1.5 w-[20%]">Atividade / Processo</th>
                      <th className="border border-gray-400 p-1.5 w-[20%]">
                        Perigo (Fator de Risco)
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[15%]">Dano Potencial</th>
                      <th className="border border-gray-400 p-1.5 w-[10%] text-center leading-tight">
                        Nível de Risco
                        <br />
                        <span className="text-[9px] font-normal">(PxS)</span>
                      </th>
                      <th className="border border-gray-400 p-1.5">
                        Medidas de Controle Implementadas / Propostas
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.riscos.map((r) => (
                      <tr key={r.id} className="print-row-avoid-break">
                        <td className="border border-gray-400 p-1.5 align-top font-bold text-gray-700">
                          {r.atividade}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-top text-red-700 font-medium">
                          {r.perigo}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-top">{r.dano}</td>
                        <td className="border border-gray-400 p-1 align-middle text-center">
                          <div
                            className={cn(
                              'px-1 py-1 rounded text-[9px] font-bold',
                              getRiskColor(r.nivelRisco),
                            )}
                          >
                            {r.nivelRisco || '-'}
                          </div>
                          {r.probabilidade && r.severidade && (
                            <div className="text-[8px] text-gray-500 mt-0.5 font-bold">
                              P:{r.probabilidade} x S:{r.severidade}
                            </div>
                          )}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-top whitespace-pre-wrap leading-tight text-[10px]">
                          {r.medidas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

            {/* SECTION 6 - ACTION PLAN */}
            {data.planoAcao && data.planoAcao.length > 0 && (
              <section className="print-force-break-if-needed mt-6">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-orange text-white px-2 py-1 mb-2">
                  6. Plano de Ação (5W2H - Mitigação)
                </h2>
                <table className="w-full border-collapse border border-gray-400 text-left text-[10px] md:text-[11px]">
                  <thead className="print-table-header">
                    <tr className="bg-orange-50">
                      <th className="border border-gray-400 p-1.5 w-[35%]">
                        Ação a ser executada (What)
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[15%] text-center">
                        Prioridade
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[20%]">Responsável (Who)</th>
                      <th className="border border-gray-400 p-1.5 w-[15%] text-center">
                        Prazo (When)
                      </th>
                      <th className="border border-gray-400 p-1.5 w-[15%] text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.planoAcao.map((p) => (
                      <tr key={p.id} className="print-row-avoid-break">
                        <td className="border border-gray-400 p-1.5 align-middle font-medium">
                          {p.what}
                        </td>
                        <td
                          className={cn(
                            'border border-gray-400 p-1.5 align-middle text-center',
                            getPriorityColor(p.priority),
                          )}
                        >
                          {p.priority || 'Média'}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-middle text-[10px]">
                          {p.who}
                        </td>
                        <td className="border border-gray-400 p-1.5 align-middle text-center font-semibold text-gray-700">
                          {p.endDate ? new Date(p.endDate).toLocaleDateString('pt-BR') : '--'}
                        </td>
                        <td className="border border-gray-400 p-1 align-middle text-center font-bold">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] ${p.status === 'Concluído' ? 'bg-green-100 text-green-800' : p.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}
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

            {/* SECTIONS 7, 8, 9 */}
            <section className="space-y-4 mt-6 print:break-before-page">
              <div className="break-inside-avoid">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                  7. Gestão de Terceiros e Parceiros
                </h2>
                <p className="whitespace-pre-wrap">{data.gestaoTerceiros}</p>
              </div>
              <div className="break-inside-avoid">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                  8. Monitoramento e Revisão (Melhoria Contínua)
                </h2>
                <p className="whitespace-pre-wrap">{data.monitoramento}</p>
              </div>
              <div className="break-inside-avoid">
                <h2 className="font-bold text-[12px] md:text-[13px] uppercase bg-brand-navy text-white px-2 py-1 mb-2">
                  9. Termo de Encerramento e Responsabilidade
                </h2>
                <p className="whitespace-pre-wrap">{data.encerramento}</p>
              </div>
            </section>

            {/* SIGNATURES */}
            <section className="mt-16 text-center flex flex-row justify-between px-8 break-inside-avoid pb-8">
              <div className="w-[45%] flex flex-col items-center">
                <div className="h-16 flex items-end justify-center w-full">
                  <div className="border-t border-black w-full"></div>
                </div>
                <p className="font-bold text-xs mt-2">
                  {data.diretorAdmin || 'Joel Nascimento de Paula'}
                </p>
                <p className="text-[10px] text-gray-500 uppercase">Diretor Administrativo</p>
                <p className="text-[9px] text-gray-400">
                  {data.empresa || 'JT Obras e Manutenções'}
                </p>
              </div>

              <div className="w-[45%] flex flex-col items-center">
                <div className="h-16 flex items-end justify-center w-full relative">
                  {data.adminSignature?.type === 'govbr' ? (
                    <div className="absolute bottom-2 bg-blue-50 border border-blue-800 px-2 py-1 rounded text-[10px] font-bold text-blue-800">
                      ASSINADO GOV.BR
                    </div>
                  ) : data.adminSignature?.data ? (
                    <img
                      src={data.adminSignature.data}
                      alt="Assinatura"
                      className="absolute bottom-0 max-h-16 mix-blend-multiply"
                    />
                  ) : null}
                  <div className="border-t border-black w-full"></div>
                </div>
                <p className="font-bold text-xs mt-2">{data.responsavelTecnico || 'Eder Silva'}</p>
                <p className="text-[10px] text-gray-500 uppercase max-w-[200px] leading-tight mt-0.5">
                  {data.elaborador || 'Técnico em Segurança do Trabalho'}
                </p>
                {data.adminSignature?.biometric && (
                  <p className="text-[8px] text-green-600 flex items-center gap-1 font-bold mt-1">
                    <CheckCircle className="h-2 w-2" /> Validação Eletrônica
                  </p>
                )}
              </div>
            </section>
          </main>

          {/* LETTERHEAD FOOTER */}
          <footer className="mt-auto pt-3 border-t-2 border-brand-orange flex justify-between items-center text-[9px] text-gray-500 print-footer">
            <span>JT OBRAS E MANUTENÇÕES LTDA - CNPJ: 63.243.791/0001-09</span>
            <span className="hidden md:inline">
              Documento Oficial de Saúde e Segurança do Trabalho
            </span>
            <span className="print:block hidden page-number text-right">PGR (NR-01) - </span>
          </footer>
        </div>
      </div>
    </div>
  )
}
