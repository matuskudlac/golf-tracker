import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const courseId = formData.get('courseId') as string
        const totalHoles = parseInt(formData.get('totalHoles') as string) || 18

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (!courseId) {
            return NextResponse.json({ error: 'Course ID required' }, { status: 400 })
        }

        // Fetch course hole data from database
        const supabase = await createClient()
        const { data: courseHoles, error: holesError } = await supabase
            .from('course_holes')
            .select('hole_number, par, distance, handicap')
            .eq('course_id', courseId)
            .order('hole_number')

        if (holesError || !courseHoles || courseHoles.length === 0) {
            return NextResponse.json({ error: 'Failed to fetch course data' }, { status: 500 })
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString('base64')

        // Build course context for the prompt
        const holeContext = courseHoles.slice(0, totalHoles).map(hole =>
            `Hole ${hole.hole_number}: Par ${hole.par}, ${hole.distance}yds, HCP ${hole.handicap}`
        ).join('\n')

        // Craft prompt for Gemini to extract HANDWRITTEN SCORES
        const prompt = `You are analyzing a golf scorecard image to extract the PLAYER'S HANDWRITTEN SCORES.

COURSE INFORMATION (for reference):
${holeContext}

TASK: Find and extract the handwritten score for each hole. The scorecard will have:
- Printed course information (hole numbers, par, distance, handicap)
- HANDWRITTEN player scores (these are the numbers we need to extract)

The player's scores are typically written in a row labeled "Score" or in boxes/cells below each hole number.

Return ONLY a valid JSON object with the scores array (${totalHoles} numbers):
{
  "scores": [4, 5, 3, 4, 5, 4, 3, 5, 4, ...]
}

IMPORTANT:
- Extract ONLY the handwritten scores, not the printed par values
- Return exactly ${totalHoles} scores in order (holes 1-${totalHoles})
- If a score is unclear or missing, use 0
- Scores are typically between 1-15 per hole
- Return ONLY valid JSON, no additional text`

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
            return NextResponse.json(
                { error: 'Failed to parse scorecard data', details: response },
                { status: 500 }
            )
        }

        // Validate scores array
        if (!parsedData.scores || !Array.isArray(parsedData.scores)) {
            return NextResponse.json(
                { error: 'Invalid response format from AI' },
                { status: 500 }
            )
        }

        // Ensure we have the right number of scores
        if (parsedData.scores.length !== totalHoles) {
            return NextResponse.json(
                { error: `Expected ${totalHoles} scores, got ${parsedData.scores.length}` },
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
