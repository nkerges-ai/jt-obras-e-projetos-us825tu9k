import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer, Save, Fingerprint, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { addAuditLog, getTechnicalDocuments, saveTechnicalDocuments } from '@/lib/storage'
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

const CERTIFICATE_TEMPLATES: Record<
  string,
  { courseName: string; courseDesc: string; workload: string; syllabus: string }
> = {
  'NR-06': {
    courseName: 'NR-06 EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL - EPI',
    courseDesc:
      '<p>Treinamento sobre o uso adequado, guarda e conservação de Equipamentos de Proteção Individual (EPI), conforme as diretrizes da Norma Regulamentadora NR-06.</p>',
    workload: '04 (Quatro)',
    syllabus:
      '<ul><li>Importância do EPI</li><li>Seleção do EPI adequado</li><li>Uso correto</li><li>Manutenção e conservação</li><li>Responsabilidades do empregador e do empregado</li></ul>',
  },
  'NR-10': {
    courseName: 'NR-10 SEGURANÇA EM INSTALAÇÕES E SERVIÇOS EM ELETRICIDADE',
    courseDesc:
      '<p>Treinamento Básico de Segurança em Instalações e Serviços com Eletricidade, abordando os riscos elétricos, medidas de controle e primeiros socorros, em conformidade com a Norma Regulamentadora NR-10.</p>',
    workload: '40 (Quarenta)',
    syllabus:
      '<ul><li>Introdução à segurança com eletricidade</li><li>Riscos em instalações e serviços com eletricidade</li><li>Técnicas de análise de risco</li><li>Medidas de controle do risco elétrico</li><li>EPI/EPC (Equipamentos de Proteção Individual e Coletiva)</li><li>Procedimentos e rotinas de trabalho</li><li>Noções de combate a incêndio</li><li>Noções de primeiros socorros</li></ul>',
  },
  'NR-18': {
    courseName: 'NR-18 CONDIÇÕES DE SEGURANÇA E SAÚDE NO TRABALHO NA INDÚSTRIA DA CONSTRUÇÃO',
    courseDesc:
      '<p>Treinamento admissional/periódico abordando os riscos inerentes à função, condições do ambiente de trabalho, uso de EPI e EPC, de acordo com a Norma Regulamentadora NR-18.</p>',
    workload: '06 (Seis)',
    syllabus:
      '<ul><li>Condições do ambiente de trabalho</li><li>Medidas de proteção coletiva</li><li>Equipamentos de proteção individual</li><li>Sinalização de segurança</li><li>Procedimentos operacionais para a fase específica da obra</li></ul>',
  },
  'NR-35': {
    courseName: 'NR-35 SEGURANÇA E SAÚDE NOS TRABALHOS EM ALTURA',
    courseDesc:
      '<p>Curso de capacitação para trabalhos em altura, englobando normas, análise de risco, sistemas de proteção contra quedas e condutas em situações de emergência, conforme estabelecido pela Norma Regulamentadora NR-35.</p>',
    workload: '08 (Oito)',
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
      const docs = getTechnicalDocuments()
      const doc = docs.find((d) => d.id === id)
      if (doc && doc.data) {
        setData(doc.data)
      }
    }
  }, [id])

  const handleSave = () => {
    const docs = getTechnicalDocuments()
    const newDoc = {
      id: id || `cert_${Date.now()}`,
      name: `Certificado_${data.employeeName || 'Colaborador'}_${data.courseName.split(' ')[0]}.pdf`,
      category: 'Certificado',
      uploadDate: new Date().toISOString(),
      projectId: 'global',
      isRestricted: false,
      url: 'data:application/pdf;base64,dummy',
      type: 'certificado' as const,
      data: data,
    }

    if (id) {
      saveTechnicalDocuments(docs.map((d) => (d.id === id ? newDoc : d)))
    } else {
      saveTechnicalDocuments([newDoc, ...docs])
    }

    addAuditLog({
      userId: 'Admin',
      action: id ? 'Editar Certificado' : 'Gerar Certificado',
      table: 'Documentos',
      newData: JSON.stringify(data),
    })
    toast({ title: 'Salvo no Acervo', description: 'Certificado salvo com sucesso.' })
  }

  const signGovbr = () => {
    setData({ ...data, signature: 'govbr' })
    toast({ title: 'Validado Gov.br', description: 'Assinatura digital Gov.br aplicada.' })
  }

  const exportWord = () => {
    const el = document.getElementById('certificate-preview')
    if (el)
      exportHtmlToWord(el.outerHTML, `Certificado_${data.employeeName || 'Modelo'}`, 'landscape')
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 print:bg-gray-100 print:pb-0">
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
          /* Hide main layout elements when printing certificate */
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
        <div className="w-full xl:w-[480px] shrink-0 bg-white p-6 rounded-xl border shadow-sm print:hidden h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
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
                  onChange={(e) => setData({ ...data, employeeName: e.target.value })}
                  placeholder="Nome completo"
                />
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
                  }}
                  placeholder="000.000.000-00"
                />
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

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1.5">
                <Label>Título do Curso</Label>
                <Input
                  value={data.courseName}
                  onChange={(e) => setData({ ...data, courseName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Carga Horária</Label>
                <Input
                  value={data.workload}
                  onChange={(e) => setData({ ...data, workload: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  value={data.date}
                  onChange={(e) => setData({ ...data, date: e.target.value })}
                />
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
                <Label className="font-bold text-gray-800">Assinatura</Label>
                <SignatureInput
                  value={data.signature}
                  onChange={(val) => setData({ ...data, signature: val })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center overflow-x-auto print:overflow-visible pb-12 gap-12">
          <div
            id="certificate-preview"
            className="flex flex-col gap-12 items-center w-full max-w-[1040px] print:w-full print:max-w-none print:gap-0 print:block"
          >
            {/* Front Page */}
            <div className="relative bg-white w-full aspect-[1.414/1] md:w-[1040px] md:h-[735px] shrink-0 shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] print:overflow-hidden p-4 select-none print-page-break">
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
              <div className="w-full h-full pt-12 pb-10 px-16 md:px-24 flex flex-col items-center text-center relative z-0">
                {/* JT Branding Integration */}
                <div className="flex items-center justify-center mb-6 h-[70px]">
                  <img src={logo} alt="JT Obras e Manutenções" className="h-full object-contain" />
                </div>

                <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-[0.2em] text-[#005A9C] uppercase">
                  CERTIFICADO
                </h1>
                <h2 className="text-xl md:text-2xl font-bold italic mb-6 text-gray-800 px-4">
                  "{data.courseName}"
                </h2>

                <div className="text-base md:text-lg leading-[2] md:leading-[2.2] text-justify mb-8 text-gray-800 w-full px-4 md:px-12">
                  <span className="inline">Certificamos que o colaborador </span>
                  <span className="font-bold uppercase border-b border-black inline px-2">
                    {data.employeeName || '______________________________________'}
                  </span>
                  {data.employeeCpf && (
                    <>
                      <span className="inline">, portador do CPF </span>
                      <span className="font-bold uppercase inline">{data.employeeCpf}</span>
                    </>
                  )}
                  <span className="inline">, da empresa </span>
                  <span className="font-bold uppercase inline">{data.companyName}</span>
                  <span className="inline">
                    , CNPJ {data.companyCnpj} participou do seguinte programa:
                  </span>

                  <div
                    className="prose prose-sm md:prose-base mx-auto my-5 text-center text-gray-800 leading-relaxed font-medium"
                    dangerouslySetInnerHTML={{ __html: data.courseDesc }}
                  />

                  <span className="inline block text-center mt-4 md:mt-6">
                    conforme estabelecido nas Normas Regulamentadoras, com carga horária de{' '}
                    <span className="font-bold">{data.workload}</span> horas.
                  </span>
                </div>

                <p className="text-base md:text-lg font-bold mb-10 text-gray-800">
                  {data.location}, {data.date}.
                </p>

                <div className="mt-auto flex flex-col items-center w-full max-w-xs md:max-w-sm relative">
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
                      className="absolute -top-12 h-16 mix-blend-multiply print:mix-blend-normal z-10"
                      alt="Assinatura"
                    />
                  ) : null}

                  <div className="w-full border-t border-black mb-2"></div>
                  <p className="font-bold text-base md:text-lg text-gray-900">{data.signerName}</p>
                  <p className="text-xs md:text-sm font-semibold text-gray-700">
                    {data.signerRole}
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-800 mt-1">
                    MTE/SP: {data.signerMte}
                  </p>
                  <p className="text-xs md:text-sm font-bold text-gray-800">
                    CREA: {data.signerCrea}
                  </p>
                </div>
              </div>
            </div>

            {/* Back Page (Syllabus) */}
            <div className="relative bg-white w-full aspect-[1.414/1] md:w-[1040px] md:h-[735px] shrink-0 shadow-2xl print:shadow-none print:w-[297mm] print:h-[209.5mm] print:overflow-hidden p-12 md:p-20 select-none flex flex-col print:pt-16">
              <div className="flex items-center justify-between mb-8 border-b-2 border-[#005A9C] pb-4">
                <div>
                  <h2 className="text-2xl font-black text-[#005A9C] tracking-wide">
                    CONTEÚDO PROGRAMÁTICO
                  </h2>
                  <p className="text-gray-600 font-semibold mt-1">{data.courseName}</p>
                </div>
                <img src={logo} alt="JT Obras" className="h-12 object-contain" />
              </div>

              <div className="flex-1 w-full text-gray-800 overflow-hidden print:overflow-visible">
                <div
                  className="prose prose-blue max-w-none text-justify prose-headings:text-[#005A9C] prose-li:my-1 prose-ul:my-2 prose-p:my-2"
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
                  <span className="font-bold text-gray-700">{data.workload} horas</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
