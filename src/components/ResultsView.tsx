'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { LocalizationResult } from '@/lib/types'
import { getMarketById } from '@/lib/markets'
import { getSpecById, SPEC_CATEGORIES } from '@/lib/specs'
import { AlertTriangle, CheckCircle, Info, XCircle, Download, RefreshCw } from 'lucide-react'

interface ResultsViewProps {
  result: LocalizationResult
  imageUrl: string
  selectedMarkets: string[]
  selectedSpecs: string[]
  onReset: () => void
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 8 ? 'text-emerald-600' :
    score >= 6 ? 'text-amber-500' :
    'text-red-500'

  const bgColor =
    score >= 8 ? 'bg-emerald-50 border-emerald-200' :
    score >= 6 ? 'bg-amber-50 border-amber-200' :
    'bg-red-50 border-red-200'

  return (
    <div className={cn('inline-flex items-center justify-center w-14 h-14 rounded-full border-2 font-bold text-xl', color, bgColor)}>
      {score}
    </div>
  )
}

function ComplianceBadge({ status }: { status: 'pass' | 'warning' | 'fail' }) {
  if (status === 'pass') return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
      <CheckCircle className="w-3 h-3" /> Pass
    </span>
  )
  if (status === 'warning') return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
      <AlertTriangle className="w-3 h-3" /> Review
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> Fail
    </span>
  )
}

function FlagItem({ flag }: { flag: { flag: string; severity: string; description: string } }) {
  const styles = {
    critical: { icon: XCircle, className: 'text-red-600 bg-red-50 border-red-200' },
    warning: { icon: AlertTriangle, className: 'text-amber-600 bg-amber-50 border-amber-200' },
    info: { icon: Info, className: 'text-blue-600 bg-blue-50 border-blue-200' },
  }
  const { icon: Icon, className } = styles[flag.severity as keyof typeof styles] || styles.info

  return (
    <div className={cn('flex gap-2.5 p-3 rounded-xl border', className)}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-sm font-semibold">{flag.flag}</p>
        <p className="text-xs mt-0.5 opacity-80">{flag.description}</p>
      </div>
    </div>
  )
}

