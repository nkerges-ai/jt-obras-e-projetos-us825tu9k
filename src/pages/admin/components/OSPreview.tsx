import React from 'react'
import { DocumentLetterhead } from '@/components/DocumentLetterhead'
import { OS_TEXTS } from '@/lib/os-text'
import { ServiceOrder } from '@/lib/storage'
import { CheckCircle } from 'lucide-react'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-4 border border-brand-navy/20 rounded-md overflow-hidden bg-white shadow-sm">
    <h2 className="font-bold text-[12px] bg-brand-navy text-white px-3 py-1.5 uppercase tracking-wider">
      {title}
    </h2>
    <div className="p-3 text-[12px] text-gray-800 leading-relaxed bg-gray-50/30">{children}</div>
  </div>
)

export function OSPreview({ data }: { data: Partial<ServiceOrder> }) {
  return (
    <DocumentLetterhead
      title="Ordem de Serviço de Segurança"
      subtitle={`Nº OS: ${data.osNumber || '----'} | Revisão: ${data.revision}`}
    >
      <main className="flex-1 text-[12px] text-gray-800 leading-tight">
        <Section title="1. IDENTIFICAÇÃO E LOCAL">
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="border border-brand-light/20 p-2.5 rounded bg-white">
              <strong className="block border-b border-gray-200 mb-1.5 pb-1 text-[11px] text-brand-navy">
                1.1. EMPRESA CONTRATANTE
              </strong>
              Razão Social: JT OBRAS E MANUTENÇÕES LTDA
              <br />
              CNPJ: 63.243.791/0001-09
              <br />
              Endereço: Rua Tommaso Giordani, 371 - SP
              <br />
              Resp: Joel Nascimento de Paula | Tel: (11) 94003-7545
            </div>
            <div className="border border-brand-light/20 p-2.5 rounded bg-white">
              <strong className="block border-b border-gray-200 mb-1.5 pb-1 text-[11px] text-brand-navy">
                1.2. PRESTADORA / CLIENTE
              </strong>
              Nome: {data.prestadora?.nome || '____________________'}
              <br />
              CNPJ: {data.prestadora?.cnpj || '____________________'}
              <br />
              Endereço: {data.prestadora?.endereco || '____________________'}
              <br />
              Resp: {data.prestadora?.responsavel || '____________________'} | Tel:{' '}
              {data.prestadora?.telefone || '______'}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="col-span-2 border border-brand-light/20 p-2.5 rounded bg-white">
              <strong className="text-brand-navy">1.3. LOCAL DA EXECUÇÃO:</strong>{' '}
              {data.execucao?.local || '________________'}
            </div>
            <div className="border border-brand-light/20 p-2.5 rounded bg-white text-center">
              <strong className="text-brand-navy">DATA (PREVISTA):</strong>
              <br />
              {data.execucao?.dataInicio || '__/__/____'} a {data.execucao?.dataFim || '__/__/____'}
            </div>
          </div>
          <div className="border border-brand-light/20 p-2.5 rounded bg-white">
            <strong className="text-brand-navy block mb-1">
              1.4. ATIVIDADE A SER EXECUTADA (SETOR: {data.atividade?.setor || '_______________'}):
            </strong>
            <div className="mt-1 whitespace-pre-wrap font-medium p-2 bg-gray-50 border border-gray-100 rounded">
              {data.atividade?.descricao || 'Nenhuma descrição fornecida.'}
            </div>
          </div>
        </Section>

        <Section title="2. EQUIPAMENTOS DE PROTEÇÃO E SEGURANÇA">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <strong className="block border-b border-brand-light/30 mb-2 pb-1 text-brand-navy">
                2.1 EPIs OBRIGATÓRIOS INDIVIDUAIS
              </strong>
              <div className="grid grid-cols-1 gap-1 mt-1 font-medium text-gray-700">
                {data.epis?.map((e) => (
                  <div key={e} className="flex gap-2 items-start">
                    <span className="text-brand-light font-bold">[X]</span> <span>{e}</span>
                  </div>
                ))}
                {(!data.epis || data.epis.length === 0) && (
                  <span className="text-gray-400 italic">Nenhum EPI selecionado.</span>
                )}
              </div>
            </div>
            <div>
              <strong className="block border-b border-brand-light/30 mb-2 pb-1 text-brand-navy">
                2.2 EPCs OBRIGATÓRIOS COLETIVOS
              </strong>
              <div className="grid grid-cols-1 gap-1 mt-1 font-medium text-gray-700">
                {data.epcs?.map((e) => (
                  <div key={e} className="flex gap-2 items-start">
                    <span className="text-brand-light font-bold">[X]</span> <span>{e}</span>
                  </div>
                ))}
                {(!data.epcs || data.epcs.length === 0) && (
                  <span className="text-gray-400 italic">Nenhum EPC selecionado.</span>
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section title="3. DISPOSIÇÕES E REGRAS GERAIS">
          <p className="text-justify mb-3 text-[11px] leading-relaxed">{OS_TEXTS.objetivo}</p>
          <p className="text-justify text-[11px] leading-relaxed font-medium">
            {OS_TEXTS.disposicoes}
          </p>
        </Section>

        <div className="border-2 border-brand-navy/80 rounded-lg p-5 mt-6 bg-brand-light/5 break-inside-avoid">
          <h2 className="font-bold text-[13px] uppercase mb-3 text-center tracking-widest text-brand-navy">
            4. TERMO DE RESPONSABILIDADE
          </h2>
          <p className="italic text-justify px-4 mb-8 text-[11px] leading-relaxed">
            "{OS_TEXTS.controle}"
          </p>

          <div className="flex justify-between text-center pt-8 px-6">
            <div className="w-1/2 mx-4 flex flex-col items-center">
              {data.adminSignature?.type === 'govbr' ? (
                <div className="flex flex-col items-center justify-center h-12 mb-2 text-center">
                  <span className="text-[9px] font-bold text-brand-navy border border-brand-navy px-2 py-1 rounded bg-white">
                    ASSINADO GOV.BR
                  </span>
                </div>
              ) : data.adminSignature?.data ? (
                <div className="h-12 flex items-center justify-center mb-2">
                  <img
                    src={data.adminSignature.data}
                    className="max-h-full mix-blend-multiply"
                    alt="Assinatura"
                  />
                </div>
              ) : (
                <div className="border-t border-black w-full mb-2 mt-8"></div>
              )}
              {data.adminSignature && data.adminSignature.type !== 'govbr' && (
                <div className="border-t border-black w-full mb-2"></div>
              )}
              <p className="font-bold text-xs text-brand-navy">JT OBRAS E MANUTENÇÕES</p>
              <p className="text-[10px]">Joel Nascimento de Paula</p>
              {data.adminSignature?.biometric && (
                <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold mt-1">
                  <CheckCircle className="h-3 w-3" /> Validação Emissora
                </p>
              )}
            </div>

            <div className="w-1/2 mx-4 flex flex-col items-center">
              {!data.biometricValidation && (
                <div className="border-t border-black pt-1 w-full mt-10">
                  <p className="font-bold text-xs text-brand-navy">PRESTADORA / COLABORADOR</p>
                  <p className="text-[10px]">{data.prestadora?.responsavel || 'Assinatura'}</p>
                </div>
              )}
              {data.biometricValidation && (
                <div className="flex flex-col items-center w-full">
                  <div className="border-t border-black w-full mb-2 mt-8"></div>
                  <p className="font-bold text-xs text-brand-navy">PRESTADORA / COLABORADOR</p>
                  <p className="text-[10px]">{data.prestadora?.responsavel}</p>
                  <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold mt-1">
                    <CheckCircle className="h-3 w-3" /> Assinatura Eletrônica
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </DocumentLetterhead>
  )
}
