'use client'

import { MARKETS } from '@/lib/markets'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface MarketSelectorProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export function MarketSelector({ selected, onChange }: MarketSelectorProps) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    )
  }

  const toggleAll = () => {
    onChange(selected.length === MARKETS.length ? [] : MARKETS.map((m) => m.id))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          {selected.length} of {MARKETS.length} markets selected
        </span>
        <button
          onClick={toggleAll}
          className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
        >
          {selected.length === MARKETS.length ? 'Deselect all' : 'Select all'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {MARKETS.map((market) => {
          const isSelected = selected.includes(market.id)
          return (
            <button
              key={market.id}
              onClick={() => toggle(market.id)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all duration-150',
                isSelected
                  ? 'border-violet-300 bg-violet-50 text-zinc-900'
                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
              )}
            >
              <span className="text-xl leading-none">{market.flag}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{market.name}</p>
                <p className="text-xs text-zinc-500 truncate">{market.language}</p>
              </div>
              <div className={cn(
                'w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center transition-all',
                isSelected ? 'bg-violet-600 border-violet-600' : 'border-zinc-300'
              )}>
                {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
