import React from 'react'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
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
        return 'text-brand-light font-semibold'
      case 'Baixa':
        return 'text-gray-500'
      default:
        return 'text-gray-700'
    }
  }

  return (
    <DocumentLetterhead
      title="Programa de Gerenciamento de Riscos (PGR)"
      subtitle="Norma Regulamentadora Nº 01"
    >
      <main className="text-[12px] text-gray-800 leading-relaxed space-y-6 text-justify">
        {/* SECTION 1 */}
        <section className="break-inside-avoid">
          <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-3 rounded-t-sm tracking-wider">
            1. Identificação da Empresa e Projeto
          </h2>
          <table className="w-full border-collapse border border-brand-navy/30 text-left text-[12px] shadow-sm bg-white">
            <tbody>
              <tr>
                <th className="border border-brand-navy/30 p-2.5 w-[25%] bg-brand-light/5 text-brand-navy font-bold">
                  Razão Social:
                </th>
                <td
                  className="border border-brand-navy/30 p-2.5 font-bold text-gray-900"
                  colSpan={3}
                >
                  {data.empresa || '___________________________'}
                </td>
              </tr>
              <tr>
                <th className="border border-brand-navy/30 p-2.5 bg-brand-light/5 text-brand-navy font-bold">
                  CNPJ:
                </th>
                <td className="border border-brand-navy/30 p-2.5 font-medium w-[25%]">
                  {data.cnpj || '____________________'}
                </td>
                <th className="border border-brand-navy/30 p-2.5 bg-brand-light/5 text-brand-navy font-bold w-[20%]">
                  Data Base:
                </th>
                <td className="border border-brand-navy/30 p-2.5 font-medium w-[30%]">
                  {data.date ? new Date(data.date).toLocaleDateString('pt-BR') : '__/__/____'}
                </td>
              </tr>
              <tr>
                <th className="border border-brand-navy/30 p-2.5 bg-brand-light/5 text-brand-navy font-bold">
                  Endereço:
                </th>
                <td className="border border-brand-navy/30 p-2.5 font-medium" colSpan={3}>
                  {data.endereco || '___________________________'}
                </td>
              </tr>
              <tr>
                <th className="border border-brand-navy/30 p-2.5 bg-brand-light/5 text-brand-navy font-bold">
                  Diretor:
                </th>
                <td className="border border-brand-navy/30 p-2.5 font-medium">
                  {data.diretorAdmin || '____________________'}
                </td>
                <th className="border border-brand-navy/30 p-2.5 bg-brand-light/5 text-brand-navy font-bold">
                  Resp. Técnico:
                </th>
                <td className="border border-brand-navy/30 p-2.5 font-medium">
                  {data.responsavelTecnico || '____________________'}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* SECTIONS 2 & 3 */}
        <section className="space-y-5">
          <div className="break-inside-avoid">
            <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-2 rounded-t-sm tracking-wider">
              2. Introdução
            </h2>
            <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-b-sm whitespace-pre-wrap">
              {data.introducao}
            </div>
          </div>
          <div className="break-inside-avoid">
            <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-2 rounded-t-sm tracking-wider">
              3. Escopo de Aplicação
            </h2>
            <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-b-sm whitespace-pre-wrap">
              {data.escopo}
            </div>
          </div>
        </section>

        {/* SECTION 4 - METHODOLOGY MATRIX */}
        <section className="break-inside-avoid mt-8">
          <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-4 rounded-t-sm tracking-wider">
            4. Metodologia de Avaliação (Matriz de Risco)
          </h2>
          <div className="flex flex-col lg:flex-row gap-8 items-start p-2">
            <div className="flex-1 text-[11px] leading-relaxed">
              <p className="mb-4">
                A avaliação do risco ocupacional é determinada pela combinação da{' '}
                <strong>Severidade</strong> da possível lesão à saúde com a{' '}
                <strong>Probabilidade</strong> de ocorrência (Matriz 5x5).
              </p>
              <table className="w-full border-collapse border border-gray-300 text-center shadow-sm bg-white">
                <thead>
                  <tr>
                    <th
                      colSpan={2}
                      className="bg-brand-navy text-white p-1.5 uppercase text-[10px]"
                    >
                      Classificação e Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-green-600 text-white font-bold border border-gray-300 p-1.5 w-1/2">
                      Aceitável (1 a 4)
                    </td>
                    <td className="text-left px-3 border border-gray-300 text-[10px]">
                      Manter controles existentes.
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-yellow-400 text-black font-bold border border-gray-300 p-1.5">
                      Tolerável (5 a 9)
                    </td>
                    <td className="text-left px-3 border border-gray-300 text-[10px]">
                      Monitorar e padronizar.
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-orange-500 text-white font-bold border border-gray-300 p-1.5">
                      Moderado (10 a 14)
                    </td>
                    <td className="text-left px-3 border border-gray-300 text-[10px]">
                      Ações corretivas programadas.
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-red-600 text-white font-bold border border-gray-300 p-1.5">
                      Substancial (15 a 19)
                    </td>
                    <td className="text-left px-3 border border-gray-300 text-[10px]">
                      Ações urgentes requeridas.
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-purple-700 text-white font-bold border border-gray-300 p-1.5">
                      Intolerável (20 a 25)
                    </td>
                    <td className="text-left px-3 border border-gray-300 text-[10px]">
                      Paralisar atividade imediatamente.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 5x5 Visual Matrix */}
            <div className="shrink-0 mx-auto shadow-sm">
              <table className="w-auto text-center text-[11px] border-collapse border border-gray-400 bg-white">
                <tbody>
                  <tr>
                    <td
                      rowSpan={6}
                      className="bg-brand-light/10 font-bold border border-gray-400 w-8 text-brand-navy"
                      style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                    >
                      PROBABILIDADE
                    </td>
                    <td className="bg-brand-light/10 font-bold border border-gray-400 h-8 px-3 text-right">
                      5
                    </td>
                    <td className="bg-yellow-400 border border-gray-400 w-10">5</td>
                    <td className="bg-orange-500 text-white border border-gray-400 w-10">10</td>
                    <td className="bg-red-600 text-white border border-gray-400 w-10">15</td>
                    <td className="bg-purple-700 text-white border border-gray-400 w-10">20</td>
                    <td className="bg-purple-700 text-white border border-gray-400 w-10">25</td>
                  </tr>
                  <tr>
                    <td className="bg-brand-light/10 font-bold border border-gray-400 h-8 px-3 text-right">
                      4
                    </td>
                    <td className="bg-green-600 text-white border border-gray-400">4</td>
                    <td className="bg-yellow-400 border border-gray-400">8</td>
                    <td className="bg-orange-500 text-white border border-gray-400">12</td>
                    <td className="bg-red-600 text-white border border-gray-400">16</td>
                    <td className="bg-purple-700 text-white border border-gray-400">20</td>
                  </tr>
                  <tr>
                    <td className="bg-brand-light/10 font-bold border border-gray-400 h-8 px-3 text-right">
                      3
                    </td>
                    <td className="bg-green-600 text-white border border-gray-400">3</td>
                    <td className="bg-yellow-400 border border-gray-400">6</td>
                    <td className="bg-yellow-400 border border-gray-400">9</td>
                    <td className="bg-orange-500 text-white border border-gray-400">12</td>
                    <td className="bg-red-600 text-white border border-gray-400">15</td>
                  </tr>
                  <tr>
                    <td className="bg-brand-light/10 font-bold border border-gray-400 h-8 px-3 text-right">
                      2
                    </td>
                    <td className="bg-green-600 text-white border border-gray-400">2</td>
                    <td className="bg-green-600 text-white border border-gray-400">4</td>
                    <td className="bg-yellow-400 border border-gray-400">6</td>
                    <td className="bg-yellow-400 border border-gray-400">8</td>
                    <td className="bg-orange-500 text-white border border-gray-400">10</td>
                  </tr>
                  <tr>
                    <td className="bg-brand-light/10 font-bold border border-gray-400 h-8 px-3 text-right">
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
                    <td className="bg-brand-light/10 font-bold border border-gray-400 h-8">1</td>
                    <td className="bg-brand-light/10 font-bold border border-gray-400">2</td>
                    <td className="bg-brand-light/10 font-bold border border-gray-400">3</td>
                    <td className="bg-brand-light/10 font-bold border border-gray-400">4</td>
                    <td className="bg-brand-light/10 font-bold border border-gray-400">5</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="border-none"></td>
                    <td
                      colSpan={5}
                      className="bg-brand-navy text-white font-bold border border-gray-400 h-8 tracking-widest"
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
        <section className="print:break-before-page mt-8">
          <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-4 rounded-t-sm tracking-wider">
            5. Inventário de Riscos Ocupacionais
          </h2>
          {!data.riscos || data.riscos.length === 0 ? (
            <p className="text-center py-6 text-gray-500 border border-dashed text-sm bg-gray-50">
              Inventário vazio.
            </p>
          ) : (
            <table className="w-full border-collapse border border-brand-navy/30 text-left text-[11px] bg-white shadow-sm">
              <thead className="print-table-header">
                <tr className="bg-brand-light/10 text-brand-navy">
                  <th className="border border-brand-navy/30 p-2 w-[20%]">Atividade / Processo</th>
                  <th className="border border-brand-navy/30 p-2 w-[20%]">Perigo (Fator)</th>
                  <th className="border border-brand-navy/30 p-2 w-[15%]">Dano Potencial</th>
                  <th className="border border-brand-navy/30 p-2 w-[10%] text-center">
                    Nível (PxS)
                  </th>
                  <th className="border border-brand-navy/30 p-2">Medidas de Controle</th>
                </tr>
              </thead>
              <tbody>
                {data.riscos.map((r) => (
                  <tr key={r.id} className="print-row-avoid-break even:bg-gray-50">
                    <td className="border border-brand-navy/30 p-2 align-top font-bold text-gray-800">
                      {r.atividade}
                    </td>
                    <td className="border border-brand-navy/30 p-2 align-top text-red-700 font-medium">
                      {r.perigo}
                    </td>
                    <td className="border border-brand-navy/30 p-2 align-top">{r.dano}</td>
                    <td className="border border-brand-navy/30 p-1.5 align-middle text-center">
                      <div
                        className={cn(
                          'px-1.5 py-1 rounded text-[10px] font-bold shadow-sm',
                          getRiskColor(r.nivelRisco),
                        )}
                      >
                        {r.nivelRisco || '-'}
                      </div>
                      {r.probabilidade && r.severidade && (
                        <div className="text-[9px] text-gray-600 mt-1 font-bold">
                          P:{r.probabilidade} x S:{r.severidade}
                        </div>
                      )}
                    </td>
                    <td className="border border-brand-navy/30 p-2 align-top whitespace-pre-wrap leading-relaxed">
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
          <section className="print-force-break-if-needed mt-8">
            <h2 className="font-bold text-[13px] uppercase bg-brand-light text-white px-3 py-1.5 mb-4 rounded-t-sm tracking-wider">
              6. Plano de Ação (5W2H - Mitigação)
            </h2>
            <table className="w-full border-collapse border border-brand-light/30 text-left text-[11px] bg-white shadow-sm">
              <thead className="print-table-header">
                <tr className="bg-brand-light/10 text-brand-navy">
                  <th className="border border-brand-light/30 p-2 w-[35%]">Ação (What)</th>
                  <th className="border border-brand-light/30 p-2 w-[15%] text-center">
                    Prioridade
                  </th>
                  <th className="border border-brand-light/30 p-2 w-[20%]">Responsável (Who)</th>
                  <th className="border border-brand-light/30 p-2 w-[15%] text-center">
                    Prazo (When)
                  </th>
                  <th className="border border-brand-light/30 p-2 w-[15%] text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.planoAcao.map((p) => (
                  <tr key={p.id} className="print-row-avoid-break even:bg-gray-50">
                    <td className="border border-brand-light/30 p-2 align-middle font-medium text-gray-800">
                      {p.what}
                    </td>
                    <td
                      className={cn(
                        'border border-brand-light/30 p-2 align-middle text-center',
                        getPriorityColor(p.priority),
                      )}
                    >
                      {p.priority || 'Média'}
                    </td>
                    <td className="border border-brand-light/30 p-2 align-middle">{p.who}</td>
                    <td className="border border-brand-light/30 p-2 align-middle text-center font-bold text-gray-700">
                      {p.endDate ? new Date(p.endDate).toLocaleDateString('pt-BR') : '--'}
                    </td>
                    <td className="border border-brand-light/30 p-1.5 align-middle text-center">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-bold shadow-sm ${p.status === 'Concluído' ? 'bg-green-100 text-green-800 border border-green-200' : p.status === 'Em Andamento' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}
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
        <section className="space-y-5 mt-8 print:break-before-page">
          <div className="break-inside-avoid">
            <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-2 rounded-t-sm tracking-wider">
              7. Gestão de Terceiros e Parceiros
            </h2>
            <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-b-sm whitespace-pre-wrap">
              {data.gestaoTerceiros}
            </div>
          </div>
          <div className="break-inside-avoid">
            <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-2 rounded-t-sm tracking-wider">
              8. Monitoramento e Revisão (Melhoria Contínua)
            </h2>
            <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-b-sm whitespace-pre-wrap">
              {data.monitoramento}
            </div>
          </div>
          <div className="break-inside-avoid">
            <h2 className="font-bold text-[13px] uppercase bg-brand-navy text-white px-3 py-1.5 mb-2 rounded-t-sm tracking-wider">
              9. Termo de Encerramento e Responsabilidade
            </h2>
            <div className="p-3 bg-gray-50/50 border border-gray-200 rounded-b-sm whitespace-pre-wrap font-medium">
              {data.encerramento}
            </div>
          </div>
        </section>

        {/* SIGNATURES */}
        <section className="mt-20 text-center flex flex-row justify-between px-10 break-inside-avoid pb-12">
          <div className="w-[45%] flex flex-col items-center">
            <div className="h-20 flex items-end justify-center w-full">
              <div className="border-t border-brand-navy w-full"></div>
            </div>
            <p className="font-bold text-[13px] mt-3 text-brand-navy">
              {data.diretorAdmin || 'Joel Nascimento de Paula'}
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
              Diretor Administrativo
            </p>
            <p className="text-[10px] text-brand-light font-medium mt-0.5">
              {data.empresa || 'JT Obras e Manutenções'}
            </p>
          </div>

          <div className="w-[45%] flex flex-col items-center">
            <div className="h-20 flex items-end justify-center w-full relative">
              {data.adminSignature?.type === 'govbr' ? (
                <div className="absolute bottom-2 bg-brand-light/10 border border-brand-navy px-3 py-1.5 rounded text-[10px] font-bold text-brand-navy">
                  ASSINADO GOV.BR
                </div>
              ) : data.adminSignature?.data ? (
                <img
                  src={data.adminSignature.data}
                  alt="Assinatura"
                  className="absolute bottom-0 max-h-20 mix-blend-multiply"
                />
              ) : null}
              <div className="border-t border-brand-navy w-full"></div>
            </div>
            <p className="font-bold text-[13px] mt-3 text-brand-navy">
              {data.responsavelTecnico || 'Eder Silva'}
            </p>
            <p className="text-[11px] text-gray-500 uppercase tracking-wider leading-tight mt-1">
              {data.elaborador || 'Técnico em Segurança do Trabalho'}
            </p>
            {data.adminSignature?.biometric && (
              <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold mt-2 bg-green-50 px-2 py-1 rounded">
                <CheckCircle className="h-3 w-3" /> Validação Eletrônica
              </p>
            )}
          </div>
        </section>
      </main>
    </DocumentLetterhead>
  )
}
