import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, Fingerprint, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { exportHtmlToWord } from '@/lib/export-utils'
import { RichTextEditor } from '@/components/RichTextEditor'
import { SignatureInput } from '@/components/SignatureInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import logo from '@/assets/logotipo-c129e.jpg'
import pb from '@/lib/pocketbase/client'
import { getErrorMessage } from '@/lib/pocketbase/errors'

const CERTIFICATE_TEMPLATES: Record<
  string,
  { courseName: string; courseDesc: string; workload: string; syllabus: string }
> = {
  'NR-06': {
    courseName: 'NR-06 EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL - EPI',
    courseDesc:
      '<p>Treinamento sobre o uso adequado, guarda e conservação de Equipamentos de Proteção Individual (EPI), conforme as diretrizes da Norma Regulamentadora NR-06.</p>',
    workload: '04',
    syllabus:
      '<ul><li>Importância do EPI</li><li>Seleção do EPI adequado</li><li>Uso correto</li><li>Manutenção e conservação</li><li>Responsabilidades do empregador e do empregado</li></ul>',
  },
  'NR-10': {
    courseName: 'NR-10 SEGURANÇA EM INSTALAÇÕES E SERVIÇOS EM ELETRICIDADE',
    courseDesc:
      '<p>Treinamento Básico de Segurança em Instalações e Serviços com Eletricidade, abordando os riscos elétricos, medidas de controle e primeiros socorros, em conformidade com a Norma Regulamentadora NR-10.</p>',
    workload: '40',
    syllabus:
      '<ul><li>Introdução à segurança com eletricidade</li><li>Riscos em instalações e serviços com eletricidade</li><li>Técnicas de análise de risco</li><li>Medidas de controle do risco elétrico</li><li>EPI/EPC (Equipamentos de Proteção Individual e Coletiva)</li><li>Procedimentos e rotinas de trabalho</li><li>Noções de combate a incêndio</li><li>Noções de primeiros socorros</li></ul>',
  },
  'NR-18': {
    courseName: 'NR-18 CONDIÇÕES DE SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO',
    courseDesc:
      '<p>Treinamento admissional/periódico abordando os riscos inerentes à função, condições do ambiente de trabalho, uso de EPI e EPC, de acordo com a Norma Regulamentadora NR-18.</p>',
    workload: '06',
    syllabus:
      '<ul><li>Condições do ambiente de trabalho</li><li>Medidas de proteção coletiva</li><li>Equipamentos de proteção individual</li><li>Sinalização de segurança</li><li>Procedimentos operacionais para a fase específica da obra</li></ul>',
  },
  'NR-35': {
    courseName: 'NR-35 SEGURANÇA E SAÚDE NOS TRABALHOS EM ALTURA',
    courseDesc:
      '<p>Curso de capacitação para trabalhos em altura, englobando normas, análise de risco, sistemas de proteção contra quedas e condutas em situações de emergência, conforme estabelecido pela Norma Regulamentadora NR-35.</p>',
    workload: '08',
    syllabus:
      '<ul><li>Normas e regulamentos aplicáveis</li><li>Análise de risco e condições impeditivas</li><li>Riscos potenciais inerentes ao trabalho em altura</li><li>Sistemas, equipamentos e procedimentos de proteção coletiva</li><li>Equipamentos de Proteção Individual para trabalho em altura</li><li>Condutas em situações de emergência e noções de resgate e primeiros socorros</li></ul>',
  },
}

