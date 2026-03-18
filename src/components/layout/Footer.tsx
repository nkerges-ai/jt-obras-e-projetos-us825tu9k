import { MapPin, Phone, Mail, Instagram, Linkedin, Facebook, MessageCircle } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '@/assets/logotipo-c129e.jpg'

const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export function Footer() {
  const currentYear = new Date().getFullYear()
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('/#')) {
      e.preventDefault()
      const targetId = href.replace('/#', '')
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          const element = document.getElementById(targetId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 100)
      } else {
        const element = document.getElementById(targetId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 text-brand-light">JT Obras e manutenções ltda</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Especialistas em obras complexas, reformas comerciais e manutenções com rígido padrão
              de segurança e excelência.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="text-gray-300 hover:text-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-brand-orange transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-brand-orange transition-colors"
                aria-label="TikTok"
              >
                <TikTokIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-brand-orange transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-light">Links Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Exemplos de Obras
                </Link>
              </li>
              <li>
                <a
                  href="/#sobre"
                  onClick={(e) => handleNavClick(e, '/#sobre')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Sobre Nós
                </a>
              </li>
              <li>
                <a
                  href="/#faq"
                  onClick={(e) => handleNavClick(e, '/#faq')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Dúvidas (FAQ)
                </a>
              </li>
              <li>
                <a
                  href="/#contato"
                  onClick={(e) => handleNavClick(e, '/#contato')}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-light">Especialidades</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 text-sm">Reformas Comerciais</li>
              <li className="text-gray-300 text-sm">Manutenção Predial</li>
              <li className="text-gray-300 text-sm">Adequação NR 10 e NR 35</li>
              <li className="text-gray-300 text-sm">Projetos Estruturais</li>
              <li className="text-gray-300 text-sm">Gestão de Obras</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-brand-light">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-brand-orange shrink-0 mt-0.5" size={18} />
                <span className="text-gray-300 text-sm">
                  Rua Tommaso Giordani, 371, Vila Guacuri
                  <br />
                  São Paulo – SP, CEP 04.475-210
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="text-brand-orange shrink-0 mt-0.5" size={18} />
                <div className="flex flex-col gap-2">
                  <a
                    href="https://wa.me/5511940037545"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-brand-orange transition-colors text-sm group"
                  >
                    <MessageCircle
                      size={14}
                      className="text-brand-light group-hover:text-brand-orange"
                    />
                    <span>Joel Nascimento: +55 11 94003-7545</span>
                  </a>
                  <a
                    href="https://wa.me/5511947069293"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-300 hover:text-brand-orange transition-colors text-sm group"
                  >
                    <MessageCircle
                      size={14}
                      className="text-brand-light group-hover:text-brand-orange"
                    />
                    <span>Tatiana (Financeiro): +55 11 94706-9293</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-brand-orange shrink-0" size={18} />
                <span className="text-gray-300 text-sm">jt.obrasemanutencao@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Logo and Legal Data */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
            <div className="bg-white p-3 rounded shadow-sm">
              <img
                src={logo}
                alt="Logo JT Obras e manutenções ltda"
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">JT Obras e manutenções ltda</p>
              <p className="text-xs text-gray-500 mt-1">
                CNPJ: 63.243.791/0001-09 | IE: 156.392.261.116
                <br />
                Regime: Simples Nacional | Diretor: Joel Nascimento de Paula
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center md:text-right">
            &copy; {currentYear} Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
