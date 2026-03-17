import { FadeIn } from '@/components/animations/FadeIn'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

const CLIENTS = [
  { name: 'ETEC', url: 'https://img.usecurling.com/i?q=school&shape=outline&color=blue' },
  { name: 'SESI', url: 'https://img.usecurling.com/i?q=industry&shape=outline&color=red' },
  { name: 'SENAI', url: 'https://img.usecurling.com/i?q=education&shape=outline&color=red' },
  {
    name: 'Prefeitura de São Bernardo',
    url: 'https://img.usecurling.com/i?q=government&shape=outline&color=blue',
  },
  {
    name: 'Condomínios de Alto Padrão',
    url: 'https://img.usecurling.com/i?q=building&shape=outline&color=black',
  },
]

export function Clients() {
  return (
    <section id="clientes" className="py-24 bg-white">
      <div className="container px-4">
        <FadeIn className="text-center mb-16">
          <h2 className="text-heading text-3xl md:text-4xl mb-4">Empresas que Confiam em Nós</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nosso histórico de sucesso é construído sobre parcerias sólidas com grandes
            instituições.
          </p>
        </FadeIn>

        <FadeIn delay={200}>
          <div className="px-12 relative">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {CLIENTS.map((client, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <div className="p-6 h-32 flex items-center justify-center border rounded-xl bg-slate-50 group hover:border-primary/50 transition-colors">
                      <div className="flex flex-col items-center gap-3 opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                        <img
                          src={client.url}
                          alt={`Logo ${client.name}`}
                          className="h-12 w-auto object-contain"
                        />
                        <span className="text-xs font-medium text-center text-slate-600 font-montserrat">
                          {client.name}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4 bg-white hover:bg-slate-100" />
              <CarouselNext className="hidden md:flex -right-4 bg-white hover:bg-slate-100" />
            </Carousel>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
