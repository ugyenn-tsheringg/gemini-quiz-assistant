import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

export interface AnalysisResult {
    answer: string
    confidence: number
    reasoning: string
}

export async function analyzeImageWithGemini(
    base64Image: string,
    apiKey: string
): Promise<AnalysisResult> {
    // Remove header if present (data:image/jpeg;base64,)
    const base64Data = base64Image.split(',')[1] || base64Image

    const genAI = new GoogleGenerativeAI(apiKey)
    // Use Gemini 1.5 Flash (pinned version for stability)
    const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash-001',
        generationConfig: { responseMimeType: "application/json" },
        safetySettings: [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
    })

    const prompt = `
    You are a Quiz Expert AI. Analyze this image of a quiz question.
    1. Identify the Question.
    2. Identify the Options.
    3. Select the CORRECT answer.
    4. Provide a very brief reasoning.
    5. Provide a confidence score (0-1).

    Return JSON:
    {
      "answer": "The full text of the correct option",
      "reasoning": "1 sentence explanation",
      "confidence": 0.99
    }
  `

    try {
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: 'image/jpeg'
                }
            }
        ])

        const response = await result.response
        const text = response.text()
        return JSON.parse(text) as AnalysisResult
    } catch (error) {
        console.error("Gemini Analysis Failed:", error)
        // Propagate the actual error message for debugging
        throw new Error(`Analysis Error: ${(error as Error).message || JSON.stringify(error)}`)
    }
}
