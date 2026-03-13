'use client'

import { useState, useCallback } from 'react'
import { ImageUploader } from '@/components/ImageUploader'
import { MarketSelector } from '@/components/MarketSelector'
import { SpecSelector } from '@/components/SpecSelector'
import { ResultsView } from '@/components/ResultsView'
import type { LocalizationResult } from '@/lib/types'
import { Globe, Zap, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step = 'upload' | 'configure' | 'analyzing' | 'results'

const ANALYZING_MESSAGES = [
  'Analyzing image content and composition...',
  'Running cultural fit analysis across markets...',
  'Generating localized copy recommendations...',
  'Evaluating spec compliance for each format...',
  'Checking regulatory and platform requirements...',
  'Finalizing localization report...',
]

export default function Home() {
  const [step, setStep] = useState<Step>('upload')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['us', 'jp', 'gb', 'fr', 'de'])
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>(['ec_pdp', 'ec_banner', 'ooh_billboard', 'ooh_bus', 'retail_shelf'])
  const [result, setResult] = useState<LocalizationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analyzeMessageIndex, setAnalyzeMessageIndex] = useState(0)

  const handleImageSelected = useCallback((file: File, url: string) => {
    setImageFile(file)
    setImageUrl(url)
    setStep('configure')
  }, [])

  const handleClearImage = useCallback(() => {
    setImageFile(null)
    if (imageUrl) URL.revokeObjectURL(imageUrl)
    setImageUrl(null)
    setStep('upload')
    setResult(null)
    setError(null)
  }, [imageUrl])

  const handleAnalyze = useCallback(async () => {
    if (!imageFile || selectedMarkets.length === 0 || selectedSpecs.length === 0) return

    setStep('analyzing')
    setError(null)
    setAnalyzeMessageIndex(0)

    // Rotate through messages while analyzing
    const interval = setInterval(() => {
      setAnalyzeMessageIndex((i) => (i + 1) % ANALYZING_MESSAGES.length)
    }, 2200)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('markets', JSON.stringify(selectedMarkets))
      formData.append('specs', JSON.stringify(selectedSpecs))

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || 'Analysis failed')
      }

      const data: LocalizationResult = await response.json()
      setResult(data)
      setStep('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('configure')
    } finally {
      clearInterval(interval)
    }
  }, [imageFile, selectedMarkets, selectedSpecs])

  const handleReset = useCallback(() => {
    handleClearImage()
  }, [handleClearImage])

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-zinc-900 tracking-tight">LocalizeIQ</span>
            <span className="text-zinc-300 text-sm">·</span>
            <span className="text-zinc-500 text-sm hidden sm:block">AI-Powered Global Content Localization</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Claude AI Active
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="animate-slide-up max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-3 py-1.5 rounded-full mb-4">
                <Zap className="w-3.5 h-3.5" />
                One image · Any market · Every spec
              </div>
              <h1 className="text-4xl font-bold text-zinc-900 tracking-tight mb-3">
                Global-ready in minutes
              </h1>
              <p className="text-zinc-500 text-lg leading-relaxed">
                Upload a hero image and LocalizeIQ will generate culturally-adapted variants
                for every market and output spec — fully spec-compliant and brand-safe.
              </p>
            </div>

            <ImageUploader
              onImageSelected={handleImageSelected}
              previewUrl={null}
              onClear={handleClearImage}
            />

            {/* Feature row */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: '10 Markets', sub: 'With deep cultural intelligence' },
                { label: '9 Output Specs', sub: 'E-comm, OOH, and Retail' },
                { label: 'AI Compliance', sub: 'Regulatory & platform checks' },
              ].map((f) => (
                <div key={f.label} className="text-center p-4 bg-white border border-zinc-200 rounded-2xl">
                  <p className="font-semibold text-zinc-900 text-sm">{f.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Configure Step */}
        {step === 'configure' && imageUrl && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Configure Localization</h2>
                <p className="text-zinc-500 text-sm mt-0.5">Select your target markets and output specs</p>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={selectedMarkets.length === 0 || selectedSpecs.length === 0}
                className={cn(
                  'flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                  selectedMarkets.length > 0 && selectedSpecs.length > 0
                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm hover:shadow-md'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                )}
              >
                Analyze & Localize
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-12 gap-6">
              {/* Image preview */}
              <div className="col-span-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Hero Image</p>
                <ImageUploader
                  onImageSelected={handleImageSelected}
                  previewUrl={imageUrl}
                  onClear={handleClearImage}
                />
                <p className="text-xs text-zinc-400 mt-2 text-center">Click to replace</p>
              </div>

              {/* Markets */}
              <div className="col-span-5 bg-white border border-zinc-200 rounded-2xl p-5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Target Markets</p>
                <MarketSelector selected={selectedMarkets} onChange={setSelectedMarkets} />
              </div>

              {/* Specs */}
              <div className="col-span-4 bg-white border border-zinc-200 rounded-2xl p-5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Output Specs</p>
                <SpecSelector selected={selectedSpecs} onChange={setSelectedSpecs} />
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleAnalyze}
                disabled={selectedMarkets.length === 0 || selectedSpecs.length === 0}
                className={cn(
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all',
                  selectedMarkets.length > 0 && selectedSpecs.length > 0
                    ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm hover:shadow-lg'
                    : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                )}
              >
                Analyze & Localize
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center max-w-sm">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-zinc-900 mb-2">Analyzing your image</h2>
              <p className="text-zinc-500 text-sm leading-relaxed transition-all duration-500 min-h-[40px]">
                {ANALYZING_MESSAGES[analyzeMessageIndex]}
              </p>
              <div className="mt-6 flex items-center justify-center gap-1.5">
                {ANALYZING_MESSAGES.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 rounded-full transition-all duration-500',
                      i === analyzeMessageIndex ? 'w-6 bg-violet-600' : 'w-1.5 bg-zinc-300'
                    )}
                  />
                ))}
              </div>
              <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                Powered by Claude AI · Avg. 15–30 seconds
              </div>
            </div>
          </div>
        )}

        {/* Results Step */}
        {step === 'results' && result && imageUrl && (
          <ResultsView
            result={result}
            imageUrl={imageUrl}
            selectedMarkets={selectedMarkets}
            selectedSpecs={selectedSpecs}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-violet-600 rounded flex items-center justify-center">
              <Globe className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs font-semibold text-zinc-500">LocalizeIQ</span>
          </div>
          <p className="text-xs text-zinc-400">
            AI localization engine · Firefly-ready · DAM-connectable
          </p>
        </div>
      </footer>
    </div>
  )
}