export default function CertificateEditor() {
  const { toast } = useToast()
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState({
    companyName: 'JT OBRAS E MANUTENÇÕES LTDA',
    companyCnpj: '63.243.791/0001-09',
    employeeName: '',
    employeeCpf: '',
    courseName: CERTIFICATE_TEMPLATES['NR-35'].courseName,
    courseDesc: CERTIFICATE_TEMPLATES['NR-35'].courseDesc,
    workload: CERTIFICATE_TEMPLATES['NR-35'].workload,
    syllabus: CERTIFICATE_TEMPLATES['NR-35'].syllabus,
    location: 'São Paulo',
    date: new Date().toISOString().split('T')[0],
    signerName: 'João Vitor Araujo Pessoa',
    signerRole: 'Téc. Seg. do Trabalho',
    signerMte: '0106195',
    signerCrea: '5070806995',
    signature: '',
    collaboratorSignature: '',
  })

  const [errors, setErrors] = useState<{
    name?: string
    cpf?: string
    course?: string
    date?: string
    workload?: string
  }>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleTemplateChange = (val: string) => {
    if (CERTIFICATE_TEMPLATES[val]) {
      setData((prev) => ({ ...prev, ...CERTIFICATE_TEMPLATES[val] }))
    }
  }

  useEffect(() => {
    if (window.location.pathname.includes('/nr18')) {
      handleTemplateChange('NR-18')
    }
  }, [])

  useEffect(() => {
    if (id) {
      pb.collection('certificates')
        .getOne(id)
        .then((doc) => {
          setData((prev) => ({
            ...prev,
            employeeName: doc.collaborator_name || '',
            employeeCpf: doc.collaborator_cpf || '',
            courseName:
              CERTIFICATE_TEMPLATES[doc.nr_type]?.courseName ||
              CERTIFICATE_TEMPLATES['NR-35'].courseName,
            courseDesc:
              CERTIFICATE_TEMPLATES[doc.nr_type]?.courseDesc ||
              CERTIFICATE_TEMPLATES['NR-35'].courseDesc,
            workload: String(doc.hours) || CERTIFICATE_TEMPLATES['NR-35'].workload,
            syllabus:
              CERTIFICATE_TEMPLATES[doc.nr_type]?.syllabus ||
              CERTIFICATE_TEMPLATES['NR-35'].syllabus,
            date: doc.training_date ? doc.training_date.split(' ')[0] : prev.date,
            signerMte: doc.technician_cpf || prev.signerMte,
            signature: doc.technician_signature
              ? pb.files.getUrl(doc, doc.technician_signature)
              : '',
            collaboratorSignature: doc.collaborator_signature
              ? pb.files.getUrl(doc, doc.collaborator_signature)
              : '',
          }))
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [id])

  const handleSave = async () => {
    const newErrors = {
      name: !data.employeeName ? 'Campo obrigatório' : '',
      cpf: !data.employeeCpf ? 'Campo obrigatório' : '',
      course: !data.courseName ? 'Campo obrigatório' : '',
      date: !data.date ? 'Campo obrigatório' : '',
      workload: !data.workload ? 'Campo obrigatório' : '',
    }
    setErrors(newErrors)

    if (
      newErrors.name ||
      newErrors.cpf ||
      newErrors.course ||
      newErrors.date ||
      newErrors.workload
    ) {
      toast({
        title: 'Erro de Validação',
        description: 'Preencha os campos obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)

    try {
      if (!pb.authStore.record) {
        await pb.collection('users').authWithPassword('admin@jtobras.com.br', 'JOELTATIANA')
      }

      let nrType = 'NR-35'
      if (data.courseName.includes('06')) nrType = 'NR-06'
      else if (data.courseName.includes('10')) nrType = 'NR-10'
      else if (data.courseName.includes('18')) nrType = 'NR-18'

      const formData = new FormData()
      formData.append('user_id', pb.authStore.record?.id || '')
      formData.append('nr_type', nrType)
      formData.append('collaborator_name', data.employeeName)
      formData.append('collaborator_cpf', data.employeeCpf)
      formData.append('training_date', data.date + ' 12:00:00.000Z')
      formData.append('hours', String(parseInt(data.workload) || 8))
      formData.append('status', 'completed')
      formData.append('technician_cpf', data.signerMte)

      const dataUrlToFile = (dataUrl: string, filename: string) => {
        const arr = dataUrl.split(',')
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], filename, { type: mime })
      }

      if (data.signature && data.signature !== 'govbr' && data.signature.startsWith('data:')) {
        formData.append('technician_signature', dataUrlToFile(data.signature, 'tech_sig.png'))
      }
      if (data.collaboratorSignature && data.collaboratorSignature.startsWith('data:')) {
        formData.append(
          'collaborator_signature',
          dataUrlToFile(data.collaboratorSignature, 'collab_sig.png'),
        )
      }

      let certId = id

      if (id) {
        await pb.collection('certificates').update(id, formData)
      } else {
        const created = await pb.collection('certificates').create(formData)
        certId = created.id

        try {
          await pb.collection('attendance_lists').create({
            certificate_id: certId,
            name: data.employeeName,
            cpf: data.employeeCpf,
            presence: true,
            observations: 'Gerado via sistema de certificados.',
          })
        } catch (_) {
          // ignore
        }
      }

      toast({ title: 'Salvo no Acervo', description: 'Certificado salvo com sucesso.' })
    } catch (err) {
      toast({ title: 'Erro ao salvar', description: getErrorMessage(err), variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const signGovbr = () => {
    setData({ ...data, signature: 'govbr' })
    toast({ title: 'Validado Gov.br', description: 'Assinatura digital Gov.br aplicada.' })
  }

  const exportWord = () => {
    const el = document.getElementById('certificate-preview')
    if (el) {
      exportHtmlToWord(el.outerHTML, `Certificado_${data.employeeName || 'Modelo'}`, 'landscape')
    }
  }

  const formattedDate = (() => {
    try {
      if (!data.date) return ''
      const parts = data.date.split('-')
      if (parts.length === 3) {
        return new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2]),
        ).toLocaleDateString('pt-BR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      }
      return data.date
    } catch (e) {
      return data.date
    }
  })()

  return (
    <div className="bg-gray-50 min-h-screen pb-28 print:bg-gray-100 print:pb-0">
      <style>{`
        @media print {
          @page { size: A4 landscape !important; margin: 0 !important; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          header, footer, nav, .print\\:hidden { display: none !important; }
          .print-page-break { 
            page-break-after: always !important; 
            break-after: page !important; 
          }
          #certificate-preview {
            width: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
          }
        }
      `}</style>
      <div className="bg-white border-b sticky top-0 md:top-[72px] z-40 print:hidden shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-10 w-10 shrink-0">
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="font-bold text-lg text-brand-navy truncate hidden sm:block">
              Gerador de Certificados
            </h1>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 max-w-full">
            <Button
              size="sm"
              onClick={signGovbr}
              className="gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white whitespace-nowrap shrink-0"
            >
              <Fingerprint className="h-4 w-4 hidden sm:block" /> Gov.br
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 whitespace-nowrap shrink-0 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 hidden sm:block" /> {isSaving ? '...' : 'Salvar'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={exportWord}
              className="gap-2 whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4 hidden sm:block" /> Word
            </Button>
            <Button
              onClick={() => window.print()}
              variant="outline"
              size="sm"
              className="gap-2 whitespace-nowrap shrink-0"
            >
              <Printer className="h-4 w-4 hidden sm:block" /> Imprimir
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 print:p-0 flex flex-col xl:flex-row items-start gap-8 mt-6">
        <div className="w-full xl:w-[480px] shrink-0 bg-white p-4 md:p-6 rounded-xl border shadow-sm print:hidden h-auto xl:h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          <h2 className="font-bold mb-4 text-brand-navy border-b pb-2 sticky top-0 bg-white z-10">
            Dados do Certificado
          </h2>
          <div className="space-y-5">
            <div className="space-y-1.5">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Nome do Colaborador</Label>
                <Input
                  value={data.employeeName}
                  onChange={(e) => {
                    setData({ ...data, employeeName: e.target.value })
                    setErrors({ ...errors, name: '' })
                  }}
                  placeholder="Nome completo"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>CPF</Label>
                <Input
                  value={data.employeeCpf}
                  onChange={(e) => {
                    let val = e.target.value.replace(/\D/g, '')
                    if (val.length > 11) val = val.slice(0, 11)
                    val = val.replace(/(\d{3})(\d)/, '$1.$2')
                    val = val.replace(/(\d{3})(\d)/, '$1.$2')
                    val = val.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
                    setData({ ...data, employeeCpf: val })
                    setErrors({ ...errors, cpf: '' })
                  }}
                  placeholder="000.000.000-00"
                  className={errors.cpf ? 'border-red-500' : ''}
                />
                {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Empresa (Empregadora)</Label>
              <Input
                value={data.companyName}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>CNPJ</Label>
              <Input
                value={data.companyCnpj}
                onChange={(e) => setData({ ...data, companyCnpj: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Descrição Frontal do Curso</Label>
              <RichTextEditor
                value={data.courseDesc}
                onChange={(val) => setData({ ...data, courseDesc: val })}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Conteúdo Programático (Verso)</Label>
              <RichTextEditor
                value={data.syllabus}
                onChange={(val) => setData({ ...data, syllabus: val })}
                className="min-h-[180px]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1.5">
                <Label>Título do Curso</Label>
                <Input
                  value={data.courseName}
                  onChange={(e) => {
                    setData({ ...data, courseName: e.target.value })
                    setErrors({ ...errors, course: '' })
                  }}
                  className={errors.course ? 'border-red-500' : ''}
                />
                {errors.course && <p className="text-xs text-red-500">{errors.course}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Carga Horária</Label>
                <Input
                  value={data.workload}
                  onChange={(e) => {
                    setData({ ...data, workload: e.target.value })
                    setErrors({ ...errors, workload: '' })
                  }}
                  className={errors.workload ? 'border-red-500' : ''}
                />
                {errors.workload && <p className="text-xs text-red-500">{errors.workload}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Local</Label>
                <Input
                  value={data.location}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Data</Label>
                <Input
                  type="date"
                  value={data.date}
                  onChange={(e) => {
                    setData({ ...data, date: e.target.value })
                    setErrors({ ...errors, date: '' })
                  }}
                  className={errors.date ? 'border-red-500' : ''}
                />
                {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
              </div>
            </div>

            <div className="pt-4 border-t space-y-5">
              <Label className="font-bold text-gray-800 text-lg">Responsável Técnico</Label>
              <div className="space-y-1.5">
                <Label>Nome</Label>
                <Input
                  value={data.signerName}
                  onChange={(e) => setData({ ...data, signerName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Cargo/Função</Label>
                <Input
                  value={data.signerRole}
                  onChange={(e) => setData({ ...data, signerRole: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>MTE/SP</Label>
                  <Input
                    value={data.signerMte}
                    onChange={(e) => setData({ ...data, signerMte: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>CREA</Label>
                  <Input
                    value={data.signerCrea}
                    onChange={(e) => setData({ ...data, signerCrea: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="font-bold text-gray-800">Assinatura do Técnico</Label>
                <SignatureInput
                  value={data.signature}
                  onChange={(val) => setData({ ...data, signature: val })}
                />
              </div>
              <div className="space-y-3 pt-4 border-t">
                <Label className="font-bold text-gray-800">Assinatura do Colaborador</Label>
                <SignatureInput
                  value={data.collaboratorSignature}
                  onChange={(val) => setData({ ...data, collaboratorSignature: val })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center overflow-x-auto print:overflow-visible pb-12 gap-12">
          <div
            id="certificate-preview"
            className="flex flex-col gap-12 items-center w-full min-w-[800px] max-w-[1040px] print:w-full print:max-w-none print:gap-0 print:block origin-top-left scale-[0.6] sm:scale-[0.8] xl:scale-100"
          >
            {/* Front Page */}
            <div className="relative bg-white w-[1040px] h-[735px] shrink-0 shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] print:overflow-hidden p-4 select-none print-page-break mb-8 print:mb-0">
              <div className="absolute inset-6 border-[6px] border-[#005A9C] pointer-events-none z-10 opacity-100 rounded-sm print:inset-8"></div>

              {/* Rivets */}
              <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:top-5 print:left-5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
              </div>
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:top-5 print:right-5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
              </div>
              <div className="absolute bottom-3 left-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:bottom-5 print:left-5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
              </div>
              <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 border border-gray-400 shadow-sm z-20 flex items-center justify-center print:bottom-5 print:right-5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-600/50"></div>
              </div>

              <div className="w-full h-full pt-16 pb-12 px-16 md:px-24 flex flex-col items-center text-center relative z-0 print:pt-20 print:pb-16 print:px-28">
                <div className="flex items-center justify-center mb-6 h-[80px]">
                  <img
                    src={logo}
                    alt="JT Obras e Manutenções"
                    className="h-full object-contain max-w-[200px]"
                  />
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-[0.2em] text-[#005A9C] uppercase">
                  CERTIFICADO
                </h1>
                <h2 className="text-xl md:text-xl font-bold italic mb-8 text-gray-800 uppercase px-4">
                  "{data.courseName}"
                </h2>

                <div className="text-base leading-[2] text-justify mb-8 text-gray-800 w-full px-4 md:px-12 print:px-12">
                  <span className="inline">Certificamos que o colaborador </span>
                  <span className="font-bold uppercase border-b border-black inline-block min-w-[250px] text-center px-2">
                    {data.employeeName || '______________________________________'}
                  </span>
                  <span className="inline">, da empresa </span>
                  <span className="font-bold uppercase inline">{data.companyName}</span>
                  <span className="inline">
                    , CNPJ {data.companyCnpj} participou do seguinte programa:
                  </span>
                </div>

                <div
                  className="text-sm md:text-base leading-relaxed text-center mb-6 text-gray-800 w-full px-10 md:px-20 font-medium print:px-20"
                  dangerouslySetInnerHTML={{ __html: data.courseDesc }}
                />

                <div className="text-base text-center mb-10 text-gray-800 w-full">
                  <span className="inline">
                    conforme estabelecido nas Normas Regulamentadoras, com carga horária de{' '}
                  </span>
                  <span className="font-bold">{String(data.workload).padStart(2, '0')}</span>
                  <span className="inline"> horas.</span>
                </div>

                <p className="text-base font-bold mt-auto mb-10 text-gray-800">
                  {data.location}, {formattedDate}.
                </p>

                <div className="flex justify-around items-end w-full px-4 md:px-12 print:px-12 gap-8 mb-4">
                  <div className="flex flex-col items-center w-full max-w-[260px] relative">
                    {data.collaboratorSignature ? (
                      <img
                        src={data.collaboratorSignature}
                        className="absolute -top-16 h-20 mix-blend-multiply print:mix-blend-normal z-10"
                        alt="Assinatura Colaborador"
                      />
                    ) : null}
                    <div className="w-full border-t border-black mb-2"></div>
                    <p className="font-bold text-sm text-gray-900 text-center truncate w-full">
                      {data.employeeName || 'Colaborador'}
                    </p>
                    <p className="text-[10px] font-bold text-gray-800 mt-1">
                      CPF: {data.employeeCpf || '___.___.___-__'}
                    </p>
                  </div>

                  <div className="flex flex-col items-center w-full max-w-[260px] relative">
                    {data.signature === 'govbr' ? (
                      <div className="absolute -top-12 border-2 border-[#005A9C] px-4 py-1 rounded bg-white print:border-[#005A9C] print:bg-white print:shadow-none z-10">
                        <span className="text-[11px] font-black text-[#005A9C] print:text-[#005A9C] tracking-widest block">
                          ASSINADO DIGITALMENTE
                        </span>
                        <span className="text-[9px] font-bold text-[#009FE3] print:text-[#009FE3] block">
                          VIA PORTAL GOV.BR
                        </span>
                      </div>
                    ) : data.signature ? (
                      <img
                        src={data.signature}
                        className="absolute -top-16 h-20 mix-blend-multiply print:mix-blend-normal z-10"
                        alt="Assinatura Técnico"
                      />
                    ) : null}

                    <div className="w-full border-t border-black mb-2"></div>
                    <p className="font-bold text-sm text-gray-900 text-center truncate w-full">
                      {data.signerName}
                    </p>
                    <p className="text-xs font-semibold text-gray-700 text-center">
                      {data.signerRole}
                    </p>
                    <p className="text-[10px] font-bold text-gray-800 mt-1">
                      MTE/SP: {data.signerMte}
                    </p>
                    <p className="text-[10px] font-bold text-gray-800">CREA: {data.signerCrea}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Page */}
            <div className="relative bg-white w-[1040px] h-[735px] shrink-0 shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] print:overflow-hidden p-16 md:p-24 select-none flex flex-col print:p-24">
              <div className="flex items-center justify-between mb-10 border-b-2 border-[#005A9C] pb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#005A9C] tracking-wide uppercase">
                    CONTEÚDO PROGRAMÁTICO
                  </h2>
                  <p className="text-sm text-[#005A9C] font-bold mt-1 uppercase">
                    {data.courseName}
                  </p>
                </div>
                <img src={logo} alt="JT Obras" className="h-16 object-contain" />
              </div>

              <div className="flex-1 w-full text-gray-800 overflow-hidden print:overflow-visible">
                <div
                  className="prose prose-blue max-w-none text-sm md:text-base leading-relaxed prose-li:my-1.5 prose-ul:list-disc prose-ul:pl-5"
                  dangerouslySetInnerHTML={{ __html: data.syllabus }}
                />
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between text-sm text-gray-500 font-medium">
                <p>
                  Nome:{' '}
                  <span className="font-bold text-gray-700">
                    {data.employeeName || '________________________'}
                  </span>
                </p>
                {data.employeeCpf && (
                  <p>
                    CPF: <span className="font-bold text-gray-700">{data.employeeCpf}</span>
                  </p>
                )}
                <p>
                  Carga Horária:{' '}
                  <span className="font-bold text-gray-700">
                    {String(data.workload).padStart(2, '0')} horas
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
