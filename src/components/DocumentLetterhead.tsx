import React from 'react'
import { cn } from '@/lib/utils'
import { Building2 } from 'lucide-react'

interface DocumentLetterheadProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
}

export function DocumentLetterhead({
  children,
  title,
  subtitle,
  className,
}: DocumentLetterheadProps) {
  return (
    <div
      className={cn(
        'bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:m-0 print:p-0 print-page-container flex flex-col',
        className,
      )}
    >
      {/* Visual Header Identity - A4 Optimized */}
      <div className="border-b-4 border-brand-navy shrink-0 print-header-group flex flex-row items-center justify-between px-6 py-5 lg:px-8 lg:py-6 bg-blue-50/50">
        <div className="flex items-center gap-4">
          <div className="bg-brand-navy p-2.5 rounded-lg text-white shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black tracking-widest text-brand-navy uppercase leading-none">
              JT Obras e<br />
              Manutenções
            </h1>
          </div>
        </div>
        <div className="text-[10px] text-right text-brand-navy/80 space-y-0.5 font-medium border-l-2 border-brand-light/30 pl-4">
          <p className="font-bold text-brand-navy">JT OBRAS E MANUTENÇÕES LTDA</p>
          <p>CNPJ 63.243.791/0001-09</p>
          <p>(11) 94003-7545</p>
          <p>São Paulo - SP</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-8 py-6 z-10 bg-white text-gray-800 text-[13px] leading-relaxed">
        {(title || subtitle) && (
          <div className="mb-6 text-center border-b border-gray-200 pb-4">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-brand-navy uppercase tracking-widest">
                {title}
              </h2>
            )}
            {subtitle && (
              <h3 className="text-sm font-semibold text-brand-light mt-1 uppercase tracking-wider">
                {subtitle}
              </h3>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Standardized Print Footer */}
      <div className="shrink-0 px-8 py-4 text-[9px] text-gray-500 flex justify-between items-end print-footer mt-auto bg-gray-50/50 border-t border-gray-200">
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
