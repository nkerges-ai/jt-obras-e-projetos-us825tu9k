import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import logo from '@/assets/logotipo-c129e.jpg'

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    company: '',
  })
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const dataToSubmit: any = { ...formData }
    if (signatureFile) dataToSubmit.signature = signatureFile

    const { error } = await signUp(dataToSubmit)
    if (error) {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Verifique os dados informados.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Conta criada', description: 'Bem-vindo ao sistema JT Obras!' })
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex bg-[#0f172a] text-white">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 overflow-y-auto">
        <div className="mx-auto w-full max-w-md pb-12">
          <div className="bg-white p-4 rounded-xl mb-8 inline-block mt-4">
            <img src={logo} alt="JT Obras" className="h-12 object-contain" />
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-white">Crie sua conta</h2>
          <p className="mt-2 text-sm text-slate-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-[#3498db] hover:text-[#2980b9]">
              Faça login
            </Link>
          </p>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-300">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[44px]"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[44px]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-slate-300">
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[44px]"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-slate-300">
                    Empresa
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[44px]"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-slate-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-slate-800 border-slate-700 text-white mt-1 min-h-[44px]"
                />
              </div>

              <div>
                <Label className="text-slate-300">Assinatura Digital (Opcional)</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md bg-slate-800 hover:bg-slate-700 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-slate-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-slate-400 justify-center mt-2">
                      <label
                        htmlFor="signature-upload"
                        className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#3498db] hover:text-[#2980b9] focus-within:outline-none min-h-[44px] flex items-center"
                      >
                        <span>Fazer upload de um arquivo</span>
                        <input
                          id="signature-upload"
                          name="signature-upload"
                          type="file"
                          className="sr-only"
                          onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG até 5MB</p>
                    {signatureFile && (
                      <p className="text-xs text-green-400 mt-2 font-medium">
                        {signatureFile.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3498db] hover:bg-[#2980b9] text-white h-12 text-lg"
              >
                {loading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://img.usecurling.com/p/1000/1000?q=architect&color=blue"
          alt="Construção"
        />
        <div className="absolute inset-0 bg-[#0f172a]/60 mix-blend-multiply" />
      </div>
    </div>
  )
}
