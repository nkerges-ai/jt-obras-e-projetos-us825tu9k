import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Project, getProjects } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Construction, ClipboardList } from 'lucide-react'
import logo from '@/assets/logotipo-c129e.jpg'

export default function PublicGallery() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const projects = getProjects()
    const found = projects.find((p) => p.id === id)
    if (found) setProject(found)
  }, [id])

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
        <h1 className="text-2xl font-bold mb-2">Projeto não encontrado</h1>
        <p className="text-muted-foreground mb-6">
          O link que você acessou pode estar expirado ou incorreto.
        </p>
        <Button asChild>
          <Link to="/">Voltar ao Início</Link>
        </Button>
      </div>
    )
  }

  const antes = project.photos.filter((p) => p.type === 'Antes')
  const depois = project.photos.filter((p) => p.type === 'Depois')

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <img src={logo} alt="JT Obras" className="h-10 object-contain" />
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Voltar ao Site
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-brand-orange/10 rounded-full mb-4">
            <Construction className="h-8 w-8 text-brand-orange" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand-navy mb-2">
            Acompanhamento da Obra
          </h1>
          <p className="text-lg text-muted-foreground font-medium">{project.name}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border shadow-sm text-sm font-medium text-gray-700">
            Status Atual:{' '}
            <span className="text-brand-orange font-bold uppercase tracking-wider">
              {project.status}
            </span>
          </div>
        </div>

        {project.reports && project.reports.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-full bg-brand-light flex items-center justify-center font-bold text-white shadow-sm">
                <ClipboardList className="h-4 w-4" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">Relatórios Recentes</h2>
            </div>
            <div className="space-y-6">
              {project.reports
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((report, index) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 border-b pb-4">
                      <h3 className="font-bold text-lg text-brand-navy">
                        Relatório #{project.reports!.length - index}{' '}
                        <span className="font-normal text-muted-foreground ml-2 text-base">
                          • {new Date(report.date).toLocaleDateString('pt-BR')}
                        </span>
                      </h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
                        Progresso: {report.progress}%
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-6 text-sm md:text-base leading-relaxed bg-gray-50 p-4 rounded-lg border">
                      {report.summary}
                    </p>
                    {report.photos && report.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {report.photos.map((photo, i) => (
                          <div
                            key={i}
                            className="aspect-square rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-all"
                          >
                            <img
                              src={photo}
                              alt="Evidência"
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </section>
        )}

        {(antes.length > 0 || depois.length > 0) && (
          <div className="space-y-16 mt-12 border-t pt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-brand-navy">Galeria Completa de Evolução</h2>
            </div>
            {antes.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">Antes do Projeto</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {antes.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl overflow-hidden shadow-md aspect-square bg-white p-2 border"
                    >
                      <img
                        src={p.url}
                        alt="Antes"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {depois.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-brand-orange flex items-center justify-center font-bold text-white">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy">Evolução / Concluído</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {depois.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl overflow-hidden shadow-lg aspect-square bg-white p-2 border-2 border-brand-orange/20 relative group"
                    >
                      <img
                        src={p.url}
                        alt="Depois"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-navy shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" /> Atual
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {project.photos.length === 0 && (!project.reports || project.reports.length === 0) && (
          <div className="text-center py-20 bg-white rounded-2xl border shadow-sm mt-8">
            <p className="text-muted-foreground text-lg">
              Os registros e relatórios deste projeto estarão disponíveis em breve.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
