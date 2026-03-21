import { Link } from 'react-router-dom'
import { HardHat, Facebook, Instagram, Linkedin, ShieldCheck } from 'lucide-react'
import logo from '@/assets/logotipo-c129e.jpg'

export function Footer() {
  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="space-y-6">
            <div className="bg-white p-2 rounded-lg inline-block">
              <img src={logo} alt="JT Obras" className="h-12 object-contain" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Excelência e segurança em manutenção predial, industrial e soluções corporativas desde
              a fundação.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
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
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <HardHat className="h-5 w-5 text-brand-orange" />
              Nossos Serviços
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a href="/#servicos" className="hover:text-brand-orange transition-colors">
                  Manutenção de Fachadas
                </a>
              </li>
              <li>
                <a href="/#servicos" className="hover:text-brand-orange transition-colors">
                  Climatização e AC
                </a>
              </li>
              <li>
                <a href="/#servicos" className="hover:text-brand-orange transition-colors">
                  Instalações Elétricas
                </a>
              </li>
              <li>
                <a href="/#servicos" className="hover:text-brand-orange transition-colors">
                  Reformas Estruturais
                </a>
              </li>
              <li>
                <a href="/#servicos" className="hover:text-brand-orange transition-colors">
                  Laudos e Vistorias (NRs)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-orange" />
              Institucional
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <a href="/#sobre" className="hover:text-brand-orange transition-colors">
                  Sobre a Empresa
                </a>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-brand-orange transition-colors">
                  Portfólio de Obras
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-orange transition-colors">
                  Acesso Administrativo
                </Link>
              </li>
              <li>
                <Link to="/cliente/login" className="hover:text-brand-orange transition-colors">
                  Portal do Cliente
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6">Contato Rápido</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li>
                <strong className="block text-white mb-1">Diretoria Técnica</strong>
                <a href="https://wa.me/5511940037545" className="hover:text-brand-orange">
                  (11) 94003-7545 (Joel)
                </a>
              </li>
              <li>
                <strong className="block text-white mb-1">Comercial / Administrativo</strong>
                <a href="https://wa.me/5511947069293" className="hover:text-brand-orange">
                  (11) 94706-9293 (Tatiana)
                </a>
              </li>
              <li>
                <strong className="block text-white mb-1">E-mail Corporativo</strong>
                <a href="mailto:jt.obrasemanutencao@gmail.com" className="hover:text-brand-orange">
                  jt.obrasemanutencao@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} JT Obras e Manutenções LTDA. Todos os direitos reservados.
          </p>
          <p>CNPJ: 63.243.791/0001-09</p>
        </div>
      </div>
    </footer>
  )
}
