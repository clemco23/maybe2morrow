import { useEffect, useRef, useState } from 'react'
import { CHARACTERS, TEAM_SIZE } from '../game/characters.js'
import styles from './CharacterSelectionScreen.module.css'

export default function CharacterSelectionScreen({
  onBack,
  onStart,
  onSelectionLimit,
}) {
  const [selectedIds, setSelectedIds] = useState([])
  const titleRef = useRef(null)
  const teamIsFull = selectedIds.length === TEAM_SIZE

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  function toggleCharacter(id) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id)
      }

      return currentIds.length < TEAM_SIZE ? [...currentIds, id] : currentIds
    })
  }

  function startGame() {
    if (!teamIsFull) return

    const team = selectedIds.map((id) =>
      CHARACTERS.find((character) => character.id === id),
    )
    onStart(team)
  }

  return (
    <main className={styles.screen}>
      <div className={styles.layout}>
        <button
          type="button"
          className={'secondary-button ' + styles.back}
          onClick={onBack}
        >
          Accueil
        </button>

        <section className={styles.panel} aria-labelledby="selection-title">
          <div className={styles.header}>
            <div>
              <h1 id="selection-title" ref={titleRef} tabIndex={-1}>
                Forme ton équipe
              </h1>
              <p>Choisis {TEAM_SIZE} personnages pour commencer.</p>
            </div>
            <p className={styles.count} role="status" aria-atomic="true">
              <strong>
                {selectedIds.length} / {TEAM_SIZE}
              </strong>{' '}
              sélectionnés
            </p>
          </div>

          <ul className={styles.roster}>
            {CHARACTERS.map((character) => {
              const selected = selectedIds.includes(character.id)
              const unavailable = teamIsFull && !selected

              return (
                <li key={character.id}>
                  <CharacterCard
                    character={character}
                    selected={selected}
                    unavailable={unavailable}
                    onToggle={
                      unavailable
                        ? onSelectionLimit
                        : () => toggleCharacter(character.id)
                    }
                  />
                </li>
              )
            })}
          </ul>

          <div className={styles.actions}>
            <button
              type="button"
              className="game-button"
              disabled={!teamIsFull}
              onClick={startGame}
            >
              Commencer
            </button>
          </div>
        </section>
      </div>
    </main>
  )
}

function CharacterCard({ character, selected, unavailable, onToggle }) {
  return (
    <button
      type="button"
      className={styles.card}
      aria-pressed={selected}
      aria-disabled={unavailable}
      onClick={onToggle}
    >
      <span className={styles.indicator} aria-hidden="true">
        {selected ? '✓' : '+'}
      </span>
      <img
        className={styles.portrait}
        src={character.portrait}
        alt=""
        width={character.width}
        height={character.height}
      />
      <span className={styles.name}>{character.name}</span>
    </button>
  )
}
