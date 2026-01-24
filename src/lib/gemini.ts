import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Process an image with Gemini vision model
 * Uses gemini-1.5-flash for reliable production OCR
 */
export async function analyzeImage(
    imageData: string,
    mimeType: string,
    prompt: string
) {
    // Retrieve API key at runtime
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY is allowed to be empty during build, but required at runtime.')
        console.error('Current process.env keys:', Object.keys(process.env).filter(k => k.includes('GOOGLE') || k.includes('API')))
        throw new Error('GEMINI_API_KEY is missing from environment variables')
    }

    console.log('✅ GEMINI_API_KEY found (length:', apiKey.length, ')')
    console.log('🤖 Analyzing image with Gemini 3 Flash...')

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' })

    try {
        const result = await model.generateContent([
            {
                inlineData: {
                    data: imageData,
                    mimeType,
                },
            },
            prompt,
        ])

        return result.response.text()
    } catch (error) {
        console.error('❌ Gemini API Error:', error)
        throw error
    }
}