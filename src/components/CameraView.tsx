'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { Camera, RefreshCw } from 'lucide-react'

const videoConstraints = {
    facingMode: 'environment',
    // We prioritize high resolution for OCR
    width: { ideal: 1920 },
    height: { ideal: 1080 },
}

export default function CameraView({ onCapture }: { onCapture: (imageSrc: string) => void }) {
    const webcamRef = useRef<Webcam>(null)
    const [mounted, setMounted] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            onCapture(imageSrc)
        }
    }, [webcamRef, onCapture])

    if (!mounted) return <div className="bg-black h-screen w-screen" />

    return (
        <div className="relative h-[100dvh] w-screen bg-black overflow-hidden flex flex-col items-center justify-center">
            {cameraError ? (
                <div className="text-white p-4 text-center">
                    <p className="mb-2">Camera Error: {cameraError}</p>
                    <p className="text-sm text-gray-400">Please ensure you have granted camera permissions.</p>
                </div>
            ) : (
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    className="absolute inset-0 h-full w-full object-cover"
                    onUserMediaError={(err) => setCameraError(typeof err === 'string' ? err : err.message || 'Unknown error')}
                />
            )}

            {/* Overlay UI - Viewfinder Guide */}
            <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-8 rounded-lg">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 rounded-br-lg" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 z-10 flex gap-4 items-center">
                <button
                    onClick={capture}
                    className="w-20 h-20 rounded-full border-4 border-cyan-500 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
                    aria-label="Capture"
                >
                    <div className="w-14 h-14 bg-cyan-400 rounded-full animate-pulse" />
                </button>
            </div>

            <div className="absolute top-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs text-white/70">
                Vision Mode Active
            </div>
        </div>
    )
}
