import { useEffect, useRef, useState } from 'react'
import { createMenuAudio } from './createMenuAudio.js'

const storageKey = 'maybe-tomorrow.audio.v1'
const defaultSettings = { muted: false, musicVolume: 35, clickVolume: 65 }

function readVolume(value, defaultValue) {
  return Number.isInteger(value) && value >= 0 && value <= 100
    ? value
    : defaultValue
}

function readSettings() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey))

    return {
      muted: saved?.muted === true,
      musicVolume: readVolume(saved?.musicVolume, defaultSettings.musicVolume),
      clickVolume: readVolume(saved?.clickVolume, defaultSettings.clickVolume),
    }
  } catch {
    return defaultSettings
  }
}

export function useMenuAudio() {
  const [settings, setSettings] = useState(readSettings)
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      audioRef.current?.close()
      audioRef.current = null
    }
  }, [])

  function applySettings(next) {
    const soundEnabled =
      !next.muted && (next.musicVolume > 0 || next.clickVolume > 0)

    if (
      !audioRef.current &&
      soundEnabled &&
      typeof window.AudioContext === 'function'
    ) {
      audioRef.current = createMenuAudio()
    }

    audioRef.current?.applySettings(next)
  }

  function updateSettings(changes) {
    const next = { ...settings, ...changes }
    setSettings(next)
    applySettings(next)

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // The current settings can still be used when storage is unavailable.
    }
  }

  function handleMenuClick(event) {
    if (!event.nativeEvent.isTrusted) return

    applySettings(settings)

    if (
      event.target instanceof Element &&
      event.target.closest('button:enabled, input:enabled')
    ) {
      audioRef.current?.playClick()
    }
  }

  return { settings, updateSettings, handleMenuClick }
}
