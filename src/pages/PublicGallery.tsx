import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Project, getProjects } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Construction } from 'lucide-react'
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
            Evolução da Obra
          </h1>
          <p className="text-lg text-muted-foreground">{project.name}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border shadow-sm text-sm font-medium text-gray-700">
            Status Atual: <span className="text-brand-orange font-bold">{project.status}</span>
          </div>
        </div>

        {project.photos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
            <p className="text-muted-foreground text-lg">
              A galeria de fotos deste projeto será atualizada em breve.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {antes.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                    1
                  </div>
                  <h2 className="text-2xl font-bold text-brand-navy">Antes do Projeto</h2>
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
                  <h2 className="text-2xl font-bold text-brand-navy">Evolução / Concluído</h2>
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
      </main>
    </div>
  )
}
