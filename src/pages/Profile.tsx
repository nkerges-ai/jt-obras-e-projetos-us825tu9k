import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { ShieldCheck, UploadCloud } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [signature, setSignature] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('phone', formData.phone)
      data.append('company', formData.company)
      if (avatar) data.append('avatar', avatar)
      if (signature) data.append('signature', signature)

      await pb.collection('users').update(user.id, data)
      toast({ title: 'Sucesso', description: 'Seu perfil e configurações foram atualizados.' })
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
        variant: 'destructive',
      })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações de Conta</h1>
        <p className="text-slate-500 mt-1">
          Gerencie suas informações pessoais, contatos e assinatura digital utilizada em documentos.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b">
          <div className="relative">
            <div className="w-28 h-28 bg-slate-100 rounded-full border-4 border-white shadow-md overflow-hidden flex items-center justify-center relative group">
              {avatar ? (
                <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" />
              ) : user?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-300 font-bold text-xl">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UploadCloud className="text-white h-6 w-6" />
              </div>
            </div>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              onChange={(e) => setAvatar(e.target.files?.[0] || null)}
              accept="image/*"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {user?.name || 'Preencha seu nome'}
            </h3>
            <p className="text-slate-500">{user?.email}</p>
            <div className="mt-3">
              <Label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-white border shadow-sm px-4 py-2 rounded-full hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors"
              >
                Alterar Imagem de Perfil
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-600 font-medium">Nome Completo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 bg-slate-50 border-slate-200"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 font-medium">E-mail Corporativo</Label>
            <div className="relative">
              <Input
                value={user?.email || ''}
                disabled
                className="h-12 bg-slate-100 text-slate-500 border-slate-200"
              />
              <ShieldCheck className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 font-medium">Telefone / WhatsApp</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-12 bg-slate-50 border-slate-200"
              placeholder="(11) 90000-0000"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-600 font-medium">Empresa Relacionada</Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="h-12 bg-slate-50 border-slate-200"
              placeholder="Nome da sua construtora ou empresa"
            />
          </div>
        </div>

        <div className="pt-6 border-t">
          <Label className="text-slate-800 font-bold text-base mb-4 block">
            Assinatura Digital de Documentos
          </Label>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 p-6 flex flex-col items-center justify-center text-center">
              <p className="text-sm font-medium text-slate-600 mb-4">
                Faça o upload do seu carimbo de assinatura (Fundo transparente recomendado)
              </p>
              <input
                id="sig-upload"
                type="file"
                className="hidden"
                onChange={(e) => setSignature(e.target.files?.[0] || null)}
                accept="image/png, image/jpeg"
              />
              <Button
                asChild
                variant="outline"
                className="border-[#3498db] text-[#3498db] hover:bg-[#3498db] hover:text-white"
              >
                <label htmlFor="sig-upload" className="cursor-pointer">
                  Procurar Arquivo PNG
                </label>
              </Button>
              {signature && (
                <p className="text-xs font-bold text-green-600 mt-3">
                  Arquivo selecionado: {signature.name}
                </p>
              )}
            </div>

            <div className="w-full md:w-64 h-32 border bg-white rounded-lg flex items-center justify-center p-2 shadow-inner">
              {signature ? (
                <img
                  src={URL.createObjectURL(signature)}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              ) : user?.signature ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.signature}`}
                  className="max-w-full max-h-full object-contain mix-blend-multiply"
                />
              ) : (
                <span className="text-slate-300 text-sm italic">Prévia da assinatura</span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#3498db] hover:bg-[#2980b9] text-white h-12 px-8 text-lg font-bold"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
