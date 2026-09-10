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

// Vídeos / vitrine inicial caso ainda não haja uploads no PocketBase
const fallbackVideos: Array<{
  id: string
  title: string
  category: string
  description: string
  videoUrl?: string
  poster: string
  duration?: string
  epiHighlight: string
}> = [
  {
    id: 'demo-1',
    title: 'Reforma & Alvenaria Estrutural',
    category: 'Reformas',
    description: 'Equipe JT uniformizada, com capacete, óculos e botina de segurança.',
    poster:
      'https://img.usecurling.com/p/800/450?q=construction%20workers%20ppe%20helmets%20renovation',
    duration: '0:45',
    epiHighlight: 'Uniforme JT + Capacete + Óculos',
  },
  {
    id: 'demo-2',
    title: 'Montagem de Telhado & Trabalho em Altura',
    category: 'Telhados & Coberturas',
    description: 'Execução segura em altura com cinto tipo paraquedista e linha de vida.',
    poster:
      'https://img.usecurling.com/p/800/450?q=roofers%20harness%20safety%20ppe%20construction',
    duration: '1:10',
    epiHighlight: 'NR 35 + Cinto Trava-Quedas',
  },
  {
    id: 'demo-3',
    title: 'Construção de Bangalô & Deck Nobre',
    category: 'Madeira & Estrutura',
    description: 'Cortes precisos, lixamento e fixação com luvas e proteção auricular.',
    poster: 'https://img.usecurling.com/p/800/450?q=carpenter%20building%20wooden%20deck%20patio',
    duration: '0:55',
    epiHighlight: 'EPIs de Carpintaria + Uniforme',
  },
  {
    id: 'demo-4',
    title: 'Instalação de Sistema de Exaustão',
    category: 'Exaustão & Engenharia',
    description: 'Montagem de dutos industriais e motores com supervisão de engenheiro.',
    poster:
      'https://img.usecurling.com/p/800/450?q=technician%20industrial%20ventilation%20exhaust',
    duration: '1:20',
    epiHighlight: 'Normas Industriais + ART',
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
      ? dbVideos.map((v) => ({
          id: v.id,
          title: v.title,
          category: v.category || 'Obra em Execução',
          description: v.description || 'Equipe JT Obras uniformizada e com EPIs completos.',
          videoSrc: v.video_file ? getFileUrl(v, v.video_file) : v.video_url || undefined,
          poster: v.poster
            ? getFileUrl(v, v.poster)
            : 'https://img.usecurling.com/p/800/450?q=construction%20workers%20ppe%20helmets%20renovation',
          duration: 'Vídeo Real',
          epiHighlight: 'Equipe Uniformizada + EPIs',
        }))
      : fallbackVideos.map((item) => ({
          ...item,
          videoSrc: item.videoUrl,
        }))

  return (
    <section id="videos" className="py-16 md:py-24 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6">
        {/* Topo da seção: direto, 2-4 palavras no título, foco em confiança */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-14">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navy/5 text-brand-navy border border-brand-navy/15 text-xs md:text-sm font-bold mb-3">
              <HardHat className="h-4 w-4 text-brand-orange" />
              Equipe 100% Uniformizada e com EPIs
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-brand-navy tracking-tight mb-3">
              Obras em Execução
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Veja nossos profissionais em campo: segurança rigorosa, uniformes com logo JT e padrão
              de engenharia.
            </p>
          </FadeIn>
        </div>

        {/* Badge de compromisso visual JT */}
        <FadeIn delay={0.1}>
          <div className="max-w-4xl mx-auto mb-10 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-navy to-[#133863] text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-brand-orange" />
              </div>
              <div>
                <div className="font-bold text-sm md:text-base flex items-center gap-2">
                  Padrão Visual JT Obras
                  <span className="text-[10px] uppercase font-extrabold bg-brand-orange text-white px-2 py-0.5 rounded">
                    Norma Rigorosa
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Trabalhadores devidamente identificados, crachá, uniforme com logo e EPIs
                  certificados.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-full shrink-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Segurança em 1º Lugar
            </div>
          </div>
        </FadeIn>

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

                  {/* Selo uniforme JT */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 bg-brand-navy/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/20">
                    <HardHat className="h-3 w-3 text-brand-orange" />
                    Uniforme JT
                  </div>
                </div>

                {/* Conteúdo textual conciso: 1 linha de título + 1 linha de EPI */}
                <CardContent className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm md:text-base text-brand-navy group-hover:text-brand-orange transition-colors line-clamp-1 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {video.epiHighlight}
                    </span>
                    <span className="text-brand-orange font-bold flex items-center gap-0.5 group-hover:underline">
                      Assistir
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
                {selectedVideo?.category || 'Obra JT'}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <HardHat className="h-3.5 w-3.5 text-brand-orange" />
                Uniforme & EPIs JT
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
              // Player Placeholder estilizado aguardando upload real
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden">
                <img
                  src={selectedVideo?.poster}
                  alt={selectedVideo?.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
                />
                <div className="relative z-10 max-w-md bg-brand-navy/85 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-2xl">
                  {/* Logo no uniforme JT */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <img
                      src={jtLogo}
                      alt="JT Obras"
                      className="h-8 object-contain bg-white rounded px-2 py-0.5"
                    />
                    <span className="text-xs font-bold text-brand-orange uppercase">Equipe JT</span>
                  </div>

                  <div className="h-12 w-12 rounded-full bg-brand-orange text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                    <Play className="h-5 w-5 fill-current ml-0.5" />
                  </div>

                  <h4 className="font-bold text-base md:text-lg mb-1 text-white">
                    Registro de Obra em Andamento
                  </h4>
                  <p className="text-xs md:text-sm text-slate-300 mb-4 leading-relaxed">
                    Trabalhadores devidamente identificados com uniforme da JT e EPIs regulamentares
                    (Capacete, NR 10, NR 35 e óculos).
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button
                      size="sm"
                      asChild
                      className="bg-[#25D366] hover:bg-[#20b858] text-white font-bold gap-1.5"
                    >
                      <a
                        href="https://wa.me/5511940037545?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20os%20v%C3%ADdeos%20da%20equipe%20JT%20em%20a%C3%A7%C3%A3o."
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WhatsAppIcon className="h-4 w-4" />
                        Solicitar Gravação Real
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
              Equipe treinada e uniformizada
            </span>
            <span className="text-[11px] text-slate-400">JT Obras e Projetos</span>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
