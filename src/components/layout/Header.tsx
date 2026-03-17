import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { name: 'Início', href: '/#inicio' },
  { name: 'Sobre Nós', href: '/#sobre' },
  { name: 'Serviços', href: '/#servicos' },
  { name: 'Segurança', href: '/#seguranca' },
  { name: 'Clientes', href: '/#clientes' },
  { name: 'Portfólio', href: '/portfolio' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'glassmorphism py-3 shadow-sm' : 'bg-transparent py-5',
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg text-white group-hover:bg-secondary transition-colors">
            <HardHat size={28} />
          </div>
          <div className="flex flex-col">
            <span className="text-heading text-lg leading-tight group-hover:text-secondary transition-colors">
              JT OBRAS E
            </span>
            <span className="text-heading text-sm text-accent leading-tight group-hover:text-primary transition-colors">
              MANUTENÇÕES
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors hover:underline underline-offset-4"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Button
            asChild
            className="bg-secondary hover:bg-primary text-white shadow-soft hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300"
          >
            <a href="#contato">Solicitar Orçamento</a>
          </Button>
        </nav>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            <nav className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Button asChild className="mt-4 bg-secondary w-full" onClick={() => setIsOpen(false)}>
                <a href="#contato">Solicitar Orçamento</a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
