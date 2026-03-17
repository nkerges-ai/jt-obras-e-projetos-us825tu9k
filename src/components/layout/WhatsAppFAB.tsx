import { MessageCircle } from 'lucide-react'

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/5511940037575"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#20bd5a] transition-colors animate-pulse-soft hover:scale-110 duration-300"
      aria-label="Contact via WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  )
}
