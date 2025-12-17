'use client'

import { useState, useEffect } from 'react'
import CameraView from '@/components/CameraView'
import AnalysisOverlay, { AnalysisState } from '@/components/AnalysisOverlay'
import SettingsModal from '@/components/SettingsModal'
import { analyzeImageWithGemini } from '@/lib/vision'
import { Settings } from 'lucide-react'

// Mock Data for Demo
const MOCK_RESULT = {
  answer: "B) 42",
  confidence: 0.98,
  reasoning: "The question references 'The Hitchhiker's Guide to the Galaxy', where 42 is defined as the Ultimate Answer to Life, the Universe, and Everything."
}

export default function Home() {
  const [state, setState] = useState<AnalysisState>('idle')
  const [result, setResult] = useState<typeof MOCK_RESULT | null>(null)

  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('gemini_api_key')
    if (saved) setApiKey(saved)
  }, [])

  const handleCapture = async (imageSrc: string) => {
    if (state !== 'idle') return

    // Start Analysis Flow
    setState('analyzing')

    if (!apiKey) {
      // Fallback to Demo Mode if no key
      console.log("No API Key, using Demo Mode")
      setTimeout(() => {
        setResult(MOCK_RESULT)
        setState('result')
      }, 1500)
      return
    }

    try {
      const aiResult = await analyzeImageWithGemini(imageSrc, apiKey)
      setResult(aiResult)
      setState('result')
    } catch (err) {
      alert("Verification Failed: " + (err as Error).message)
      setState('idle')
    }
  }

  const handleReset = () => {
    setState('idle')
    setResult(null)
  }

  return (
    <main className="relative min-h-screen">
      <CameraView onCapture={handleCapture} />

      {/* Settings Trigger */}
      <button
        onClick={() => setShowSettings(true)}
        className="fixed top-4 right-4 z-30 p-2 bg-black/40 backdrop-blur rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </button>

      <AnalysisOverlay state={state} result={result} onReset={handleReset} />
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} onSave={setApiKey} />
    </main>
  )
}
