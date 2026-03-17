import { FadeIn } from '@/components/animations/FadeIn'

const clients = [
  {
    name: 'Empresa A',
    logo: 'https://img.usecurling.com/i?q=corporate%20logo&shape=outline&color=gray',
  },
  {
    name: 'Empresa B',
    logo: 'https://img.usecurling.com/i?q=tech%20company%20logo&shape=outline&color=gray',
  },
  {
    name: 'Empresa C',
    logo: 'https://img.usecurling.com/i?q=industrial%20logo&shape=outline&color=gray',
  },
  {
    name: 'Empresa D',
    logo: 'https://img.usecurling.com/i?q=retail%20logo&shape=outline&color=gray',
  },
  {
    name: 'Empresa E',
    logo: 'https://img.usecurling.com/i?q=healthcare%20logo&shape=outline&color=gray',
  },
  {
    name: 'Empresa F',
    logo: 'https://img.usecurling.com/i?q=logistics%20logo&shape=outline&color=gray',
  },
]

export function Clients() {
  return (
    <section id="clientes" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <FadeIn>
            <h2 className="text-brand-orange font-bold tracking-wider uppercase text-sm mb-2">
              Quem Confia em Nós
            </h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-brand-navy">Nossos Clientes</h3>
          </FadeIn>
        </div>

        <FadeIn delay={0.2} className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity duration-500">
            {clients.map((client, index) => (
              <div
                key={index}
                className="w-32 h-20 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
              >
                <img
                  src={client.logo}
                  alt={`Logo ${client.name}`}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
