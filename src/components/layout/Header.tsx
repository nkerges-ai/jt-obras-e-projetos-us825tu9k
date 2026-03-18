import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import logo from '@/assets/logotipo-c129e.jpg'
import { QuoteModal } from '@/components/sections/QuoteModal'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Projetos', href: '/portfolio' },
  { name: 'Clientes', href: '/#clientes' },
  { name: 'Sobre', href: '/#sobre' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Contato', href: '/#contato' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMobileMenuOpen(false)

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
    closeMenu()
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out bg-white border-b',
        isScrolled ? 'py-3 shadow-md border-transparent' : 'py-5 border-gray-100',
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo Placement (Header) */}
        <Link
          to="/"
          className="flex items-center gap-4 flex-shrink-0 z-50 lg:mr-16"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="JT Obras e Manutenções"
            className="w-auto object-contain transition-all duration-300 h-12 md:h-16"
          />
          <span className="font-poppins font-bold text-brand-navy text-lg md:text-xl leading-tight hidden sm:block uppercase tracking-wide">
            JT OBRAS E<br className="hidden lg:block" /> MANUTENÇÕES
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 xl:gap-10 ml-auto">
          {navLinks.map((link) => {
            const isHash = link.href.startsWith('/#')
            return isHash ? (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-semibold text-brand-navy hover:text-brand-light transition-colors duration-200"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMenu}
                className="text-sm font-semibold text-brand-navy hover:text-brand-light transition-colors duration-200"
              >
                {link.name}
              </Link>
            )
          })}
          <QuoteModal>
            <Button className="bg-brand-orange hover:bg-[#cf6d18] text-white transition-colors shadow-sm ml-2">
              Solicitar Orçamento
            </Button>
          </QuoteModal>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 p-2 text-brand-navy focus:outline-none ml-auto"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 bg-white z-40 flex flex-col pt-24 px-6 gap-6 md:hidden transition-transform duration-300 ease-in-out',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {navLinks.map((link) => {
          const isHash = link.href.startsWith('/#')
          return isHash ? (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-lg font-semibold text-brand-navy hover:text-brand-light border-b border-gray-100 pb-4"
            >
              {link.name}
            </a>
          ) : (
            <Link
              key={link.name}
              to={link.href}
              onClick={closeMenu}
              className="text-lg font-semibold text-brand-navy hover:text-brand-light border-b border-gray-100 pb-4"
            >
              {link.name}
            </Link>
          )
        })}
        <QuoteModal>
          <Button
            className="bg-brand-orange hover:bg-[#cf6d18] text-white mt-4 w-full h-12 text-lg"
            onClick={closeMenu}
          >
            Solicitar Orçamento
          </Button>
        </QuoteModal>
      </div>
    </header>
  )
}
