import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/gemini'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const teeColor = formData.get('teeColor') as string || 'Yellow'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')

        // Craft prompt for Gemini to extract scorecard data
        const prompt = `You are analyzing a golf course scorecard image. Extract the hole-by-hole data and return it as a JSON object.

The scorecard should have data for either 9 or 18 holes. For each hole, extract:
- hole_number (1-18)
- par (typically 3, 4, or 5)
- distance (hole length in yards or meters, integer) - EXTRACT ONLY FROM THE ${teeColor.toUpperCase()} TEES
- handicap (1-18, difficulty ranking)

There might be some handwritten information which is probably the score of the players, completely disregard that information.

IMPORTANT: The scorecard likely has multiple rows of yardages for different tee colors. You MUST extract the yardages ONLY from the row labeled "${teeColor}" or "${teeColor.toUpperCase()}" tees. Ignore all other tee colors.

Return ONLY a valid JSON object in this exact format, with no additional text:
{
  "total_holes": 9 or 18,
  "holes": [
    {
      "hole_number": 1,
      "par": 4,
      "distance": 380,
      "handicap": 5
    },
    ...
  ]
}

If you cannot clearly read a value, use these defaults:
- par: 4
- distance: 0
- handicap: hole_number

Be precise and only extract data that is clearly visible in the image.`

        // Analyze image with Gemini
        const response = await analyzeImage(base64, file.type, prompt)

        // Parse JSON response
        let parsedData
        try {
            // Remove markdown code blocks if present
            const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim()
            parsedData = JSON.parse(cleanedResponse)
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', response)
            console.error('Parse error:', parseError)
            return NextResponse.json(
                {
                    error: 'Failed to parse scorecard data',
                    details: 'Gemini returned invalid JSON. Check server logs for the raw response.'
                },
                { status: 500 }
            )
        }

        return NextResponse.json(parsedData)
    } catch (error) {
        console.error('OCR processing error:', error)
        return NextResponse.json(
            { error: 'Failed to process scorecard image' },
            { status: 500 }
        )
    }
}
