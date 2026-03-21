import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardStepperProps {
  steps: string[]
  currentStep: number
  setStep: (step: number) => void
}

export function WizardStepper({ steps, currentStep, setStep }: WizardStepperProps) {
  return (
    <div className="flex justify-between items-center mb-8 relative w-full max-w-3xl mx-auto print:hidden pt-8 px-4">
      <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
      <div
        className="absolute top-1/2 left-4 h-1 bg-brand-light -z-10 -translate-y-1/2 transition-all duration-300 rounded-full"
        style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 2rem)` }}
      ></div>

      {steps.map((s, i) => {
        const isCompleted = currentStep > i + 1
        const isActive = currentStep === i + 1
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-2 cursor-pointer relative"
            onClick={() => {
              if (i + 1 < currentStep || isCompleted) setStep(i + 1)
            }}
          >
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300',
                isActive
                  ? 'bg-brand-light border-brand-light text-white ring-4 ring-brand-light/20 scale-110'
                  : isCompleted
                    ? 'bg-brand-navy border-brand-navy text-white'
                    : 'bg-white border-gray-300 text-gray-400',
              )}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'text-[10px] sm:text-xs font-medium absolute -bottom-6 whitespace-nowrap transition-colors duration-300',
                isActive
                  ? 'text-brand-light font-bold'
                  : isCompleted
                    ? 'text-brand-navy'
                    : 'text-gray-400',
              )}
            >
              {s}
            </span>
          </div>
        )
      })}
    </div>
  )
}
