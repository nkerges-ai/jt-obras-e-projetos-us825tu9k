import { MessageCircle } from 'lucide-react'

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/5511940037545"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] transition-all hover:-translate-y-1 hover:scale-105 duration-300 ring-4 ring-[#25D366]/20"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}
