import { useEffect, useReducer, useRef } from 'react'
import { getGameSoundCues } from '../audio/getGameSoundCues.js'
import AudioSettings from '../components/AudioSettings.jsx'
import GameRules from '../components/GameRules.jsx'
import MenuDialog from '../components/MenuDialog.jsx'
import { gameReducer } from '../game/survival.js'
import ApartmentCharacter from './ApartmentCharacter.jsx'
import styles from './ApartmentScreen.module.css'

const backdropPath = import.meta.env.BASE_URL + 'assets/set/background-web'

const provisions = [
  { resource: 'food', label: 'Nourriture', icon: '🥫' },
  { resource: 'water', label: 'Eau', icon: '💧' },
  { resource: 'medicine', label: 'Soins', icon: '✚' },
]

export default function ApartmentScreen({
  initialGame,
  audioSettings,
  playGameSounds,
  onQuit,
}) {
  const titleRef = useRef(null)
  const journalRef = useRef(null)
  const [game, dispatch] = useReducer(gameReducer, initialGame)
  const previousGame = useRef(game)

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  useEffect(() => {
    journalRef.current.scrollTop = 0
  }, [game.day])

  useEffect(() => {
    if (previousGame.current === game) return

    const cues = getGameSoundCues(previousGame.current, game)
    previousGame.current = game
    playGameSounds(cues)
  }, [game, playGameSounds])

  function advanceDay() {
    dispatch({
      type: 'next-day',
      rolls: {
        event: Math.random(),
        target: Math.random(),
        loss: Math.random(),
      },
    })
  }

  function spendProvision(characterId, resource) {
    dispatch({ type: 'use-provision', characterId, resource })
  }

  return (
    <main className={styles.screen} aria-label="L’appartement">
      <RoomBackdrop className={styles.ambientBackdrop} />
      <RoomBackdrop className={styles.backdrop} priority="high" />

      <header className={styles.toolbar}>
        <MenuDialog
          title="Quitter la partie"
          triggerClassName={styles.iconButton + ' ' + styles.quitControl}
          iconOnly
          icon={<span className={styles.exitIcon} aria-hidden="true" />}
          onConfirm={onQuit}
          confirmLabel="Quitter"
        >
          <p className={styles.dialogCopy}>Tu reviendras à l’accueil.</p>
        </MenuDialog>
        <div className={styles.dayPanel}>
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            Jour {game.day}
          </h1>
          <ul
            className={styles.stocks}
            aria-label="Provisions communes"
            role="list"
          >
            {provisions.map(({ resource, label, icon }) => (
              <li key={resource}>
                <span aria-hidden="true">{icon}</span> {label}{' '}
                <strong>{game.stock[resource]}</strong>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={styles.controls}
          role="group"
          aria-label="Commandes de l’appartement"
        >
          <AudioSettings
            {...audioSettings}
            triggerClassName={styles.iconButton}
            iconOnly
          />
          <GameRules triggerClassName={styles.iconButton} />
        </div>
      </header>

      <ul className={styles.team} aria-label="Ton équipe" role="list">
        {game.characters.map((character) => (
          <ApartmentCharacter
            key={character.id}
            character={character}
            game={game}
            onUseProvision={spendProvision}
          />
        ))}
      </ul>

      <div
        ref={journalRef}
        className={styles.journal}
        role="log"
        aria-label="Journal de la journée"
        tabIndex={0}
      >
        <p className={styles.journalTitle}>Journal</p>
        <ul key={game.day}>
          {game.log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        data-game-action=""
        className={'game-button ' + styles.nextDay}
        disabled={Boolean(game.outcome)}
        onClick={advanceDay}
      >
        {game.outcome ? 'Partie terminée' : 'Jour suivant'}
      </button>
    </main>
  )
}

function RoomBackdrop({ className, priority }) {
  return (
    <picture className={className} aria-hidden="true">
      <source
        media="(max-width: 44rem), (max-width: 60rem) and (max-height: 34rem)"
        srcSet={backdropPath + '-960.webp 1x, ' + backdropPath + '.webp 2x'}
      />
      <img
        src={backdropPath + '.webp'}
        alt=""
        width={1920}
        height={1081}
        fetchPriority={priority}
      />
    </picture>
  )
}
