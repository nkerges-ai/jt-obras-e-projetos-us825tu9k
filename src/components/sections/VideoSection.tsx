import { useState, useEffect } from 'react'
import { FadeIn } from '@/components/animations/FadeIn'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Play,
  HardHat,
  ShieldCheck,
  Video,
  UploadCloud,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { getSiteVideos, getFileUrl, SiteVideo } from '@/services/siteVideos'
import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'
import jtLogo from '@/assets/logotipo-c129e.jpg'

// Vídeos / vitrine inicial de obras reais em execução
const fallbackVideos: Array<{
  id: string
  title: string
  category: string
  description: string
  videoUrl?: string
  poster: string
  duration?: string
  statusLabel: string
}> = [
  {
    id: 'demo-1',
    title: 'Montagem de cobertura metálica industrial',
    category: 'Galpões & Estruturas',
    description: 'Içamento de tesouras e fixação de telhas termoacústicas em galpão logístico.',
    poster:
      'https://img.usecurling.com/p/800/450?q=industrial%20steel%20structure%20warehouse%20construction',
    duration: '0:45',
    statusLabel: 'Obra em andamento',
  },
  {
    id: 'demo-2',
    title: 'Reforma e reforço estrutural de laje comercial',
    category: 'Reformas Corporativas',
    description: 'Tratamento de ferragens, nivelamento de piso e adequação de layout.',
    poster:
      'https://img.usecurling.com/p/800/450?q=commercial%20concrete%20building%20construction%20site',
    duration: '1:10',
    statusLabel: 'Fase de alvenaria',
  },
  {
    id: 'demo-3',
    title: 'Montagem de estrutura em madeira e deck comercial',
    category: 'Decks & Estruturas',
    description: 'Fixação de vigamento reforçado e assentamento de deck para área de convivência.',
    poster: 'https://img.usecurling.com/p/800/450?q=heavy%20timber%20framing%20deck%20construction',
    duration: '0:55',
    statusLabel: 'Obra em andamento',
  },
  {
    id: 'demo-4',
    title: 'Instalação de rede de dutos de exaustão industrial',
    category: 'Sistemas Industriais',
    description:
      'Fixação de linha de dutos em aço galvanizado e acoplamento do exaustor centrífugo.',
    poster:
      'https://img.usecurling.com/p/800/450?q=industrial%20ductwork%20ventilation%20installation',
    duration: '1:20',
    statusLabel: 'Montagem técnica',
  },
]

