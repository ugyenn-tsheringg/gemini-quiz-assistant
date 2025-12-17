'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Brain, CheckCircle, Loader2, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

export type AnalysisState = 'idle' | 'capturing' | 'analyzing' | 'result'

interface AnalysisResult {
    answer: string
    confidence: number
    reasoning: string
}

interface AnalysisOverlayProps {
    state: AnalysisState
    result: AnalysisResult | null
    onReset: () => void
}

export default function AnalysisOverlay({ state, result, onReset }: AnalysisOverlayProps) {
    useEffect(() => {
        if (state === 'result' && result) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.8 },
                colors: ['#06b6d4', '#ffffff'] // Cyan and White
            })
        }
    }, [state, result])

    return (
        <AnimatePresence>
            {state !== 'idle' && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-md rounded-t-3xl border-t border-white/10 p-6 z-20 text-white min-h-[30vh] shadow-2xl"
                    onClick={state === 'result' ? onReset : undefined}
                >
                    {/* Handle Bar */}
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

                    {/* Content */}
                    <div className="flex flex-col items-center justify-center h-full gap-4">

                        {state === 'analyzing' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="relative w-16 h-16 mx-auto">
                                    <div className="absolute inset-0 bg-cyan-500/30 rounded-full animate-ping" />
                                    <div className="relative bg-neutral-800 rounded-full p-4 border border-cyan-500/50">
                                        <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-medium tracking-tight">Analyzing Question...</h3>
                                <p className="text-sm text-gray-400">Scanning logic & patterns</p>
                            </motion.div>
                        )}

                        {state === 'result' && result && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-cyan-400">
                                        <Zap className="w-5 h-5 fill-current" />
                                        <span className="font-bold text-sm tracking-widest uppercase">Best Option Found</span>
                                    </div>
                                    <div className="text-sm bg-white/10 px-3 py-1 rounded-full font-mono">
                                        {Math.round(result.confidence * 100)}% Confidence
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 p-6 rounded-2xl text-center">
                                    <h2 className="text-3xl font-bold text-white mb-2">{result.answer}</h2>
                                </div>

                                <div className="bg-neutral-800/50 p-4 rounded-xl">
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        <span className="text-cyan-400 font-semibold mr-2">Reasoning:</span>
                                        {result.reasoning}
                                    </p>
                                </div>

                                <p className="text-center text-xs text-gray-500 uppercase tracking-widest mt-4">Tap anywhere to scan again</p>
                            </motion.div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
