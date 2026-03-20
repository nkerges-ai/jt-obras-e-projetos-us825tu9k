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

    // Optional: auto trigger print
    // const timer = setTimeout(() => window.print(), 500)
    // return () => clearTimeout(timer)
  }, [id])

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const totalExpenses = useMemo(() => {
    if (!project) return 0
    return project.expenses.reduce((acc, curr) => acc + curr.cost, 0)
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
          <Button onClick={() => window.print()} className="gap-2">
            <Printer className="h-4 w-4" /> Imprimir Documento
          </Button>
        </div>
      </div>

      <div className="flex justify-center mt-8 print:mt-0">
        <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] relative print:shadow-none print:m-0 print:p-0 overflow-hidden">
          <div className="p-[20mm] pb-0">
            <header className="border-b-2 border-brand-orange pb-6 mb-10 flex justify-between items-end">
              <div>
                <img src={logo} alt="JT Obras" className="h-16 md:h-20 object-contain" />
              </div>
              <div className="text-right text-xs md:text-sm text-gray-600 space-y-0.5">
                <p className="font-bold text-brand-navy">JT Obras e Manutenções LTDA</p>
                <p>CNPJ: 63.243.791/0001-09</p>
                <p>Rua Tommaso Giordani, 371, Vila Guacuri</p>
                <p>São Paulo – SP, CEP 04.475-210</p>
              </div>
            </header>
          </div>

          <main className="px-[20mm] pb-[30mm] text-gray-800 text-[14px] leading-relaxed">
            <h2 className="text-center font-bold text-xl md:text-2xl uppercase mb-8 tracking-widest text-brand-navy">
              {type === 'custos' ? 'Relatório de Custos e Insumos' : 'Resumo e Evolução da Obra'}
            </h2>

            <div className="bg-gray-50 border p-4 rounded-lg mb-8 text-sm">
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
                  <div className="border border-gray-200 p-4 rounded-lg text-center bg-gray-50">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Orçamento Total</p>
                    <p className="font-bold text-lg text-brand-navy">
                      {formatCurrency(project.budget)}
                    </p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg text-center bg-gray-50">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Custos Executados</p>
                    <p className="font-bold text-lg text-red-700">
                      {formatCurrency(totalExpenses)}
                    </p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg text-center bg-gray-50">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Rentabilidade Final</p>
                    <p className="font-bold text-lg text-green-700">
                      {formatCurrency(profit)} ({margin}%)
                    </p>
                  </div>
                </div>

                <h3 className="font-bold text-lg border-b pb-2 mb-4 text-brand-navy">
                  Detalhamento de Despesas
                </h3>
                {project.expenses.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 border rounded bg-gray-50">
                    Nenhuma despesa registrada no sistema.
                  </p>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-y border-gray-300">
                        <th className="py-3 px-4 font-semibold text-gray-600">Data</th>
                        <th className="py-3 px-4 font-semibold text-gray-600">
                          Descrição do Serviço / Material
                        </th>
                        <th className="py-3 px-4 font-semibold text-gray-600 text-right">
                          Valor Registrado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.expenses.map((exp, idx) => (
                        <tr key={exp.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-3 px-4 border-b text-gray-500">
                            {new Date(exp.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="py-3 px-4 border-b font-medium">{exp.description}</td>
                          <td className="py-3 px-4 border-b text-right text-red-600 font-medium">
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
                    <h3 className="font-bold text-lg border-b pb-2 mb-4 text-brand-navy">
                      Situação Inicial (Antes)
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {antes.map((p) => (
                        <div key={p.id} className="aspect-square border rounded-lg overflow-hidden">
                          <img src={p.url} className="w-full h-full object-cover" alt="Antes" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {depois.length > 0 && (
                  <div className="break-inside-avoid">
                    <h3 className="font-bold text-lg border-b pb-2 mb-4 text-brand-navy">
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

          <footer className="absolute bottom-[10mm] left-[20mm] right-[20mm] border-t border-brand-orange/30 pt-4 text-center text-xs text-brand-navy">
            <p className="font-semibold">
              jt.obrasemanutencao@gmail.com | (11) 94003-7545 | (11) 94706-9293
            </p>
            <p className="mt-1 text-gray-500 font-medium">
              Relatório gerado eletronicamente pelo Sistema JT Obras em{' '}
              {new Date().toLocaleDateString('pt-BR')}
            </p>
          </footer>
        </div>
      </div>
    </div>
  )
}
