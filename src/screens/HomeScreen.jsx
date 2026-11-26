import { useEffect, useRef } from 'react'
import AudioSettings from '../components/AudioSettings.jsx'
import GameRules from '../components/GameRules.jsx'
import styles from './HomeScreen.module.css'

const landingArtPath = import.meta.env.BASE_URL + 'assets/set/landingpage-web'

export default function HomeScreen({ onPlay, audioSettings }) {
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  return (
    <main className={styles.screen} aria-label="Accueil">
      <picture className={styles.ambient} aria-hidden="true">
        <img src={landingArtPath + '.webp'} alt="" width={1920} height={1080} />
      </picture>
      <div className={styles.stage}>
        <picture className={styles.scenery} aria-hidden="true">
          <source
            media="(max-width: 44rem), (max-width: 60rem) and (max-height: 34rem)"
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
        <h1 ref={titleRef} tabIndex={-1} className={styles.visuallyHidden}>
          Maybe Tomorrow
        </h1>
        <button type="button" className={styles.play} onClick={onPlay}>
          Jouer
        </button>
      </div>
      <div
        className={styles.controls}
        role="group"
        aria-label="Commandes de l’accueil"
      >
        <AudioSettings
          {...audioSettings}
          triggerClassName={styles.iconButton}
          iconOnly
        />
        <GameRules triggerClassName={styles.iconButton} />
      </div>
    </main>
  )
}
