const audioDirectory = import.meta.env.BASE_URL + 'audio/'

export function createMenuAudio() {
  const context = new window.AudioContext()
  const musicGain = context.createGain()
  const clickGain = context.createGain()
  musicGain.connect(context.destination)
  clickGain.connect(context.destination)

  let ambientRequested = false
  let clickBuffer = null
  let clickRequest = null
  let nextClickTime = 0

  async function loadBuffer(filename) {
    const response = await fetch(audioDirectory + filename)

    if (!response.ok) {
      throw new Error('Impossible de charger ' + filename)
    }

    return context.decodeAudioData(await response.arrayBuffer())
  }

  function playBuffer(buffer, output, { loop = false, time = 0 } = {}) {
    if (context.state === 'closed') return

    const source = context.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.connect(output)
    source.start(time)
  }

  function applySettings({ muted, musicVolume, clickVolume }) {
    musicGain.gain.value = muted ? 0 : musicVolume / 100
    clickGain.gain.value = muted ? 0 : clickVolume / 100

    if (musicGain.gain.value === 0 && clickGain.gain.value === 0) return

    if (context.state !== 'running') {
      context.resume().catch(() => {})
    }

    if (musicGain.gain.value > 0 && !ambientRequested) {
      ambientRequested = true
      loadBuffer('ambient-sound.mp3')
        .then((buffer) => playBuffer(buffer, musicGain, { loop: true }))
        .catch(() => {
          ambientRequested = false
        })
    }
  }

  function playClickBuffer(buffer) {
    if (!buffer || clickGain.gain.value === 0) return

    const time = Math.max(context.currentTime, nextClickTime)
    // Space out clicks queued while the effect is still downloading.
    nextClickTime = time + 0.045
    playBuffer(buffer, clickGain, { time })
  }

  function playClick() {
    if (clickGain.gain.value === 0) return

    if (clickBuffer) {
      playClickBuffer(clickBuffer)
      return
    }

    clickRequest ??= loadBuffer('click.mp3')
      .then((buffer) => {
        clickBuffer = buffer
        return buffer
      })
      .catch(() => null)
      .finally(() => {
        clickRequest = null
      })

    clickRequest.then(playClickBuffer)
  }

  return {
    applySettings,
    playClick,
    close: () => context.close().catch(() => {}),
  }
}
