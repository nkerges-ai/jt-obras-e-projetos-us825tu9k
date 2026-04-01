import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, Fingerprint, PenTool, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAuditLog, addDocumentoArmazenado } from '@/lib/storage'
import { exportHtmlToWord } from '@/lib/export-utils'
import { RichTextEditor } from '@/components/RichTextEditor'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import logo from '@/assets/logotipo-c129e.jpg'

const CERTIFICATE_TEMPLATES: Record<
  string,
  { courseName: string; courseDesc: string; workload: string }
> = {
  'NR-06': {
    courseName: 'NR-06 EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL - EPI',
    courseDesc:
      '<p>Treinamento sobre o uso adequado, guarda e conservação de Equipamentos de Proteção Individual (EPI), conforme as diretrizes da Norma Regulamentadora NR-06.</p>',
    workload: '04 (Quatro)',
  },
  'NR-10': {
    courseName: 'NR-10 SEGURANÇA EM INSTALAÇÕES E SERVIÇOS EM ELETRICIDADE',
    courseDesc:
      '<p>Treinamento Básico de Segurança em Instalações e Serviços com Eletricidade, abordando os riscos elétricos, medidas de controle e primeiros socorros, em conformidade com a Norma Regulamentadora NR-10.</p>',
    workload: '40 (Quarenta)',
  },
  'NR-18': {
    courseName: 'NR-18 CONDIÇÕES DE SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO',
    courseDesc:
      '<p>Treinamento admissional/periódico abordando os riscos inerentes à função, condições do ambiente de trabalho, uso de EPI e EPC, de acordo com a Norma Regulamentadora NR-18.</p>',
    workload: '06 (Seis)',
  },
  'NR-35': {
    courseName: 'NR-35 SEGURANÇA E SAÚDE NOS TRABALHOS EM ALTURA',
    courseDesc:
      '<p>Curso de capacitação para trabalhos em altura, englobando normas, análise de risco, sistemas de proteção contra quedas e condutas em situações de emergência, conforme estabelecido pela Norma Regulamentadora NR-35.</p>',
    workload: '08 (Oito)',
  },
}

