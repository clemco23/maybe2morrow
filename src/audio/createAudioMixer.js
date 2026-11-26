const audioDirectory = import.meta.env.BASE_URL + 'audio/'
const files = {
  click: 'click.mp3',
  wrong: 'wrong.mp3',
  day: 'day.mp3',
  food: 'eat.mp3',
  water: 'water.mp3',
  medicine: 'Health.mp3',
  sick: 'sick.mp3',
  death: 'dead.mp3',
  expeditionReturn: 'backTrip.mp3',
}

export function createAudioMixer() {
  const context = new window.AudioContext()
  const musicGain = context.createGain()
  const menuGain = context.createGain()
  const effectsGain = context.createGain()
  musicGain.connect(context.destination)
  menuGain.connect(context.destination)
  effectsGain.connect(context.destination)

  const buffers = new Map()
  const gameSources = new Map()
  let ambientRequested = false
  let nextClickTime = 0
  let gamePlaybackVersion = 0

  async function loadBuffer(filename) {
    const response = await fetch(audioDirectory + filename)
    if (!response.ok) throw new Error('Impossible de charger ' + filename)

    return context.decodeAudioData(await response.arrayBuffer())
  }

  function bufferFor(filename) {
    if (!buffers.has(filename)) {
      buffers.set(
        filename,
        loadBuffer(filename).catch(() => {
          buffers.delete(filename)
          return null
        }),
      )
    }

    return buffers.get(filename)
  }

  function playBuffer(buffer, output, { loop = false, time = 0 } = {}) {
    if (!buffer || output.gain.value === 0 || context.state === 'closed') return

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.connect(output)
    source.start(time)
    return source
  }

  function stopGameSounds() {
    gamePlaybackVersion += 1
    for (const source of gameSources.values()) source.stop()
    gameSources.clear()
  }

  function applySettings({ muted, musicVolume, clickVolume, effectsVolume }) {
    musicGain.gain.value = muted ? 0 : musicVolume / 100
    menuGain.gain.value = muted ? 0 : clickVolume / 100
    effectsGain.gain.value = muted ? 0 : effectsVolume / 100

    if (effectsGain.gain.value === 0) stopGameSounds()
    if (
      muted ||
      (musicVolume === 0 && clickVolume === 0 && effectsVolume === 0)
    ) {
      return
    }

    if (context.state !== 'running') context.resume().catch(() => {})

    if (musicGain.gain.value > 0 && !ambientRequested) {
      ambientRequested = true
      bufferFor('ambient-sound.mp3').then((buffer) => {
        ambientRequested = Boolean(
          playBuffer(buffer, musicGain, { loop: true }),
        )
      })
    }
  }

  async function playMenuSound(name) {
    if (menuGain.gain.value === 0) return

    const buffer = await bufferFor(files[name])
    const time = Math.max(context.currentTime, nextClickTime)
    if (playBuffer(buffer, menuGain, { time })) {
      // Space out clicks queued while the effect is still downloading.
      nextClickTime = time + 0.045
    }
  }

  async function playGameSounds(sounds) {
    if (!sounds.length || effectsGain.gain.value === 0) return

    const version = gamePlaybackVersion
    const clips = await Promise.all(
      sounds.map((name) => bufferFor(files[name])),
    )
    if (version !== gamePlaybackVersion) return

    let time = context.currentTime
    for (const [index, name] of sounds.entries()) {
      const buffer = clips[index]
      if (!buffer) continue

      // Restart a repeated cue so rapid actions don't layer copies of it.
      gameSources.get(name)?.stop()
      const source = playBuffer(buffer, effectsGain, { time })
      if (!source) continue

      gameSources.set(name, source)
      source.onended = () => {
        if (gameSources.get(name) === source) gameSources.delete(name)
      }
      time += buffer.duration
    }
  }

  return {
    applySettings,
    playMenuSound,
    playGameSounds,
    stopGameSounds,
    close: () => context.close().catch(() => {}),
  }
}
