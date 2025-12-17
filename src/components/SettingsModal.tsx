'use client'

import { useState, useEffect } from 'react'
import { X, Key, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (key: string) => void
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
    const [apiKey, setApiKey] = useState('')

    useEffect(() => {
        const saved = localStorage.getItem('gemini_api_key')
        if (saved) setApiKey(saved)
    }, [])

    const handleSave = () => {
        localStorage.setItem('gemini_api_key', apiKey)
        onSave(apiKey)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        className="fixed inset-0 m-auto w-[90%] max-w-md h-fit bg-neutral-900 border border-white/10 rounded-2xl p-6 z-50 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Key className="w-5 h-5 text-cyan-400" />
                                API Configuration
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">
                                    OpenRouter API Key
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="sk-or-v1..."
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm"
                                />
                                <p className="text-xs text-gray-600 mt-2">
                                    Your key is stored locally in your browser. Using <strong>gemini-1.5-flash</strong> via OpenRouter.
                                </p>
                            </div>

                            <button
                                onClick={handleSave}
                                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save & Continue
                            </button>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-center text-gray-500">
                                    Don't have a key? The app will run in
                                    <span className="text-cyan-500 font-semibold mx-1">Demo Mode</span>
                                    with mock data.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
