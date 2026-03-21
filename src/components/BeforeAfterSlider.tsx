import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  label?: string
}

export function BeforeAfterSlider({ beforeImage, afterImage, label }: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)

  return (
    <div className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden rounded-xl select-none group border shadow-sm bg-gray-100">
      <img src={afterImage} alt="Depois" className="absolute inset-0 w-full h-full object-cover" />
      <img
        src={beforeImage}
        alt="Antes"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <div
        className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex justify-center items-center shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 transition-all duration-75 ease-out"
        style={{ left: `calc(${sliderPosition}% - 2px)` }}
      >
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-200">
          <ArrowLeftRight className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={(e) => setSliderPosition(Number(e.target.value))}
        className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full m-0 z-20"
      />
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-sm pointer-events-none z-10 uppercase tracking-wider">
        Antes
      </div>
      <div className="absolute top-3 right-3 bg-brand-light text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded shadow-sm pointer-events-none z-10 uppercase tracking-wider">
        Depois
      </div>
      {label && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-sm pointer-events-none z-10 whitespace-nowrap truncate max-w-[90%]">
          {label}
        </div>
      )}
    </div>
  )
}
