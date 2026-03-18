import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, HardHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Portfólio', href: '/portfolio' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-5 md:px-12 md:py-7 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="bg-primary p-3 rounded-xl group-hover:bg-primary/90 transition-colors shadow-sm">
            <HardHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold tracking-tight leading-none">
              JT Obras
            </span>
            <span className="text-xs md:text-sm text-muted-foreground font-medium mt-1">
              e Projetos
            </span>
          </div>
        </Link>
        <div className="hidden md:flex md:items-center md:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'text-base font-semibold transition-colors hover:text-primary',
                location.pathname === item.href ? 'text-primary' : 'text-muted-foreground',
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button size="lg" className="font-bold rounded-full px-8 shadow-md">
            Solicitar Orçamento
          </Button>
        </div>
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="h-12 w-12"
          >
            <span className="sr-only">Abrir menu</span>
            <Menu className="h-8 w-8" aria-hidden="true" />
          </Button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background md:hidden px-6 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <Link
              to="/"
              className="flex items-center gap-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="bg-primary p-3 rounded-xl">
                <HardHat className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold leading-none">JT Obras</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">e Projetos</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(false)}
              className="h-12 w-12"
            >
              <span className="sr-only">Fechar menu</span>
              <X className="h-8 w-8" aria-hidden="true" />
            </Button>
          </div>
          <div className="flex flex-col gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'text-2xl font-bold',
                  location.pathname === item.href ? 'text-primary' : 'text-foreground',
                )}
              >
                {item.name}
              </Link>
            ))}
            <Button size="lg" className="w-full mt-8 font-bold rounded-full py-6 text-lg">
              Solicitar Orçamento
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
