import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProjects, Project } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'
import logo from '@/assets/logotipo-c129e.jpg'

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

  if (!project) {
    return <div className="p-8 text-center">Carregando relatório...</div>
  }

  const profit = project.budget - totalExpenses
  const margin = project.budget > 0 ? ((profit / project.budget) * 100).toFixed(1) : '0.0'

  const antes = project.photos.filter((p) => p.type === 'Antes')
  const depois = project.photos.filter((p) => p.type === 'Depois')

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-0 z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Painel
            </Link>
          </Button>
          <Button
            onClick={() => window.print()}
            className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white"
          >
            <Printer className="h-4 w-4" /> Imprimir Documento
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-8 print:mt-0">
        <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:m-0 print:p-0">
          <div className="p-[15mm] border border-gray-400 min-h-[297mm] flex flex-col print:border-gray-800 m-[5mm] print:m-0">
            <header className="border-b-2 border-brand-orange pb-6 mb-10 flex justify-between items-end">
              <div>
                <img src={logo} alt="JT Obras" className="h-16 md:h-20 object-contain" />
              </div>
              <div className="text-right text-[11px] md:text-sm text-gray-600 space-y-0.5">
                <p className="font-bold text-brand-navy">JT Obras e Manutenções LTDA</p>
                <p>CNPJ: 63.243.791/0001-09</p>
                <p>Rua Tommaso Giordani, 371, Vila Guacuri</p>
              </div>
            </header>

            <main className="flex-1 text-gray-800 text-[14px] leading-relaxed">
              <h2 className="text-center font-bold text-xl md:text-2xl uppercase mb-8 tracking-widest text-brand-navy">
                {type === 'custos' ? 'Relatório de Custos e Insumos' : 'Resumo e Evolução da Obra'}
              </h2>

              <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg mb-8 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Nome do Projeto:</p>
                    <p className="font-bold text-brand-navy text-lg">{project.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Cliente:</p>
                    <p className="font-medium">{project.client}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Data de Início:</p>
                    <p className="font-medium">
                      {new Date(project.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold mb-1">Status Atual:</p>
                    <p className="font-medium">{project.status}</p>
                  </div>
                </div>
              </div>

              {type === 'custos' && (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="border border-gray-300 p-4 rounded-lg text-center bg-gray-50">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Orçamento Total</p>
                      <p className="font-bold text-lg text-brand-navy">
                        {formatCurrency(project.budget)}
                      </p>
                    </div>
                    <div className="border border-gray-300 p-4 rounded-lg text-center bg-gray-50">
                      <p className="text-sm font-semibold text-gray-500 mb-1">Custos Executados</p>
                      <p className="font-bold text-lg text-red-700">
                        {formatCurrency(totalExpenses)}
                      </p>
                    </div>
                    <div className="border border-gray-300 p-4 rounded-lg text-center bg-gray-50">
                      <p className="text-sm font-semibold text-gray-500 mb-1">
                        Rentabilidade Final
                      </p>
                      <p className="font-bold text-lg text-green-700">
                        {formatCurrency(profit)} ({margin}%)
                      </p>
                    </div>
                  </div>

                  {categorizedCosts.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4 text-brand-navy">
                        Resumo Contábil por Categoria
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {categorizedCosts.map((cat) => (
                          <div
                            key={cat.name}
                            className="flex justify-between border-b border-gray-200 pb-1"
                          >
                            <span className="text-gray-600">{cat.name}</span>
                            <span className="font-semibold text-brand-navy">
                              {formatCurrency(cat.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4 text-brand-navy">
                    Detalhamento de Despesas e Notas Fiscais
                  </h3>
                  {project.expenses.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 border rounded bg-gray-50">
                      Nenhuma despesa registrada no sistema.
                    </p>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-100 border-y border-gray-400">
                          <th className="py-2 px-3 font-semibold text-gray-700 text-xs border border-gray-300">
                            Data
                          </th>
                          <th className="py-2 px-3 font-semibold text-gray-700 text-xs border border-gray-300">
                            Descrição / Fornecedor
                          </th>
                          <th className="py-2 px-3 font-semibold text-gray-700 text-xs border border-gray-300">
                            Categoria
                          </th>
                          <th className="py-2 px-3 font-semibold text-gray-700 text-xs text-right border border-gray-300">
                            Valor
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.expenses.map((exp, idx) => (
                          <tr key={exp.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-2 px-3 border border-gray-300 text-gray-600 text-xs">
                              {new Date(exp.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-2 px-3 border border-gray-300 font-medium text-xs">
                              {exp.description}
                              {exp.isInvoice && (
                                <span className="block text-[10px] text-gray-500 mt-0.5">
                                  NF: {exp.invoiceNumber}
                                </span>
                              )}
                            </td>
                            <td className="py-2 px-3 border border-gray-300 text-gray-600 text-xs">
                              {exp.category || 'Outros'}
                            </td>
                            <td className="py-2 px-3 border border-gray-300 text-right text-red-600 font-medium text-sm">
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
                <div className="space-y-8">
                  {antes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4 text-brand-navy">
                        Situação Inicial (Antes)
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {antes.map((p) => (
                          <div
                            key={p.id}
                            className="aspect-square border border-gray-300 rounded-lg overflow-hidden"
                          >
                            <img src={p.url} className="w-full h-full object-cover" alt="Antes" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {depois.length > 0 && (
                    <div className="break-inside-avoid">
                      <h3 className="font-bold text-lg border-b border-gray-300 pb-2 mb-4 text-brand-navy">
                        Situação Atual / Concluído (Depois)
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {depois.map((p) => (
                          <div
                            key={p.id}
                            className="aspect-square border-2 border-brand-orange/30 rounded-lg overflow-hidden"
                          >
                            <img src={p.url} className="w-full h-full object-cover" alt="Depois" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {antes.length === 0 && depois.length === 0 && (
                    <p className="text-center text-gray-500 py-10 border rounded bg-gray-50">
                      Nenhuma foto adicionada à galeria deste projeto.
                    </p>
                  )}
                </div>
              )}
            </main>

            <footer className="mt-8 pt-4 border-t border-gray-300 flex justify-between items-center text-[9px] text-gray-500">
              <span>JT OBRAS E MANUTENÇÕES LTDA - CNPJ: 63.243.791/0001-09</span>
              <span>Rua Tommaso Giordani, 371 vila Guacuri – SP</span>
              <span className="print:block hidden">Página 1</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
