import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProjects, Project } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'

export default function PrintReport() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const projects = getProjects()
    const found = projects.find((p) => p.id === id)
    if (found) setProject(found)
  }, [id])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const totalExpenses = useMemo(() => {
    if (!project) return 0
    return project.expenses.reduce((acc, curr) => acc + curr.cost, 0)
  }, [project])

  const categorizedCosts = useMemo(() => {
    if (!project) return []
    const categories = [
      'Mão de Obra',
      'Matéria Prima',
      'Locação de Equipamentos',
      'Administrativo',
      'Outros',
    ]
    return categories
      .map((cat) => ({
        name: cat,
        total: project.expenses
          .filter((e) => (e.category || 'Outros') === cat)
          .reduce((acc, curr) => acc + curr.cost, 0),
      }))
      .filter((c) => c.total > 0)
  }, [project])

  if (!project)
    return <div className="p-8 text-center text-brand-navy font-bold">Carregando relatório...</div>

  const profit = project.budget - totalExpenses
  const margin = project.budget > 0 ? ((profit / project.budget) * 100).toFixed(1) : '0.0'
  const antes = project.photos.filter((p) => p.type === 'Antes')
  const depois = project.photos.filter((p) => p.type === 'Depois')

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-0 z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2 text-brand-navy">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
            </Link>
          </Button>
          <Button
            onClick={() => window.print()}
            className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white"
          >
            <Printer className="h-4 w-4" /> Imprimir Relatório
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-8 print:mt-0">
        <DocumentLetterhead
          title={type === 'custos' ? 'Relatório de Custos e Insumos' : 'Resumo e Evolução da Obra'}
        >
          <div className="bg-gray-50 border border-brand-navy/20 p-5 rounded-lg mb-8 text-sm shadow-sm text-gray-800">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Nome do Projeto:
                </p>
                <p className="font-bold text-brand-navy text-lg leading-tight">{project.name}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Cliente:
                </p>
                <p className="font-semibold text-base">{project.client}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Data de Início:
                </p>
                <p className="font-medium text-base">
                  {new Date(project.startDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Status Atual:
                </p>
                <p className="font-medium text-base text-brand-light">{project.status}</p>
              </div>
            </div>
          </div>

          {type === 'custos' && (
            <>
              <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="border border-gray-200 p-5 rounded-xl text-center bg-white shadow-sm">
                  <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
                    Orçamento Total
                  </p>
                  <p className="font-black text-xl text-brand-navy">
                    {formatCurrency(project.budget)}
                  </p>
                </div>
                <div className="border border-red-100 p-5 rounded-xl text-center bg-red-50/50 shadow-sm">
                  <p className="text-xs font-bold text-red-600/70 mb-2 uppercase tracking-wider">
                    Custos Executados
                  </p>
                  <p className="font-black text-xl text-red-700">{formatCurrency(totalExpenses)}</p>
                </div>
                <div className="border border-green-100 p-5 rounded-xl text-center bg-green-50/50 shadow-sm">
                  <p className="text-xs font-bold text-green-600/70 mb-2 uppercase tracking-wider">
                    Rentabilidade Final
                  </p>
                  <p className="font-black text-xl text-green-700">
                    {formatCurrency(profit)}{' '}
                    <span className="text-sm font-medium">({margin}%)</span>
                  </p>
                </div>
              </div>

              {categorizedCosts.length > 0 && (
                <div className="mb-10 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-base border-b border-gray-200 pb-3 mb-4 text-brand-navy uppercase tracking-wider">
                    Resumo Contábil por Categoria
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                    {categorizedCosts.map((cat) => (
                      <div
                        key={cat.name}
                        className="flex justify-between border-b border-gray-100 pb-2"
                      >
                        <span className="text-gray-600 font-medium">{cat.name}</span>
                        <span className="font-bold text-brand-navy">
                          {formatCurrency(cat.total)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="font-bold text-base border-b-2 border-brand-navy/20 pb-2 mb-4 text-brand-navy uppercase tracking-wider">
                Detalhamento de Despesas (Notas Fiscais)
              </h3>
              {project.expenses.length === 0 ? (
                <p className="text-center text-gray-500 py-6 border rounded bg-gray-50 text-sm">
                  Nenhuma despesa registrada.
                </p>
              ) : (
                <table className="w-full text-left border-collapse text-[12px] shadow-sm">
                  <thead>
                    <tr className="bg-brand-navy text-white">
                      <th className="py-2.5 px-3 font-semibold border border-brand-navy/30">
                        Data
                      </th>
                      <th className="py-2.5 px-3 font-semibold border border-brand-navy/30">
                        Descrição / Fornecedor
                      </th>
                      <th className="py-2.5 px-3 font-semibold border border-brand-navy/30">
                        Categoria
                      </th>
                      <th className="py-2.5 px-3 font-semibold text-right border border-brand-navy/30">
                        Valor (R$)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.expenses.map((exp, idx) => (
                      <tr key={exp.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2.5 px-3 border border-gray-200 text-gray-600">
                          {new Date(exp.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 font-medium text-brand-navy">
                          {exp.description}
                          {exp.isInvoice && (
                            <span className="inline-block ml-2 text-[9px] text-brand-light font-bold bg-brand-light/10 px-1.5 py-0.5 rounded border border-brand-light/20">
                              NF: {exp.invoiceNumber}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 text-gray-600">
                          {exp.category || 'Outros'}
                        </td>
                        <td className="py-2.5 px-3 border border-gray-200 text-right text-red-600 font-bold">
                          {formatCurrency(exp.cost)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {type === 'resumo' && (
            <div className="space-y-10">
              {antes.length > 0 && (
                <div>
                  <h3 className="font-bold text-base border-b-2 border-gray-300 pb-2 mb-4 text-gray-600 uppercase tracking-wider">
                    Situação Inicial (Antes)
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {antes.map((p) => (
                      <div
                        key={p.id}
                        className="aspect-square border-4 border-white shadow-md rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img src={p.url} className="w-full h-full object-cover" alt="Antes" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {depois.length > 0 && (
                <div className="break-inside-avoid pt-6">
                  <h3 className="font-bold text-base border-b-2 border-brand-light pb-2 mb-4 text-brand-navy uppercase tracking-wider">
                    Situação Atual / Concluído (Depois)
                  </h3>
                  <div className="grid grid-cols-3 gap-6">
                    {depois.map((p) => (
                      <div
                        key={p.id}
                        className="aspect-square border-4 border-brand-light/20 shadow-lg rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img src={p.url} className="w-full h-full object-cover" alt="Depois" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {antes.length === 0 && depois.length === 0 && (
                <p className="text-center text-gray-500 py-16 border-2 border-dashed rounded-xl bg-gray-50 text-base">
                  Nenhuma fotografia adicionada à galeria deste projeto até o momento.
                </p>
              )}
            </div>
          )}
        </DocumentLetterhead>
      </div>
    </div>
  )
}
