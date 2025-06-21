"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Volume2 } from "lucide-react"

interface AudioTrack {
  id: string
  title: string
  src: string
}

const audioTracks: AudioTrack[] = [
  {
    id: "track1",
    title: "Şarkı 1",
    src: "/audio/song1.mp3",
  },
  {
    id: "track2",
    title: "Şarkı 2",
    src: "/audio/song2.mp3",
  },
]

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const playTrack = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      // Same track - toggle play/pause
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
    } else {
      // Different track - load and play
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const pauseTrack = () => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }

  const restartTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.src

    if (isPlaying) {
      audio.play().catch(console.error)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleError = () => {
      console.error("Ses dosyası yüklenemedi:", currentTrack.src)
      setIsPlaying(false)
    }

    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [currentTrack, isPlaying])

  return (
    <>
      <audio ref={audioRef} preload="metadata" />

      <div className={`fixed right-4 top-4 z-50 transition-all duration-300 ${isMinimized ? "w-12" : "w-80"}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-pink-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-pink-200">
            {!isMinimized && (
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-medium text-gray-700">Müzik</span>
              </div>
            )}
            <Button
              onClick={() => setIsMinimized(!isMinimized)}
              size="sm"
              variant="ghost"
              className="w-6 h-6 p-0 hover:bg-pink-100"
            >
              {isMinimized ? "📻" : "➖"}
            </Button>
          </div>

          {/* Player Content */}
          {!isMinimized && (
            <div className="p-4 space-y-4">
              {/* Current Track Info */}
              {currentTrack && (
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-800 truncate">{currentTrack.title}</p>
                  <p className="text-xs text-gray-500">{isPlaying ? "Çalıyor..." : "Duraklatıldı"}</p>
                </div>
              )}

              {/* Controls */}
              {currentTrack && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    onClick={restartTrack}
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 bg-white hover:bg-pink-50"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>

                  <Button
                    onClick={() => (isPlaying ? pauseTrack() : playTrack(currentTrack))}
                    size="sm"
                    className="w-10 h-10 p-0 bg-pink-500 hover:bg-pink-600 text-white rounded-full"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </Button>
                </div>
              )}

              {/* Track List */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 text-center">Şarkılar</p>
                {audioTracks.map((track) => (
                  <Button
                    key={track.id}
                    onClick={() => playTrack(track)}
                    variant={currentTrack?.id === track.id ? "default" : "outline"}
                    size="sm"
                    className={`w-full text-xs justify-start ${
                      currentTrack?.id === track.id
                        ? "bg-pink-500 hover:bg-pink-600 text-white"
                        : "bg-white hover:bg-pink-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3" />
                      )}
                      <span className="truncate">{track.title}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
