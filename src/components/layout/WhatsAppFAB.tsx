import { WhatsAppIcon } from '@/components/icons/WhatsAppIcon'

export function WhatsAppFAB() {
  const message = encodeURIComponent(
    'Olá, gostaria de saber mais sobre os serviços da JT Obras e solicitar um orçamento. Meu nome é: [SEU NOME], Telefone: [SEU TELEFONE], Tipo de Obra: [TIPO].',
  )

  return (
    <a
      href={`https://wa.me/5511940037545?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 md:bottom-8 right-6 z-[30] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 hover:shadow-2xl print:hidden"
      aria-label="Contact us on WhatsApp"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