export function VideoSection() {
  const [dbVideos, setDbVideos] = useState<SiteVideo[]>([])
  const [selectedVideo, setSelectedVideo] = useState<{
    title: string
    category?: string
    description?: string
    videoSrc?: string
    poster: string
    epiHighlight?: string
  } | null>(null)

  useEffect(() => {
    let mounted = true
    getSiteVideos()
      .then((records) => {
        if (mounted && records.length > 0) {
          setDbVideos(records)
        }
      })
      .catch(() => {
        // silencioso — fallback ativo
      })
    return () => {
      mounted = false
    }
  }, [])

  // Mescla vídeos cadastrados no banco com a vitrine base
  const videoItems =
    dbVideos.length > 0
      ? dbVideos.map((v) => {
          // Limpa textos forçados caso venham do banco com menção forçada
          const cleanDesc = (v.description || '')
            .replace(/uniforme\s+(da\s+)?jt/gi, 'equipe técnica')
            .replace(/epis?\s+completos?/gi, 'normas técnicas')
            .trim()

          return {
            id: v.id,
            title: v.title,
            category: v.category || 'Obra em Execução',
            description: cleanDesc || 'Registro de obra em execução com acompanhamento diário.',
            videoSrc: v.video_file ? getFileUrl(v, v.video_file) : v.video_url || undefined,
            poster: v.poster
              ? getFileUrl(v, v.poster)
              : 'https://img.usecurling.com/p/800/450?q=industrial%20steel%20structure%20warehouse%20construction',
            duration: 'Vídeo Real',
            statusLabel: 'Obra em andamento',
          }
        })
      : fallbackVideos.map((item) => ({
          ...item,
          videoSrc: item.videoUrl,
        }))

  return (
    <section id="videos" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        {/* Topo da seção: direto, vitrine limpa de obras reais */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy border border-brand-navy/15 text-xs md:text-sm font-bold mb-3">
              <Video className="h-4 w-4 text-brand-orange" />
              Canteiro de Obras em Tempo Real
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight mb-3">
              Obras em Execução
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Acompanhe a rotina dos nossos canteiros: estruturas, reformas comerciais e instalações
              industriais acontecendo na prática.
            </p>
          </FadeIn>
        </div>

        {/* Grid de Vídeos / Cards de Execução */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videoItems.map((video, index) => (
            <FadeIn key={video.id} delay={index * 0.08} direction="up">
              <Card
                className="overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer bg-white rounded-2xl flex flex-col h-full"
                onClick={() => setSelectedVideo(video)}
              >
                {/* Poster com botão de Play estilizado */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={video.poster}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Botão de play central */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-brand-orange/95 transition-all">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Categoria */}
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[11px] font-bold">
                    {video.category}
                  </div>

                  {/* Duração / Tipo */}
                  {video.duration && (
                    <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[10px] font-mono">
                      {video.duration}
                    </div>
                  )}

                  {/* Status da obra */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-brand-navy/90 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-white/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {video.statusLabel}
                  </div>
                </div>

                {/* Conteúdo textual conciso e direto */}
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-brand-navy group-hover:text-brand-orange transition-colors line-clamp-2 mb-1.5">
                      {video.title}
                    </h3>
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Registro de campo</span>
                    <span className="text-brand-orange font-bold flex items-center gap-0.5 group-hover:underline">
                      Assistir registro &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Rodapé da seção de vídeos com CTA e orientações */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-brand-orange shrink-0" />
            <span>
              <strong>Transparência total:</strong> registramos cada fase da sua obra com relatórios
              e vídeos semanais.
            </span>
          </div>
          <a
            href="https://wa.me/5511940037545?text=Ol%C3%A1!%20Gostaria%20de%20ver%20mais%20v%C3%ADdeos%20e%20fotos%20de%20obras%20recentes%20da%20JT."
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-brand-orange hover:underline shrink-0 flex items-center gap-1"
          >
            Pedir Mais Vídeos no WhatsApp &rarr;
          </a>
        </div>
      </div>

      {/* Modal / Player de Vídeo Responsivo */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-brand-navy border-slate-800 text-white">
          <DialogHeader className="p-4 md:p-6 pb-2 text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
                {selectedVideo?.category || 'Obra em Andamento'}
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Obra em andamento
              </span>
            </div>
            <DialogTitle className="text-lg md:text-2xl font-bold text-white">
              {selectedVideo?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs md:text-sm">
              {selectedVideo?.description}
            </DialogDescription>
          </DialogHeader>

          {/* Área do Player de Vídeo */}
          <div className="relative aspect-video bg-black flex items-center justify-center">
            {selectedVideo?.videoSrc ? (
              <video
                src={selectedVideo.videoSrc}
                poster={selectedVideo.poster}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              // Player de Obra em Execução
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <img
                  src={selectedVideo?.poster}
                  alt={selectedVideo?.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
                <div className="relative z-10 max-w-md bg-brand-navy/90 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <img
                      src={jtLogo}
                      alt="JT Obras"
                      className="h-8 object-contain bg-white rounded px-2 py-0.5"
                    />
                  </div>

                  <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>

                  <h4 className="font-bold text-base md:text-lg mb-1 text-white">
                    {selectedVideo?.title}
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 mb-4 leading-relaxed">
                    {selectedVideo?.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      size="sm"
                      asChild
                      className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold gap-1.5"
                    >
                      <a
                        href="https://wa.me/5511940037545?text=Ol%C3%A1!%20Gostaria%20de%20receber%20v%C3%ADdeos%20de%20obras%20recentes%20da%20JT."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        Solicitar Vídeos no WhatsApp
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedVideo(null)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé do Modal */}
          <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Execução com acompanhamento técnico e ART
            </span>
            <span className="text-[11px] text-slate-400">JT Obras e Projetos</span>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
