import { FadeIn } from '@/components/animations/FadeIn'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Como a empresa segue as normas de segurança (NRs)?',
    answer:
      'Nossa equipe é rigorosamente treinada e certificada nas principais normas regulamentadoras (NR 10, NR 18, NR 35), garantindo total segurança na execução de obras complexas, trabalhos em altura e instalações elétricas.',
  },
  {
    question: 'Como são estabelecidos os prazos dos projetos?',
    answer:
      'Trabalhamos com um cronograma detalhado aprovado previamente pelo cliente. Nosso compromisso é entregar a obra no prazo estipulado, mantendo a qualidade e transparência em todas as etapas.',
  },
  {
    question: 'Quais regiões vocês atendem?',
    answer:
      'Estamos localizados na Vila Guacuri, em São Paulo, e atendemos toda a região metropolitana, além de cidades vizinhas para projetos corporativos e industriais.',
  },
  {
    question: 'Em quanto tempo recebo um orçamento após a solicitação?',
    answer:
      'Após o envio do formulário ou contato inicial, nossa equipe analisa os detalhes e retorna em até 48 horas úteis para agendar uma visita técnica ou enviar a proposta preliminar.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-10 md:mb-12">
          <FadeIn>
            <span className="text-brand-orange font-bold tracking-wider uppercase text-xs mb-1 block">
              Dúvidas Frequentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mb-2">
              Perguntas Frequentes
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto">
              Respostas diretas sobre prazos, normas de segurança e orçamento.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.2}>
          <Accordion
            type="single"
            collapsible
            className="w-full shadow-sm border border-gray-100 rounded-2xl bg-gray-50/50 p-2 md:p-6"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-b border-gray-200 last:border-0 px-2 md:px-4"
              >
                <AccordionTrigger className="text-left font-semibold text-brand-navy hover:text-brand-light text-base md:text-lg py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}
