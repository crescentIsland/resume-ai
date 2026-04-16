'use client'

interface Step {
  label: string
}

interface Props {
  steps: Step[]
  current: number
}

export default function StepWizard({ steps, current }: Props) {
  return (
    <div className="w-full">
      {/* Desktop: horizontal stepper */}
      <div className="hidden md:flex items-center justify-between mb-10 relative">
        {/* connecting line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 -z-0"
          style={{ backgroundColor: '#e8e0ff' }} />
        <div className="absolute top-4 left-0 h-0.5 -z-0 transition-all duration-500"
          style={{
            backgroundColor: '#5e55a2',
            width: `${(current / (steps.length - 1)) * 100}%`,
          }} />

        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          return (
            <div key={i} className="flex flex-col items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                style={{
                  backgroundColor: done ? '#91c53a' : active ? '#5e55a2' : '#fff',
                  color: done || active ? '#fff' : '#9999b3',
                  border: done || active ? 'none' : '2px solid #e8e0ff',
                }}>
                {done ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium whitespace-nowrap"
                style={{ color: active ? '#5e55a2' : done ? '#91c53a' : '#9999b3' }}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile: progress bar */}
      <div className="flex md:hidden items-center gap-3 mb-6">
        <span className="text-sm font-semibold" style={{ color: '#5e55a2' }}>
          第 {current + 1} 步 / 共 {steps.length} 步
        </span>
        <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: '#e8e0ff' }}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${((current + 1) / steps.length) * 100}%`,
              background: 'linear-gradient(90deg, #91c53a, #5e55a2)',
            }} />
        </div>
        <span className="text-sm font-medium" style={{ color: '#9999b3' }}>
          {steps[current].label}
        </span>
      </div>
    </div>
  )
}
