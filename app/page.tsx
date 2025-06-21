"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AudioPlayer } from "@/components/audio-player"

interface Entry {
  text: string
  id: string
}

interface EntriesByDate {
  [date: string]: Entry[]
}

export default function TodayIHate() {
  const [date, setDate] = useState("")
  const [text, setText] = useState("")
  const [entriesByDate, setEntriesByDate] = useState<EntriesByDate>({})
  const [editingEntry, setEditingEntry] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // Sayfa yüklendiğinde localStorage'dan verileri yükle
  useEffect(() => {
    const savedEntries = localStorage.getItem("todayIHateEntries")
    if (savedEntries) {
      try {
        setEntriesByDate(JSON.parse(savedEntries))
      } catch (error) {
        console.error("Kayıtlar yüklenirken hata:", error)
      }
    }
  }, [])

  // entriesByDate değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem("todayIHateEntries", JSON.stringify(entriesByDate))
  }, [entriesByDate])

  const handleSave = () => {
    if (!date || !text.trim()) return

    const newEntry: Entry = {
      text: text.trim(),
      id: Date.now().toString(),
    }

    setEntriesByDate((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), newEntry],
    }))

    setText("")
  }

  const handleEdit = (entryId: string, currentText: string) => {
    setEditingEntry(entryId)
    setEditText(currentText)
  }

  const handleSaveEdit = (dateKey: string, entryId: string) => {
    if (!editText.trim()) return

    setEntriesByDate((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((entry) => (entry.id === entryId ? { ...entry, text: editText.trim() } : entry)),
    }))

    setEditingEntry(null)
    setEditText("")
  }

  const handleCancelEdit = () => {
    setEditingEntry(null)
    setEditText("")
  }

  const handleDelete = (dateKey: string, entryId: string) => {
    setEntriesByDate((prev) => {
      const updatedEntries = prev[dateKey].filter((entry) => entry.id !== entryId)
      if (updatedEntries.length === 0) {
        const { [dateKey]: _, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [dateKey]: updatedEntries,
      }
    })
  }

  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split("-")
    return `${day}.${month}.${year}`
  }

  const sortedDates = Object.keys(entriesByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  return (
    <div className="min-h-screen custom-background relative flex flex-col">
      {/* Audio Player - Fixed position on the right */}
      <AudioPlayer />

      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block bg-pink-200/80 backdrop-blur-sm rounded-2xl px-8 py-4 mb-4">
              <h1
                className="text-4xl md:text-6xl font-bold text-amber-800"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                Today I Hate
              </h1>
            </div>
            <div className="block">
              <div className="inline-block bg-pink-200/80 backdrop-blur-sm rounded-2xl px-6 py-3">
                <p className="text-2xl text-gray-700 font-medium">Merhaba! Ben Deniz ve Bugün Bunlardan Nefret Ettim</p>
              </div>
            </div>
          </div>

          {/* Input Form */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="flex-shrink-0 md:w-48"
                />
                <Textarea
                  placeholder="Bugün nelerden nefret ettin?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 min-h-[100px] resize-none"
                />
                <Button
                  onClick={handleSave}
                  disabled={!date || !text.trim()}
                  className="flex-shrink-0 bg-pink-500 hover:bg-pink-600 text-white px-8"
                >
                  Nefret
                </Button>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="max-w-4xl mx-auto space-y-6 mb-16">
            {sortedDates.map((dateKey) => (
              <div key={dateKey} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-pink-300 pb-2">
                  {formatDateForDisplay(dateKey)} Tarihinde Bunlardan Nefret Ettim:
                </h2>
                <div className="space-y-3">
                  {entriesByDate[dateKey].map((entry) => (
                    <div key={entry.id} className="flex items-start gap-3 p-3 bg-pink-50 rounded-lg">
                      <span className="text-xl">✅</span>
                      {editingEntry === entry.id ? (
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 min-h-[60px] resize-none"
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              onClick={() => handleSaveEdit(dateKey, entry.id)}
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs"
                            >
                              💾
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              size="sm"
                              variant="outline"
                              className="px-2 py-1 text-xs"
                            >
                              ❌
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 leading-relaxed flex-1">{entry.text}</p>
                          <div className="flex flex-col gap-1">
                            <Button
                              onClick={() => handleEdit(entry.id, entry.text)}
                              size="sm"
                              variant="outline"
                              className="px-2 py-1 text-xs"
                            >
                              ✏️
                            </Button>
                            <Button
                              onClick={() => handleDelete(dateKey, entry.id)}
                              size="sm"
                              variant="outline"
                              className="px-2 py-1 text-xs text-red-600 hover:text-red-700"
                            >
                              🗑️
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Always at bottom */}
      <div className="text-center py-8 mt-auto">
        <div className="inline-block bg-white/80 backdrop-blur-sm rounded-xl px-6 py-4">
          <p className="text-lg text-gray-700 font-medium italic">
            Neden nefret edersen et, seni her zaman seven birisi var. Unutma.
          </p>
        </div>
      </div>
    </div>
  )
}
