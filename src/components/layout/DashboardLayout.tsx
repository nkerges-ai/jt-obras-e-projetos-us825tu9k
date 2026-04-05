import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FileText,
  FileSignature,
  Receipt,
  Users,
  Image as ImageIcon,
  LogOut,
  User as UserIcon,
  Menu,
} from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import logo from '@/assets/logotipo-c129e.jpg'

export function DashboardLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  const links = [
    { to: '/dashboard', icon: FileText, label: 'Dashboard' },
    { to: '/certificados', icon: FileText, label: 'Certificados (NR)' },
    { to: '/listas-presenca', icon: Users, label: 'Listas de Presença' },
    { to: '/contratos', icon: FileSignature, label: 'Contratos' },
    { to: '/orcamentos', icon: Receipt, label: 'Orçamentos' },
    { to: '/evidencias', icon: ImageIcon, label: 'Evidências' },
    { to: '/perfil', icon: UserIcon, label: 'Meu Perfil' },
  ]

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0f172a] text-white">
      <div className="p-6 flex items-center justify-center border-b border-slate-800 bg-white">
        <img src={logo} alt="JT Obras" className="h-10 object-contain" />
      </div>
      <div className="p-4 flex items-center gap-3 border-b border-slate-800">
        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
          {user?.avatar ? (
            <img
              src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="h-5 w-5 text-slate-300" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm">{user?.name || 'Usuário'}</p>
          <p className="text-xs text-slate-400 truncate w-32">{user?.email}</p>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={cn(
              'flex items-center gap-3 px-3 py-3 md:py-2 rounded-md transition-colors text-sm font-medium min-h-[44px]',
              location.pathname === link.to
                ? 'bg-[#3498db] text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800 gap-3 min-h-[44px]"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col md:pl-64">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:hidden">
          <img src={logo} alt="JT Obras" className="h-8 object-contain" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-11 w-11">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 border-none">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
