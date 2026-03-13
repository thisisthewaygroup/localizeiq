export interface Market {
  id: string
  name: string
  region: string
  flag: string
  language: string
  languageCode: string
}

export interface OutputSpec {
  id: string
  name: string
  category: 'ecommerce' | 'ooh' | 'retail'
  width: number
  height: number
  aspectRatio: string
  description: string
}

export interface ComplianceFlag {
  flag: string
  severity: 'info' | 'warning' | 'critical'
  description: string
}

export interface CopyRecommendation {
  headline: string
  subheadline: string
  cta: string
  language: string
}

export interface MarketAnalysis {
  marketName: string
  culturalFitScore: number
  culturalNotes: string[]
  copyRecommendations: CopyRecommendation
  colorMoodNotes: string
  layoutAdjustments: string[]
  complianceFlags: ComplianceFlag[]
}

export interface SpecAnalysis {
  specName: string
  complianceStatus: 'pass' | 'warning' | 'fail'
  notes: string
}

export interface LocalizationResult {
  imageDescription: string
  overallReadiness: number
  markets: Record<string, MarketAnalysis>
  specs: Record<string, SpecAnalysis>
}
