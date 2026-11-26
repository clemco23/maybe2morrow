import { useEffect, useRef } from 'react'
import styles from './HomeScreen.module.css'

const landingArtPath = import.meta.env.BASE_URL + 'assets/set/landingpage-web'

export default function HomeScreen({ onPlay }) {
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  return (
    <main className={styles.screen}>
      <picture className={styles.scenery} aria-hidden="true">
        <source
          media="(max-width: 44rem)"
          srcSet={
            landingArtPath + '-960.webp 1x, ' + landingArtPath + '.webp 2x'
          }
        />
        <img
          src={landingArtPath + '.webp'}
          alt=""
          width={1920}
          height={1080}
          fetchPriority="high"
        />
      </picture>
      <div className={styles.content}>
        <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
          Maybe <span>Tomorrow</span>
        </h1>
        <p className={styles.intro}>
          Forme ton équipe et tente de survivre un jour de plus.
        </p>
        <button type="button" className="game-button" onClick={onPlay}>
          Jouer
        </button>
      </div>
    </main>
  )
}
