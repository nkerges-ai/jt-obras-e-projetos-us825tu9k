import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Menu, X, Lock, Phone, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import logo from '@/assets/logotipo-c129e.jpg'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`
      return
    }
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300 print:hidden',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4',
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="JT Obras e Manutenções" className="h-10 md:h-12 object-contain" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => scrollToSection('servicos')}
            className="text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
          >
            Serviços
          </button>
          <Link
            to="/portfolio"
            className="text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
          >
            Portfólio
          </Link>
          <Link
            to="/admin/clientes"
            className="text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors"
          >
            Clientes
          </Link>
        </nav>

        <div className="flex items-center gap-2 lg:gap-3">
          {/* Acesso Administrativo - Always visible */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-brand-navy hover:text-brand-orange hover:bg-orange-50 px-2 lg:px-3"
          >
            <Link to="/admin/login" title="Acesso Administrativo">
              <Lock className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">Acesso Administrativo</span>
            </Link>
          </Button>

          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-brand-navy text-brand-navy"
            >
              <Link to="/cliente/login">
                <UserCircle className="h-4 w-4 mr-2" /> Área do Cliente
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-brand-orange hover:bg-brand-orange/90 gap-2">
              <a href="https://wa.me/5511940037545" target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4" /> Solicitar Orçamento
              </a>
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-brand-navy ml-1 relative z-50 focus:outline-none focus:ring-2 focus:ring-brand-orange rounded-md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Alternar menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg animate-in slide-in-from-top-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col p-4 space-y-4">
            <button
              onClick={() => scrollToSection('servicos')}
              className="text-left text-base font-semibold text-brand-navy p-2 hover:bg-gray-50 rounded"
            >
              Serviços
            </button>
            <Link
              to="/portfolio"
              className="text-left text-base font-semibold text-brand-navy p-2 hover:bg-gray-50 rounded"
            >
              Portfólio
            </Link>
            <Link
              to="/admin/clientes"
              className="text-left text-base font-semibold text-brand-navy p-2 hover:bg-gray-50 rounded"
            >
              Clientes
            </Link>
            <Link
              to="/cliente/login"
              className="text-left text-base font-semibold text-brand-navy p-2 hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <UserCircle className="h-4 w-4" /> Área do Cliente
            </Link>
            <Button className="w-full bg-brand-orange hover:bg-brand-orange/90 gap-2" asChild>
              <a href="https://wa.me/5511940037545" target="_blank" rel="noopener noreferrer">
                <Phone className="h-4 w-4" /> Falar no WhatsApp
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
