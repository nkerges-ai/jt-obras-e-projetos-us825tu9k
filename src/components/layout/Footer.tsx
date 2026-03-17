import { HardHat, MapPin, Mail, Phone, Instagram, Facebook, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8" id="contato">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-white/10 p-2 rounded-lg text-accent">
                <HardHat size={28} />
              </div>
              <div className="flex flex-col">
                <span className="font-montserrat font-bold text-lg leading-tight">JT OBRAS E</span>
                <span className="font-montserrat font-bold text-sm text-accent leading-tight">
                  MANUTENÇÕES
                </span>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm mt-4">
              Excelência e segurança em obras complexas, manutenção industrial e infraestrutura.
              Especialistas em NR 10, NR 35 e NR 01.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a
                href="#"
                className="text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/#inicio"
                  className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/#sobre"
                  className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
                >
                  Sobre a Empresa
                </Link>
              </li>
              <li>
                <Link
                  to="/#servicos"
                  className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
                >
                  Nossos Serviços
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
                >
                  Portfólio de Obras
                </Link>
              </li>
              <li>
                <a
                  href="#contato"
                  className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
                >
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                <span className="text-primary-foreground/70 text-sm">
                  Rua Tommaso Giordani, 371
                  <br />
                  Vila Guacuri - São Paulo - SP
                  <br />
                  CEP: 04.475-210
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-accent shrink-0" size={18} />
                <a
                  href="mailto:jt.obrasemanutencao@gmail.com"
                  className="text-primary-foreground/70 hover:text-white text-sm break-all"
                >
                  jt.obrasemanutencao@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-accent shrink-0" size={18} />
                <a
                  href="tel:+5511940037545"
                  className="text-primary-foreground/70 hover:text-white text-sm"
                >
                  (11) 94003-7545 (WhatsApp)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-montserrat font-bold text-lg mb-4">Dados Jurídicos</h3>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <p>
                <strong className="text-white">Razão Social:</strong> JT Obras e manutenções ltda
              </p>
              <p>
                <strong className="text-white">CNPJ:</strong> 63.243.791/0001-09
              </p>
              <p>
                <strong className="text-white">Inscrição Estadual:</strong> 156.392.261.116
              </p>
              <p>
                <strong className="text-white">Diretor:</strong> Joel Nascimento
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="text-center text-primary-foreground/50 text-xs">
          <p>
            &copy; {new Date().getFullYear()} JT Obras e Manutenções. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
