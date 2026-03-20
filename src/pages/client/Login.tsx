import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserCircle, ShieldAlert } from 'lucide-react'
import { getProjects } from '@/lib/storage'

export default function ClientLogin() {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (sessionStorage.getItem('client_project_id')) {
      navigate('/cliente/dashboard')
    }
  }, [navigate])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const projects = getProjects()
    // For demo purposes, we accept the Project ID as the access code
    const project = projects.find((p) => p.id === accessCode)
    if (project) {
      sessionStorage.setItem('client_project_id', project.id)
      navigate('/cliente/dashboard')
    } else {
      setError(true)
      setAccessCode('')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-secondary/30">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
            <UserCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Portal do Cliente</CardTitle>
          <CardDescription className="text-base">
            Acompanhe o status da sua obra, visualize documentos e abra chamados de suporte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Código de Acesso da Obra (ID)"
                value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value)
                  setError(false)
                }}
                className={`h-14 text-center text-lg ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {error && (
                <div className="flex items-center justify-center gap-2 text-red-500 text-sm mt-2 font-medium">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Código inválido. Tente novamente.</span>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full h-14 text-lg font-bold">
              Acessar Painel
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Dica: Use "1" ou "2" para testar com os projetos de exemplo.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
