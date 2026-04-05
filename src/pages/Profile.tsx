import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'
import pb from '@/lib/pocketbase/client'
import { ShieldCheck, UploadCloud, FileSignature } from 'lucide-react'
import { SignatureInput } from '@/components/SignatureInput'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()

  const formatCpfCnpj = (v: string) => {
    let val = v.replace(/\D/g, '')
    if (val.length <= 11) {
      val = val.replace(/(\d{3})(\d)/, '$1.$2')
      val = val.replace(/(\d{3})(\d)/, '$1.$2')
      val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    } else {
      if (val.length > 14) val = val.slice(0, 14)
      val = val.replace(/^(\d{2})(\d)/, '$1.$2')
      val = val.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      val = val.replace(/\.(\d{3})(\d)/, '.$1/$2')
      val = val.replace(/(\d{4})(\d)/, '$1-$2')
    }
    return val
  }

  const [formData, setFormData] = useState({
    name: user?.name || '',
    cpf: user?.cpf || '',
    rg: user?.rg || '',
    cnpj: user?.cnpj || '',
    address: user?.address || '',
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
      data.append('cpf', formData.cpf)
      data.append('rg', formData.rg)
      data.append('cnpj', formData.cnpj)
      data.append('address', formData.address)
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
    <div className="space-y-8 max-w-5xl animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Configurações de Conta</h1>
        <p className="text-slate-400 mt-2 text-sm max-w-2xl">
          Gerencie suas informações pessoais, dados da empresa para geração de contratos e
          assinatura digital utilizada em documentos legais.
        </p>
      </div>

      <div className="bg-[#1e293b] p-6 md:p-8 rounded-xl shadow-sm border border-slate-800 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-8 border-b border-slate-700">
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-800 rounded-full border-4 border-slate-700 shadow-md overflow-hidden flex items-center justify-center relative group">
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
                <span className="text-slate-300 font-bold text-2xl">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
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
          <div className="flex-1">
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {user?.name || 'Preencha seu nome'}
            </h3>
            <p className="text-slate-400 mt-1">{user?.email}</p>
            <div className="mt-4">
              <Label
                htmlFor="avatar-upload"
                className="inline-flex items-center justify-center h-10 px-6 cursor-pointer bg-slate-800 border border-slate-700 shadow-sm rounded-full hover:bg-slate-700 text-sm font-semibold text-slate-200 transition-colors"
              >
                Alterar Imagem de Perfil
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <Label className="text-slate-300 font-medium text-sm">Nome Completo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-slate-300 font-medium text-sm">E-mail Corporativo</Label>
            <div className="relative">
              <Input
                value={user?.email || ''}
                disabled
                className="h-12 bg-slate-900 text-slate-500 border-slate-700 opacity-70"
              />
              <ShieldCheck className="absolute right-3 top-3 h-5 w-5 text-green-500" />
            </div>
          </div>

          <div className="space-y-2.5">
            <Label className="text-slate-300 font-medium text-sm">CPF</Label>
            <Input
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: formatCpfCnpj(e.target.value) })}
              placeholder="000.000.000-00"
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-slate-300 font-medium text-sm">RG</Label>
            <Input
              value={formData.rg}
              onChange={(e) => setFormData({ ...formData, rg: e.target.value })}
              placeholder="00.000.000-0"
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
            />
          </div>

          <div className="space-y-2.5 md:col-span-2">
            <Label className="text-slate-300 font-medium text-sm">CNPJ da Empresa (JT Obras)</Label>
            <Input
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: formatCpfCnpj(e.target.value) })}
              placeholder="00.000.000/0001-00"
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
            />
          </div>

          <div className="space-y-2.5 md:col-span-2">
            <Label className="text-slate-300 font-medium text-sm">
              Endereço Completo da Empresa
            </Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Rua, Número, Bairro, Cidade - Estado, CEP"
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-slate-300 font-medium text-sm">Telefone / WhatsApp</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
              placeholder="(11) 90000-0000"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-slate-300 font-medium text-sm">
              Razão Social / Nome da Empresa
            </Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="h-12 bg-slate-900 border-slate-700 text-white focus-visible:ring-slate-600"
              placeholder="Nome da sua construtora ou empresa"
            />
          </div>
        </div>

        <div className="pt-8 border-t border-slate-700 flex flex-col xl:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <Label className="text-white font-bold text-lg block">
                Assinatura Digital de Documentos
              </Label>
              <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                Configure sua assinatura utilizando nosso componente unificado. Ela será aplicada
                automaticamente na emissão de contratos, certificados e ordens de serviço.
              </p>
            </div>
            <SignatureInput value={signatureBase64} onChange={setSignatureBase64} />
          </div>

          <div className="w-full xl:w-72 shrink-0 space-y-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <Label className="text-white font-bold text-sm block flex items-center gap-2">
              <FileSignature className="h-4 w-4" /> Prévia da Assinatura
            </Label>
            <div className="w-full h-40 border-2 border-dashed border-slate-700 bg-white/5 rounded-xl flex items-center justify-center p-4 shadow-inner relative overflow-hidden">
              {signatureBase64 ? (
                <img
                  src={signatureBase64}
                  className="max-w-full max-h-full object-contain drop-shadow-md"
                  alt="Prévia Nova"
                />
              ) : user?.signature ? (
                <img
                  src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/users/${user.id}/${user.signature}`}
                  className="max-w-full max-h-full object-contain drop-shadow-md"
                  alt="Prévia Salva"
                />
              ) : (
                <span className="text-slate-500 text-sm italic font-medium">
                  Nenhuma assinatura cadastrada
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 text-center">
              * O fundo transparente será preservado nos PDFs
            </p>
          </div>
        </div>

        <div className="pt-8 flex justify-end border-t border-slate-700">
          <Button
            onClick={handleSave}
            disabled={loading}
            className="w-full md:w-auto bg-[#3498db] hover:bg-[#2980b9] text-white h-14 px-10 text-base font-bold rounded-xl shadow-lg transition-all duration-200"
          >
            {loading ? 'Salvando Configurações...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>
    </div>
  )
}
