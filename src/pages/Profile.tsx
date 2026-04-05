import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { ShieldCheck, UploadCloud } from 'lucide-react'
import { SignatureInput } from '@/components/SignatureInput'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    company: user?.company || '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [signatureBase64, setSignatureBase64] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('phone', formData.phone)
      data.append('company', formData.company)

      if (avatar) data.append('avatar', avatar)

      if (signatureBase64) {
        const res = await fetch(signatureBase64)
        const blob = await res.blob()
        data.append('signature', blob, 'assinatura.png')
      }

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
    <div className="space-y-8 max-w-4xl">
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
                <img
                  src={URL.createObjectURL(avatar)}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              ) : user?.avatar ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.avatar}`}
                  className="w-full h-full object-cover"
                  alt="Avatar"
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

        <div className="pt-6 border-t flex flex-col xl:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-slate-800 font-bold text-lg block">
                Assinatura Digital de Documentos
              </Label>
              <p className="text-sm text-slate-500 mt-1">
                Configure sua assinatura utilizando nosso componente unificado. Ela será aplicada
                automaticamente na emissão de certificados e ordens de serviço.
              </p>
            </div>

            <SignatureInput value={signatureBase64} onChange={setSignatureBase64} />
          </div>

          <div className="w-full xl:w-72 shrink-0 space-y-4">
            <Label className="text-slate-800 font-bold text-sm block">
              Prévia da Assinatura Atual
            </Label>
            <div className="w-full h-40 border-2 border-dashed bg-slate-50 rounded-xl flex items-center justify-center p-4 shadow-inner relative overflow-hidden">
              {signatureBase64 ? (
                <img
                  src={signatureBase64}
                  className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm"
                  alt="Prévia Nova"
                />
              ) : user?.signature ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.signature}`}
                  className="max-w-full max-h-full object-contain mix-blend-multiply drop-shadow-sm"
                  alt="Prévia Salva"
                />
              ) : (
                <span className="text-slate-400 text-sm italic font-medium">
                  Nenhuma assinatura cadastrada
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 text-center">
              * O fundo branco será removido automaticamente nos PDFs
            </p>
          </div>
        </div>

        <div className="pt-8 flex justify-end border-t">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#3498db] hover:bg-[#2980b9] text-white h-12 px-10 text-lg font-bold rounded-full shadow-md"
          >
            {loading ? 'Salvando Configurações...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
