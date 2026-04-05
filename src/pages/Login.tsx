import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import logo from '@/assets/logotipo-c129e.jpg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast({
        title: 'Erro no login',
        description: 'Credenciais inválidas.',
        variant: 'destructive',
      })
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white relative p-4">
      {/* Background styling for impeccable look */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#3498db]/10 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#e67e22]/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md bg-[#1e293b]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-3 rounded-xl inline-block shadow-lg">
            <img src={logo} alt="JT Obras" className="h-10 object-contain" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Acesso ao Portal</h2>
          <p className="mt-2 text-sm text-slate-400">
            Não tem uma conta?{' '}
            <Link
              to="/signup"
              className="font-medium text-[#3498db] hover:text-[#2980b9] transition-colors"
            >
              Cadastre-se
            </Link>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium">
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="bg-slate-900/50 border-slate-700 text-white min-h-[48px] focus-visible:ring-[#3498db]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300 font-medium">
                Senha
              </Label>
              <a
                href="#"
                className="text-xs font-medium text-[#3498db] hover:text-[#2980b9] transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-slate-900/50 border-slate-700 text-white min-h-[48px] focus-visible:ring-[#3498db]"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white h-12 text-base font-semibold shadow-lg shadow-[#3498db]/20 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? 'Autenticando...' : 'Entrar no Sistema'}
          </Button>
        </form>
      </div>
    </div>
  )
}
