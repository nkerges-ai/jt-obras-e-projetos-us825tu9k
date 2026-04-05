import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
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
  const { signIn, user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  if (!authLoading && user?.id) {
    return <Navigate to="/dashboard" replace />
  }

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
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="bg-white p-5 rounded-2xl mb-8 flex justify-center shadow-lg border border-slate-200">
            <img src={logo} alt="JT Obras" className="max-h-16 w-auto object-contain" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white">Acesse sua conta</h2>
          <p className="mt-2 text-sm text-slate-400">
            Ou{' '}
            <Link to="/signup" className="font-medium text-[#3498db] hover:text-[#2980b9]">
              crie uma nova conta
            </Link>
          </p>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  E-mail
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-300">
                  Senha
                </Label>
                <div className="mt-1">
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white min-h-[44px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <a href="#" className="font-medium text-[#3498db] hover:text-[#2980b9]">
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white h-12 text-lg"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://img.usecurling.com/p/1000/1000?q=construction%20engineering&color=blue"
          alt="Construção"
        />
        <div className="absolute inset-0 bg-[#0f172a]/60 mix-blend-multiply" />
      </div>
    </div>
  )
}
