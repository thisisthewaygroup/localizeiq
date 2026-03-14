import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getMarketById } from '@/lib/markets'
import { getSpecById } from '@/lib/specs'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const marketsJson = formData.get('markets') as string
    const specsJson = formData.get('specs') as string

    if (!imageFile || !marketsJson || !specsJson) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const selectedMarketIds: string[] = JSON.parse(marketsJson)
    const selectedSpecIds: string[] = JSON.parse(specsJson)

    // Convert image to base64
    const imageBuffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const mediaType = (imageFile.type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp') || 'image/jpeg'

    // Build market context
    const marketsContext = selectedMarketIds
      .map((id) => {
        const market = getMarketById(id)
        return market ? `- ${market.name} (${market.language}, ${market.region})` : null
      })
      .filter(Boolean)
      .join('\n')

    // Build spec context
    const specsContext = selectedSpecIds
      .map((id) => {
        const spec = getSpecById(id)
        return spec ? `- ${spec.id}: ${spec.name} (${spec.width}×${spec.height}px, ${spec.aspectRatio}, ${spec.category})` : null
      })
      .filter(Boolean)
      .join('\n')

    const prompt = `You are LocalizeIQ's AI localization engine for a Fortune 100 global lifestyle brand. Analyze this hero image and provide expert localization recommendations.

TARGET MARKETS:
${marketsContext}

OUTPUT SPECS TO EVALUATE:
${specsContext}

For each market, provide deep cultural and marketing expertise. Consider:
- Cultural values, aesthetics, and visual preferences
- Color symbolism and taboos
- Typography and text direction considerations
- Legal/regulatory advertising requirements
- Platform-specific requirements
- Local competitive landscape nuances
- Seasonal and contextual relevance

Return ONLY valid JSON (no markdown, no explanation) matching this exact schema:
{
  "imageDescription": "concise description of the image content and style",
  "overallReadiness": <number 0-100 representing global market readiness>,
  "markets": {
    "<marketId>": {
      "marketName": "<full market name>",
      "culturalFitScore": <1-10>,
      "culturalNotes": ["<specific note 1>", "<specific note 2>", "<specific note 3>"],
      "copyRecommendations": {
        "headline": "<localized headline in local language if applicable>",
        "subheadline": "<localized subheadline>",
        "cta": "<localized call-to-action>",
        "language": "<language name>"
      },
      "colorMoodNotes": "<color and mood recommendation for this market>",
      "layoutAdjustments": ["<adjustment 1>", "<adjustment 2>"],
      "complianceFlags": [
        {
          "flag": "<short flag title>",
          "severity": "<info|warning|critical>",
          "description": "<detailed explanation>"
        }
      ]
    }
  },
  "specs": {
    "<specId>": {
      "specName": "<spec name>",
      "complianceStatus": "<pass|warning|fail>",
      "notes": "<technical compliance note>"
    }
  }
}

Market IDs to use as keys: ${selectedMarketIds.join(', ')}
Spec IDs to use as keys: ${selectedSpecIds.join(', ')}

Be specific, actionable, and culturally accurate. For Japanese market especially, note specific aesthetic preferences (ma, wabi-sabi, kawaii considerations etc.). For each market's copy, write actual copy in the local language.`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    })

    const textContent = response.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude')
    }

    // Clean the response - remove any markdown code blocks if present
    let jsonText = textContent.text.trim()
    const fenceMatch = jsonText.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
    if (fenceMatch) {
      jsonText = fenceMatch[1].trim()
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\n?/, '').trim()
    }

    const result = JSON.parse(jsonText)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    const message = error instanceof Error ? error.message : 'Analysis failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
