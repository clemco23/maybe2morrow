import { useEffect, useRef, useState } from 'react'
import styles from './IntroScreen.module.css'

const videoPath = import.meta.env.BASE_URL + 'assets/intro-web.mp4'

export default function IntroScreen({ landscape, onSkip, onFinish }) {
  const videoRef = useRef(null)
  const wasPlaying = useRef(false)
  const [muted, setMuted] = useState(false)
  const [needsPlay, setNeedsPlay] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    let active = true
    video.play().catch(() => {
      if (active) setNeedsPlay(true)
    })
    return () => {
      active = false
      video.pause()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!landscape) {
      wasPlaying.current = !video.paused
      video.pause()
    } else if (wasPlaying.current) {
      wasPlaying.current = false
      video.play().catch(() => setNeedsPlay(true))
    }
  }, [landscape])

  function startVideo() {
    videoRef.current.play().then(
      () => setNeedsPlay(false),
      () => setNeedsPlay(true),
    )
  }

  return (
    <main className={styles.screen} aria-label="Introduction">
      <video
        ref={videoRef}
        className={styles.video}
        src={videoPath}
        muted={muted}
        playsInline
        preload="metadata"
        onEnded={onFinish}
        onError={() => setNeedsPlay(true)}
        onPlaying={() => setNeedsPlay(false)}
      />
      {needsPlay ? (
        <button
          type="button"
          className={styles.iconButton + ' ' + styles.play}
          onClick={startVideo}
          aria-label="Lire l’introduction"
          title="Lire l’introduction"
        >
          <span className={styles.playIcon} aria-hidden="true" />
        </button>
      ) : null}
      <div className={styles.controls}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => setMuted((value) => !value)}
          aria-pressed={!muted}
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
          title={muted ? 'Activer le son' : 'Couper le son'}
        >
          <span
            className={muted ? styles.mutedIcon : styles.volumeIcon}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          onClick={onSkip}
          aria-label="Passer l’introduction"
          title="Passer l’introduction"
        >
          <span className={styles.skipIcon} aria-hidden="true" />
        </button>
      </div>
    </main>
  )
}
