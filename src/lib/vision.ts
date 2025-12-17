// OpenRouter API Implementation
export interface AnalysisResult {
    answer: string
    confidence: number
    reasoning: string
}

export async function analyzeImageWithGemini(
    base64Image: string,
    apiKey: string
): Promise<AnalysisResult> {
    // Ensure header is present for OpenAI format compatibility if missing, or use as is
    // OpenRouter expects a data URL for image_url
    const dataUrl = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`

    const prompt = `
    You are a Quiz Expert AI. Analyze this image of a quiz question.
    1. Identify the Question.
    2. Identify the Options.
    3. Select the CORRECT answer.
    4. Provide a very brief reasoning.
    5. Provide a confidence score (0-1).

    Return purely Valid JSON (no markdown formatting):
    {
      "answer": "The full text of the correct option",
      "reasoning": "1 sentence explanation",
      "confidence": 0.99
    }
  `

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://quiz-agent.vercel.app", // Fallback URL
                "X-Title": "Quiz Vision Agent"
            },
            body: JSON.stringify({
                "model": "google/gemini-1.5-flash", // Using standard Flash model on OpenRouter
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": dataUrl
                                }
                            }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Clean potential markdown blocks often returned by LLMs (```json ... ```)
        const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedContent) as AnalysisResult;

    } catch (error) {
        console.error("OpenRouter Analysis Failed:", error)
        throw new Error(`Analysis Error: ${(error as Error).message || JSON.stringify(error)}`)
    }
}
