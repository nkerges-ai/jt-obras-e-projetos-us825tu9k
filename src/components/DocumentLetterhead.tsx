import React from 'react'
import { cn } from '@/lib/utils'
import logo from '@/assets/logotipo-c129e.jpg'
import { ExportDocumentDialog } from './ExportDocumentDialog'

interface DocumentLetterheadProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  docNumber?: string
  className?: string
}

export function DocumentLetterhead({
  children,
  title,
  subtitle,
  docNumber,
  className,
}: DocumentLetterheadProps) {
  return (
    <div
      id="document-letterhead-root"
      className={cn(
        'bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:max-w-none print:w-full print:shadow-none print:m-0 print:p-0 print-page-container flex flex-col relative',
        className,
      )}
    >
      {/* Export Action Bar (Hidden on Print) */}
      <div className="print:hidden bg-gray-50 border-b border-gray-200 px-8 py-3 flex justify-between items-center shrink-0 rounded-t-lg">
        <span className="text-[11px] text-gray-500 font-bold uppercase tracking-wider">
          Visualização de Documento
        </span>
        <ExportDocumentDialog title={title || 'Documento Oficial'} />
      </div>

      {/* Visual Header Identity - Restored to Previous Version with Blue Tones */}
      <div className="border-b-[6px] border-[#005A9C] shrink-0 print-header-group flex flex-row items-center justify-between px-8 py-6 print:px-0 print:py-4 bg-white">
        <div className="flex items-center gap-4">
          <img src={logo} alt="JT Obras" className="h-16 object-contain" />
        </div>
        <div className="text-[10px] text-right text-brand-navy space-y-0.5 font-medium border-l-2 border-[#009FE3] pl-4">
          <p className="font-bold text-[11px] uppercase tracking-wider">
            JT OBRAS E MANUTENÇÕES LTDA
          </p>
          <p>CNPJ 63.243.791/0001-09</p>
          <p>(11) 94003-7545</p>
          <p>São Paulo - SP</p>
          {docNumber && (
            <p className="pt-1 mt-1 font-bold text-[#005A9C] border-t border-gray-200">
              Nº: {docNumber}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-10 py-8 print:px-0 print:py-4 z-10 bg-white text-gray-800 text-[13px] leading-relaxed relative">
        {(title || subtitle) && (
          <div className="mb-6 text-center border-b-2 border-gray-100 pb-4">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-brand-navy uppercase tracking-widest">
                {title}
              </h2>
            )}
            {subtitle && (
              <h3 className="text-sm font-semibold text-[#009FE3] mt-1.5 uppercase tracking-wider">
                {subtitle}
              </h3>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Standardized Print Footer */}
      <div className="shrink-0 px-10 py-4 print:px-0 text-[9px] text-gray-500 flex justify-between items-end print-footer mt-auto bg-gray-50 print:bg-white border-t border-gray-200">
        <div className="flex flex-col space-y-0.5">
          <span className="font-bold text-brand-navy uppercase tracking-wider">
            Dados Cadastrais Oficiais:
          </span>
          <span>JT Obras e manutenções ltda - CNPJ 63.243.791/0001-09</span>
          <span>Rua Tommaso Giordani, 371 vila Guacuri – São Paulo - SP | CEP 04475-210</span>
        </div>
        <span className="print:block hidden page-number font-medium text-brand-navy/60 uppercase tracking-widest">
          Documento Oficial
        </span>
      </div>
    </div>
  )
}
