import { Phone } from 'lucide-react'

export function WhatsAppFAB() {
  return (
    <a
      href="https://wa.me/5511940037545"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 animate-fade-in-up items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-green-600 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 md:bottom-8 md:right-8"
      aria-label="Fale com Joel no WhatsApp"
    >
      <Phone className="h-7 w-7 fill-current" />
    </a>
  )
}
