'use client'

import { OUTPUT_SPECS, SPEC_CATEGORIES } from '@/lib/specs'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface SpecSelectorProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

const categoryColorMap = {
  ecommerce: {
    badge: 'bg-violet-100 text-violet-700',
    check: 'bg-violet-600 border-violet-600',
  },
  ooh: {
    badge: 'bg-blue-100 text-blue-700',
    check: 'bg-blue-600 border-blue-600',
  },
  retail: {
    badge: 'bg-emerald-100 text-emerald-700',
    check: 'bg-emerald-600 border-emerald-600',
  },
}

export function SpecSelector({ selected, onChange }: SpecSelectorProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    )
  }

  const toggleCategory = (category: string) => {
    const categorySpecs = OUTPUT_SPECS.filter((s) => s.category === category).map((s) => s.id)
    const allSelected = categorySpecs.every((id) => selected.includes(id))
    if (allSelected) {
      onChange(selected.filter((id) => !categorySpecs.includes(id)))
    } else {
      const combined = [...selected, ...categorySpecs]
      const newSelected = combined.filter((id, idx) => combined.indexOf(id) === idx)
      onChange(newSelected)
    }
  }

  const categories = ['ecommerce', 'ooh', 'retail'] as const

  return (
    <div className="space-y-4">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider block">
        {selected.length} spec{selected.length !== 1 ? 's' : ''} selected · {selected.length} variant{selected.length !== 1 ? 's' : ''} per market
      </span>

      {categories.map((category) => {
        const specs = OUTPUT_SPECS.filter((s) => s.category === category)
        const colors = categoryColorMap[category]
        const allSelected = specs.every((s) => selected.includes(s.id))
        const info = SPEC_CATEGORIES[category]

        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', colors.badge)}>
                {info.label}
              </span>
              <button
                onClick={() => toggleCategory(category)}
                className="text-xs text-zinc-500 hover:text-zinc-700 font-medium transition-colors"
              >
                {allSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <div className="space-y-1.5">
              {specs.map((spec) => {
                const isSelected = selected.includes(spec.id)
                return (
                  <button
                    key={spec.id}
                    onClick={() => toggle(spec.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150',
                      isSelected
                        ? 'border-zinc-300 bg-zinc-50'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                    )}
                  >
                    <div className={cn(
                      'w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all',
                      isSelected ? colors.check : 'border-zinc-300'
                    )}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900">{spec.name}</p>
                      <p className="text-xs text-zinc-500">{spec.width}×{spec.height}px · {spec.aspectRatio}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
