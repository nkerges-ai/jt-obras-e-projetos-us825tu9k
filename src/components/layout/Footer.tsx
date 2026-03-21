import { Link } from 'react-router-dom'
import logo from '@/assets/logotipo-c129e.jpg'
import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 print:hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img src={logo} alt="JT Obras" className="h-12 object-contain" />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Especialistas em manutenção predial e obras complexas. Segurança, qualidade e
              conformidade técnica para o seu projeto.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-brand-orange inline-block rounded-full"></span> Links
              Rápidos
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-brand-orange transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <a
                  href="/#servicos"
                  className="text-gray-300 hover:text-brand-orange transition-colors"
                >
                  Serviços
                </a>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-gray-300 hover:text-brand-orange transition-colors"
                >
                  Portfólio de Obras
                </Link>
              </li>
              <li>
                <Link
                  to="/cliente/login"
                  className="text-gray-300 hover:text-brand-orange transition-colors"
                >
                  Portal do Cliente
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-gray-300 hover:text-brand-orange transition-colors"
                >
                  Área Restrita (Admin)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-brand-orange inline-block rounded-full"></span> Nossos
              Serviços
            </h4>
            <ul className="space-y-3">
              <li className="text-gray-300">Manutenção de Fachadas</li>
              <li className="text-gray-300">Limpeza e Manutenção de Ar Condicionado</li>
              <li className="text-gray-300">Elétrica e Hidráulica Comercial</li>
              <li className="text-gray-300">Alvenaria e Reformas Estruturais</li>
              <li className="text-gray-300">Gestão de NRs (PGR, OS)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-brand-orange inline-block rounded-full"></span> Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <MapPin className="h-5 w-5 text-brand-orange shrink-0 mt-0.5" />
                <span className="text-sm">
                  Rua Tommaso Giordani, 371, Vila Guacuri
                  <br />
                  São Paulo - SP, CEP 04475-210
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Phone className="h-5 w-5 text-brand-orange shrink-0" />
                <span className="text-sm">
                  (11) 94003-7545
                  <br />
                  (11) 94706-9293
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <Mail className="h-5 w-5 text-brand-orange shrink-0" />
                <span className="text-sm break-all">jt.obrasemanutencao@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 gap-4">
          <p>
            © {new Date().getFullYear()} JT Obras e Manutenções LTDA. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">
              Termos de Uso
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Política de Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