function VariantCard({
  specId,
  imageUrl,
  complianceStatus,
  notes,
}: {
  specId: string
  imageUrl: string
  complianceStatus: 'pass' | 'warning' | 'fail'
  notes: string
}) {
  const spec = getSpecById(specId)
  if (!spec) return null

  const categoryInfo = SPEC_CATEGORIES[spec.category]

  const categoryBadgeColor = {
    ecommerce: 'bg-violet-100 text-violet-700',
    ooh: 'bg-blue-100 text-blue-700',
    retail: 'bg-emerald-100 text-emerald-700',
  }[spec.category]

  // Calculate display ratio for preview container
  const ratio = spec.height / spec.width
  const maxWidth = 280

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="relative overflow-hidden bg-zinc-100"
        style={{ paddingBottom: `${Math.min(ratio * 100, 80)}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={spec.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', categoryBadgeColor)}>
            {categoryInfo.label}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <ComplianceBadge status={complianceStatus} />
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-zinc-900">{spec.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{spec.width}×{spec.height}px · {spec.aspectRatio}</p>
          </div>
          <button className="text-zinc-400 hover:text-zinc-600 transition-colors flex-shrink-0 mt-0.5">
            <Download className="w-4 h-4" />
          </button>
        </div>
        {notes && (
          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">{notes}</p>
        )}
      </div>
    </div>
  )
}

export function ResultsView({ result, imageUrl, selectedMarkets, selectedSpecs, onReset }: ResultsViewProps) {
  const [activeMarket, setActiveMarket] = useState(selectedMarkets[0])

  const passCount = Object.values(result.specs).filter((s) => s.complianceStatus === 'pass').length
  const totalSpecs = Object.keys(result.specs).length
  const avgScore = Math.round(
    Object.values(result.markets).reduce((sum, m) => sum + m.culturalFitScore, 0) /
    Object.keys(result.markets).length
  )

  const activeMarketData = result.markets[activeMarket]
  const activeMarketInfo = getMarketById(activeMarket)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-900">Localization Report</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{result.imageDescription}</p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 px-3 py-2 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          New analysis
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Markets Analyzed', value: selectedMarkets.length, sub: 'regions' },
          { label: 'Variants Generated', value: selectedSpecs.length, sub: 'output specs' },
          { label: 'Avg. Cultural Fit', value: `${avgScore}/10`, sub: 'across markets' },
          { label: 'Spec Compliance', value: `${passCount}/${totalSpecs}`, sub: 'specs passing' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-zinc-200 rounded-2xl p-4">
            <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
            <p className="text-sm font-medium text-zinc-700 mt-0.5">{stat.label}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-5 gap-6">
        {/* Market Insights - Left */}
        <div className="col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Market Insights</h3>

          {/* Market Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {selectedMarkets.map((marketId) => {
              const market = getMarketById(marketId)
              const marketData = result.markets[marketId]
              if (!market || !marketData) return null
              return (
                <button
                  key={marketId}
                  onClick={() => setActiveMarket(marketId)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
                    activeMarket === marketId
                      ? 'bg-zinc-900 text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  )}
                >
                  <span>{market.flag}</span>
                  <span>{market.name.split(' ')[0]}</span>
                </button>
              )
            })}
          </div>

          {/* Active Market Detail */}
          {activeMarketData && activeMarketInfo && (
            <div className="space-y-4">
              {/* Score + Overview */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4">
                <div className="flex items-center gap-4">
                  <ScoreRing score={activeMarketData.culturalFitScore} />
                  <div>
                    <p className="font-semibold text-zinc-900">
                      {activeMarketInfo.flag} {activeMarketInfo.name}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{activeMarketInfo.region} · {activeMarketInfo.language}</p>
                    <p className="text-xs text-zinc-500 mt-1">{activeMarketData.colorMoodNotes}</p>
                  </div>
                </div>
              </div>

              {/* Copy Recommendations */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Copy Recommendations</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-zinc-400 mb-0.5">Headline · {activeMarketData.copyRecommendations.language}</p>
                    <p className="text-sm font-semibold text-zinc-900">{activeMarketData.copyRecommendations.headline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-0.5">Subheadline</p>
                    <p className="text-sm text-zinc-700">{activeMarketData.copyRecommendations.subheadline}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 mb-0.5">CTA</p>
                    <span className="inline-block text-sm font-medium text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
                      {activeMarketData.copyRecommendations.cta}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cultural Notes */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Cultural Notes</p>
                <ul className="space-y-1.5">
                  {activeMarketData.culturalNotes.map((note, i) => (
                    <li key={i} className="flex gap-2 text-sm text-zinc-700">
                      <span className="text-violet-400 flex-shrink-0 mt-0.5">·</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Layout Adjustments */}
              {activeMarketData.layoutAdjustments.length > 0 && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Layout Adjustments</p>
                  <ul className="space-y-1.5">
                    {activeMarketData.layoutAdjustments.map((adj, i) => (
                      <li key={i} className="flex gap-2 text-sm text-zinc-700">
                        <span className="text-blue-400 flex-shrink-0 mt-0.5">→</span>
                        {adj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Compliance Flags */}
              {activeMarketData.complianceFlags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Compliance Flags</p>
                  {activeMarketData.complianceFlags.map((flag, i) => (
                    <FlagItem key={i} flag={flag} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variant Grid - Right */}
        <div className="col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 uppercase tracking-wider">Output Variants</h3>
            <p className="text-xs text-zinc-500">Preview via Firefly-generated assets in production</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {selectedSpecs.map((specId) => {
              const specAnalysis = result.specs[specId]
              return (
                <VariantCard
                  key={specId}
                  specId={specId}
                  imageUrl={imageUrl}
                  complianceStatus={specAnalysis?.complianceStatus ?? 'pass'}
                  notes={specAnalysis?.notes ?? ''}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
