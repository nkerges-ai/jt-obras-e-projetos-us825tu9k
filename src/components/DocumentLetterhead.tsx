import React from 'react'
import { cn } from '@/lib/utils'

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
        'bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] mx-auto print:shadow-none print:m-0 print:p-0 print-page-container flex flex-col relative overflow-hidden',
        className,
      )}
    >
      {/* Visual Header Identity */}
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden print-header-group">
        <svg
          viewBox="0 0 1000 300"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 w-full h-full z-0"
        >
          <rect width="1000" height="300" fill="#0A2240" />
          <path d="M 0,200 Q 400,300 1000,150 L 1000,300 L 0,300 Z" fill="#0B2C52" />
          <path d="M 300,300 C 600,150 800,250 1000,100 L 1000,300 L 300,300 Z" fill="#005A9C" />
          <path d="M 500,300 C 700,250 850,300 1000,180 L 1000,300 L 500,300 Z" fill="#009FE3" />
        </svg>

        <div className="absolute inset-0 z-10 p-[15mm] lg:p-[20mm] text-white flex flex-col items-start justify-start">
          <div className="border-[3px] border-white px-5 py-3 mb-4 mt-2 bg-[#0A2240]/40 backdrop-blur-sm shadow-sm">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-[0.2em] leading-tight font-sans">
              JT OBRAS E<br />
              MANUTENÇÕES
            </h1>
          </div>
          <div className="text-[11px] space-y-0.5 font-medium tracking-wide drop-shadow-md">
            <p>JT obras e manutenções</p>
            <p>CNPJ 63.243.791/0001-09</p>
            <p>(11) 94003-7545 whatsapp</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-[15mm] lg:px-[20mm] py-[10mm] z-10 bg-white text-gray-800 text-[13px] leading-relaxed relative">
        {(title || subtitle) && (
          <div className="mb-8 text-center border-b-2 border-brand-navy-light/10 pb-4">
            {title && (
              <h2 className="text-xl md:text-2xl font-bold text-brand-navy uppercase tracking-widest">
                {title}
              </h2>
            )}
            {subtitle && (
              <h3 className="text-sm font-semibold text-brand-light mt-1">{subtitle}</h3>
            )}
          </div>
        )}
        {children}
      </div>

      {/* Standardized Print Footer */}
      <div className="shrink-0 px-[15mm] lg:px-[20mm] pb-[10mm] text-[9px] text-gray-500 flex justify-between items-end print-footer mt-auto pt-4 bg-white relative z-10">
        <div className="flex flex-col space-y-0.5">
          <span className="font-bold text-brand-navy uppercase">DADOS CADASTRAIS DA EMPRESA:</span>
          <span>JT Obras e manutenções ltda - CNPJ 63.243.791/0001-09</span>
          <span>Rua Tommaso Giordani, 371 vila Guacuri – São Paulo - SP Cep- 04.475-210</span>
        </div>
        <span className="print:block hidden page-number font-medium">Página 1</span>
      </div>
    </div>
  )
}