export default function CertificateEditor() {
  const { toast } = useToast()

  const [data, setData] = useState({
    companyName: 'JT OBRAS E MANUTENÇÕES LTDA',
    companyCnpj: '63.243.791/0001-09',
    employeeName: '',
    courseName: CERTIFICATE_TEMPLATES['NR-35'].courseName,
    courseDesc: CERTIFICATE_TEMPLATES['NR-35'].courseDesc,
    workload: CERTIFICATE_TEMPLATES['NR-35'].workload,
    location: 'São Paulo',
    date: new Date().toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    signerName: 'João Vitor Araujo Pessoa',
    signerRole: 'Téc. Seg. do Trabalho',
    signerMte: '0106195',
    signerCrea: '5070806995',
    signature: '',
  })

  const handleTemplateChange = (val: string) => {
    if (CERTIFICATE_TEMPLATES[val]) {
      setData({ ...data, ...CERTIFICATE_TEMPLATES[val] })
    }
  }

  const handleSave = () => {
    addDocumentoArmazenado({
      projeto_id: 'global',
      tipo_documento: 'certificado',
      nome_arquivo: `Certificado_${data.employeeName || 'Colaborador'}_${data.courseName.split(' ')[0]}.pdf`,
      descricao: 'Certificado gerado pelo sistema',
      url_storage: 'data:application/pdf;base64,dummy',
      tamanho_arquivo: 1024,
      usuario_id: 'Admin',
      status: 'ativo',
    })
    addAuditLog({
      userId: 'Admin',
      action: 'Gerar Certificado',
      table: 'Documentos',
      newData: JSON.stringify(data),
    })
    toast({ title: 'Salvo no Acervo', description: 'Certificado salvo na pasta Certificados.' })
  }

  const signEletronic = () => {
    setData({
      ...data,
      signature: 'https://img.usecurling.com/i?q=signature&color=blue&shape=hand-drawn',
    })
    toast({ title: 'Assinado', description: 'Assinatura eletrônica aplicada.' })
  }

  const signGovbr = () => {
    setData({ ...data, signature: 'govbr' })
    toast({ title: 'Validado Gov.br', description: 'Assinatura digital Gov.br aplicada.' })
  }

  const exportWord = () => {
    const el = document.getElementById('certificate-preview')
    if (el) exportHtmlToWord(el.outerHTML, `Certificado_${data.employeeName || 'Modelo'}`)
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-white print:pb-0">
      <div className="bg-white border-b sticky top-[72px] z-30 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate">Gerador de Certificados</h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            <Button
              size="sm"
              onClick={signEletronic}
              variant="outline"
              className="gap-2 text-brand-navy hidden sm:flex"
            >
              <PenTool className="h-4 w-4" /> Assinatura Eletrônica
            </Button>
            <Button
              size="sm"
              onClick={signGovbr}
              className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white"
            >
              <Fingerprint className="h-4 w-4" /> Assinatura Gov.br
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="gap-2 hidden md:flex"
            >
              <Save className="h-4 w-4" /> Salvar Acervo
            </Button>
            <Button variant="outline" size="sm" onClick={exportWord} className="gap-2">
              <Download className="h-4 w-4" /> Word
            </Button>
            <Button onClick={() => window.print()} size="sm" className="gap-2">
              <Printer className="h-4 w-4" /> Imprimir (PDF)
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 print:p-0 flex flex-col xl:flex-row items-start gap-8 mt-6">
        <div className="w-full xl:w-[400px] shrink-0 bg-white p-6 rounded-xl border shadow-sm print:hidden">
          <h2 className="font-bold mb-4 text-brand-navy border-b pb-2">Dados do Certificado</h2>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Modelo de Certificado (NR)</Label>
              <Select onValueChange={handleTemplateChange} defaultValue="NR-35">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NR-06">NR-06 (EPIs)</SelectItem>
                  <SelectItem value="NR-10">NR-10 (Eletricidade)</SelectItem>
                  <SelectItem value="NR-18">NR-18 (Construção Civil)</SelectItem>
                  <SelectItem value="NR-35">NR-35 (Trabalho em Altura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Nome do Colaborador</Label>
              <Input
                value={data.employeeName}
                onChange={(e) => setData({ ...data, employeeName: e.target.value })}
                placeholder="Nome completo do participante"
              />
            </div>
            <div className="space-y-1">
              <Label>Empresa (Empregadora)</Label>
              <Input
                value={data.companyName}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>CNPJ</Label>
              <Input
                value={data.companyCnpj}
                onChange={(e) => setData({ ...data, companyCnpj: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label>Descrição do Curso / Conteúdo</Label>
              <RichTextEditor
                value={data.courseDesc}
                onChange={(val) => setData({ ...data, courseDesc: val })}
                className="min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1">
                <Label>Título do Curso</Label>
                <Input
                  value={data.courseName}
                  onChange={(e) => setData({ ...data, courseName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Carga Horária</Label>
                <Input
                  value={data.workload}
                  onChange={(e) => setData({ ...data, workload: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Local</Label>
                <Input
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Data</Label>
                <Input
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 border-t space-y-4">
              <Label className="font-bold text-gray-500">Dados do Instrutor / Responsável</Label>
              <div className="space-y-1">
                <Label>Nome</Label>
                <Input
                  value={data.signerName}
                  onChange={(e) => setData({ ...data, signerName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Cargo/Função</Label>
                <Input
                  value={data.signerRole}
                  onChange={(e) => setData({ ...data, signerRole: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>MTE/SP</Label>
                  <Input
                    value={data.signerMte}
                    onChange={(e) => setData({ ...data, signerMte: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>CREA</Label>
                  <Input
                    value={data.signerCrea}
                    onChange={(e) => setData({ ...data, signerCrea: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex justify-center overflow-x-auto print:overflow-visible pb-12">
          <div
            id="certificate-preview"
            className="relative bg-white w-[1000px] h-[700px] shrink-0 shadow-2xl print:shadow-none print:w-full print:h-auto p-4 select-none"
          >
            {/* Certificate Outer Border */}
            <div className="absolute inset-4 border-[14px] border-[#005A9C] pointer-events-none z-10 opacity-90"></div>
            {/* Certificate Inner Border */}
            <div className="absolute inset-[24px] border-[2px] border-[#009FE3] pointer-events-none z-10 opacity-70"></div>

            {/* Screws */}
            <div className="absolute top-6 left-6 w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-600/50"></div>
            </div>
            <div className="absolute top-6 right-6 w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-600/50"></div>
            </div>
            <div className="absolute bottom-6 left-6 w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-600/50"></div>
            </div>
            <div className="absolute bottom-6 right-6 w-5 h-5 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-gray-600/50"></div>
            </div>

            {/* Content Area */}
            <div className="w-full h-full pt-16 pb-12 px-24 flex flex-col items-center text-center relative z-0">
              {/* JT Branding Integration */}
              <div className="flex items-center justify-center mb-8 mt-2 h-[80px]">
                <img src={logo} alt="JT Obras e Manutenções" className="h-full object-contain" />
              </div>

              <h1 className="text-4xl font-black mb-4 tracking-[0.2em] text-[#005A9C] uppercase">
                CERTIFICADO
              </h1>
              <h2 className="text-2xl font-bold italic mb-8 text-gray-800">"{data.courseName}"</h2>

              <div className="text-lg leading-[2.2] text-justify mb-10 text-gray-800 w-full px-12">
                <span className="inline">Certificamos que o colaborador </span>
                <span className="font-bold uppercase border-b border-black inline">
                  {data.employeeName || '______________________________________'}
                </span>
                <span className="inline"> da empresa </span>
                <span className="font-bold uppercase inline">{data.companyName}</span>
                <span className="inline">
                  , CNPJ {data.companyCnpj} participou do seguinte programa:
                </span>

                <div
                  className="prose prose-sm mx-auto my-6 text-center text-gray-800 leading-relaxed font-medium"
                  dangerouslySetInnerHTML={{ __html: data.courseDesc }}
                />

                <span className="inline block text-center mt-6">
                  conforme estabelecido nas Normas Regulamentadoras, com carga horária de{' '}
                  <span className="font-bold">{data.workload}</span> horas.
                </span>
              </div>

              <p className="text-lg font-bold mb-16 text-gray-800">
                {data.location}, {data.date}.
              </p>

              <div className="mt-auto flex flex-col items-center w-full max-w-sm relative">
                {data.signature === 'govbr' ? (
                  <div className="absolute -top-12 border border-blue-900 px-4 py-1 rounded bg-white">
                    <span className="text-[11px] font-bold text-blue-900">ASSINADO VIA GOV.BR</span>
                  </div>
                ) : data.signature ? (
                  <img
                    src={data.signature}
                    className="absolute -top-12 h-16 mix-blend-multiply"
                    alt="Assinatura"
                  />
                ) : null}

                <div className="w-full border-t border-black mb-2"></div>
                <p className="font-bold text-lg text-gray-900">{data.signerName}</p>
                <p className="text-sm font-semibold text-gray-700">{data.signerRole}</p>
                <p className="text-sm font-bold text-gray-800 mt-1">MTE/SP: {data.signerMte}</p>
                <p className="text-sm font-bold text-gray-800">CREA: {data.signerCrea}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
