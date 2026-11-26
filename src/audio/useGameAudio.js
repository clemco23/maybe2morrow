import { useEffect, useRef, useState } from 'react'
import { createAudioMixer } from './createAudioMixer.js'

const storageKey = 'maybe-tomorrow.audio.v1'
const defaultSettings = {
  muted: false,
  musicVolume: 35,
  clickVolume: 65,
  effectsVolume: 55,
}

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
      effectsVolume: readVolume(
        saved?.effectsVolume,
        defaultSettings.effectsVolume,
      ),
    }
  } catch {
    return defaultSettings
  }
}

export function useGameAudio() {
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
      !next.muted &&
      (next.musicVolume > 0 || next.clickVolume > 0 || next.effectsVolume > 0)

    if (
      !audioRef.current &&
      soundEnabled &&
      typeof window.AudioContext === 'function'
    ) {
      audioRef.current = createAudioMixer()
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

  function handleClick(event) {
    if (!event.nativeEvent.isTrusted) return

    applySettings(settings)

    if (
      event.target instanceof Element &&
      event.target.closest(
        'button:enabled:not([aria-disabled="true"], [data-game-action]), input:enabled',
      )
    ) {
      audioRef.current?.playMenuSound('click')
    }
  }

  return {
    settings,
    updateSettings,
    handleClick,
    playMenuError: () => audioRef.current?.playMenuSound('wrong'),
    playGameSounds: (sounds) => audioRef.current?.playGameSounds(sounds),
    stopGameSounds: () => audioRef.current?.stopGameSounds(),
  }
}
