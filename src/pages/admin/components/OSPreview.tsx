import React from 'react'
import logo from '@/assets/logotipo-c129e.jpg'
import { OS_TEXTS } from '@/lib/os-text'
import { ServiceOrder } from '@/lib/storage'
import { CheckCircle } from 'lucide-react'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-3 border border-gray-300 rounded-sm">
    <h2 className="font-bold text-[11px] bg-gray-200 px-2 py-0.5 border-b border-gray-300 uppercase">
      {title}
    </h2>
    <div className="p-1.5 text-[11px]">{children}</div>
  </div>
)

export function OSPreview({ data }: { data: Partial<ServiceOrder> }) {
  return (
    <div className="flex-1 flex justify-center print:block print:w-full">
      <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] p-[15mm] text-[11px] text-gray-800 leading-tight print:shadow-none print:m-0 print:p-[10mm]">
        <header className="flex justify-between items-center border-b-2 border-brand-orange pb-2 mb-3">
          <img src={logo} className="h-10 object-contain" alt="JT Obras Logo" />
          <div className="text-right">
            <h1 className="font-bold text-sm text-brand-navy">ORDEM DE SERVIÇO - NR01</h1>
            <p className="font-medium mt-0.5">
              Nº OS: <span className="text-red-600">{data.osNumber || '----'}</span> | Revisão:{' '}
              {data.revision}
            </p>
          </div>
        </header>

        <main>
          <Section title="1. IDENTIFICAÇÃO">
            <div className="grid grid-cols-2 gap-2 mb-1.5">
              <div className="border p-1.5 rounded-sm">
                <strong className="block border-b mb-1 pb-0.5 text-[10px]">
                  1.1. EMPRESA CONTRATANTE
                </strong>
                Razão Social: JT OBRAS E MANUTENÇÕES LTDA
                <br />
                CNPJ: 63.243.791/0001-09
                <br />
                Rua Tommaso Giordani, 371 - São Paulo - SP
                <br />
                Resp: Joel Nascimento de Paula | Tel: (11) 94003-7545
              </div>
              <div className="border p-1.5 rounded-sm">
                <strong className="block border-b mb-1 pb-0.5 text-[10px]">
                  1.2. EMPRESA PRESTADORA
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
            <div className="grid grid-cols-3 gap-2 mb-1.5">
              <div className="col-span-2 border p-1.5 rounded-sm">
                <strong>1.3. LOCAL DA EXECUÇÃO:</strong>{' '}
                {data.execucao?.local || '________________'}
              </div>
              <div className="border p-1.5 rounded-sm">
                <strong>DATA:</strong> {data.execucao?.dataInicio || '__/__/____'} a{' '}
                {data.execucao?.dataFim || '__/__/____'}
              </div>
            </div>
            <div className="border p-1.5 rounded-sm">
              <strong>
                1.4. ATIVIDADE A SER EXECUTADA (SETOR: {data.atividade?.setor || '_______________'}
                ):
              </strong>
              <div className="mt-1 whitespace-pre-wrap">
                {data.atividade?.descricao || 'Nenhuma descrição fornecida.'}
              </div>
            </div>
          </Section>

          <Section title="2. OBJETIVO DA ORDEM DE SERVIÇO">
            <p className="text-justify">{OS_TEXTS.objetivo}</p>
          </Section>

          <Section title="3. RESPONSABILIDADES">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>3.1 DA CONTRATANTE</strong>
                <ul className="list-disc pl-4 mt-1">
                  {OS_TEXTS.respContratante.map((i, k) => (
                    <li key={k}>{i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>3.2 DA PRESTADORA</strong>
                <ul className="list-disc pl-4 mt-1">
                  {OS_TEXTS.respPrestadora.map((i, k) => (
                    <li key={k}>{i}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section title="4. EQUIPAMENTOS DE PROTEÇÃO (EPIs e EPCs)">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong className="block border-b mb-1">4.1 EPIs OBRIGATÓRIOS</strong>
                <div className="grid grid-cols-1 gap-0.5 mt-1">
                  {data.epis?.map((e) => (
                    <div key={e}>[ X ] {e}</div>
                  ))}
                  {(!data.epis || data.epis.length === 0) && 'Nenhum EPI selecionado.'}
                </div>
              </div>
              <div>
                <strong className="block border-b mb-1">4.2 EPCs OBRIGATÓRIOS</strong>
                <div className="grid grid-cols-1 gap-0.5 mt-1">
                  {data.epcs?.map((e) => (
                    <div key={e}>[ X ] {e}</div>
                  ))}
                  {(!data.epcs || data.epcs.length === 0) && 'Nenhum EPC selecionado.'}
                </div>
              </div>
            </div>
          </Section>

          {data.compliance && (data.compliance.esocial || data.compliance.receita) && (
            <Section title="5. DADOS DE CONFORMIDADE REGULATÓRIA">
              <div className="grid grid-cols-2 gap-4">
                {data.compliance.esocial && (
                  <div>
                    <strong className="block mb-0.5 text-[10px]">REGISTRO ESOCIAL:</strong>
                    {data.compliance.esocial}
                  </div>
                )}
                {data.compliance.receita && (
                  <div>
                    <strong className="block mb-0.5 text-[10px]">RECEITA FEDERAL:</strong>
                    {data.compliance.receita}
                  </div>
                )}
              </div>
            </Section>
          )}

          <Section title="6. DISPOSIÇÕES FINAIS">
            <p className="text-justify">{OS_TEXTS.disposicoes}</p>
          </Section>

          <div className="border border-gray-300 rounded-sm p-3 mt-4 bg-gray-50/50">
            <h2 className="font-bold text-[11px] uppercase mb-2 text-center underline">
              7. CONTROLE DE CIÊNCIA E TREINAMENTO
            </h2>
            <p className="italic text-justify px-2 mb-6">"{OS_TEXTS.controle}"</p>
            <div className="flex justify-between text-center pt-8 px-6">
              <div className="w-1/2 mx-4 flex flex-col items-center">
                {data.adminSignature?.type === 'govbr' ? (
                  <div className="flex flex-col items-center justify-center h-10 mb-1 text-center">
                    <span className="text-[8px] font-bold text-blue-800 border border-blue-800 px-1.5 py-0.5 rounded bg-blue-50">
                      ASSINADO GOV.BR
                    </span>
                  </div>
                ) : data.adminSignature?.data ? (
                  <div className="h-10 flex items-center justify-center mb-1">
                    <img
                      src={data.adminSignature.data}
                      className="max-h-full mix-blend-multiply"
                      alt="Assinatura Admin"
                    />
                  </div>
                ) : (
                  <div className="border-t border-black w-full mb-1 mt-6"></div>
                )}
                {data.adminSignature && data.adminSignature.type !== 'govbr' && (
                  <div className="border-t border-black w-full mb-1"></div>
                )}

                <p className="font-bold">JT OBRAS E MANUTENÇÕES</p>
                <p>Joel Nascimento de Paula</p>

                {data.adminSignature?.biometric && (
                  <p className="text-[8px] text-green-600 flex items-center gap-1 font-bold mt-1">
                    <CheckCircle className="h-2 w-2" /> Validação Emissora
                  </p>
                )}
              </div>

              <div className="w-1/2 mx-4 flex flex-col items-center">
                {!data.biometricValidation && (
                  <div className="border-t border-black pt-1 w-full mt-6">
                    <p className="font-bold">PRESTADORA / COLABORADOR</p>
                    <p>{data.prestadora?.responsavel || 'Assinatura'}</p>
                  </div>
                )}
                {data.biometricValidation && (
                  <div className="flex flex-col items-center w-full">
                    <div className="border-t border-black w-full mb-1 mt-6"></div>
                    <p className="font-bold">PRESTADORA / COLABORADOR</p>
                    <p>{data.prestadora?.responsavel}</p>
                    <p className="text-[9px] text-green-600 flex items-center gap-1 font-bold mt-1">
                      <CheckCircle className="h-2 w-2" /> Assinatura Biométrica
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 border border-gray-300 rounded p-1 bg-white">
                      <img
                        src={data.biometricValidation.imageUrl}
                        className="w-5 h-5 rounded-full object-cover"
                        alt="Biometria"
                      />
                      <div className="text-[7px] text-left leading-tight">
                        <p className="font-bold text-gray-700">Validação Facial Confirmada</p>
                        <p className="text-gray-500">
                          {new Date(data.biometricValidation.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
