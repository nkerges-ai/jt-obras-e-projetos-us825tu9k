import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock, ShieldAlert } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') === 'true') {
      navigate('/admin', { replace: true })
    }
  }, [navigate])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'JOELTATIANA') {
      sessionStorage.setItem('admin_auth', 'true')
      navigate('/admin')
    } else {
      setError(true)
      setPassword('')
    }
  }

  const handleForgotPassword = () => {
    toast({
      title: 'Recuperação de Senha',
      description: 'Um link de recuperação foi enviado para o e-mail do administrador cadastrado.',
    })
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Acesso Administrativo</CardTitle>
          <CardDescription className="text-base">
            Área restrita para gestão de documentos e orçamentos da JT Obras.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Digite a senha de acesso"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(false)
                }}
                className={`h-14 text-center text-lg min-h-[48px] ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />{' '}
              {error && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm mt-2 font-medium">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Senha incorreta. Tente novamente.</span>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold">
              Acessar Portal
            </Button>
            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                className="text-muted-foreground text-sm font-medium hover:text-primary min-h-[44px]"
                onClick={handleForgotPassword}
              >
                Esqueci a senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
