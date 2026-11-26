import { useEffect, useRef, useState } from 'react'
import { CHARACTERS, TEAM_SIZE } from '../game/characters.js'
import styles from './CharacterSelectionScreen.module.css'

export default function CharacterSelectionScreen({ onBack }) {
  const [selectedIds, setSelectedIds] = useState([])
  const [confirmed, setConfirmed] = useState(false)
  const titleRef = useRef(null)
  const teamIsFull = selectedIds.length === TEAM_SIZE

  useEffect(() => {
    titleRef.current.focus()
  }, [confirmed])

  function toggleCharacter(id) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(id)) {
        return currentIds.filter((currentId) => currentId !== id)
      }

      return currentIds.length < TEAM_SIZE ? [...currentIds, id] : currentIds
    })
  }

  function confirmTeam() {
    if (teamIsFull) {
      setConfirmed(true)
    }
  }

  const visibleCharacters = confirmed
    ? selectedIds.map((id) =>
        CHARACTERS.find((character) => character.id === id),
      )
    : CHARACTERS

  return (
    <main className={styles.screen}>
      <div className={styles.layout}>
        <button type="button" className={styles.back} onClick={onBack}>
          <span aria-hidden="true">←</span> Accueil
        </button>

        <section className={styles.panel} aria-labelledby="selection-title">
          <div className={styles.header}>
            <div>
              <h1 id="selection-title" ref={titleRef} tabIndex={-1}>
                {confirmed ? 'Ton équipe est prête' : 'Forme ton équipe'}
              </h1>
              {confirmed ? null : (
                <p>Choisis {TEAM_SIZE} personnages pour commencer.</p>
              )}
            </div>
            {confirmed ? null : (
              <p className={styles.count} role="status" aria-atomic="true">
                <strong>
                  {selectedIds.length} / {TEAM_SIZE}
                </strong>{' '}
                sélectionnés
              </p>
            )}
          </div>

          <ul className={confirmed ? styles.team : styles.roster}>
            {visibleCharacters.map((character) => (
              <li key={character.id}>
                <CharacterCard
                  character={character}
                  selected={selectedIds.includes(character.id)}
                  confirmed={confirmed}
                  disabled={teamIsFull && !selectedIds.includes(character.id)}
                  onToggle={() => toggleCharacter(character.id)}
                />
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {confirmed ? (
              <button
                type="button"
                className="game-button"
                onClick={() => setConfirmed(false)}
              >
                Modifier l’équipe
              </button>
            ) : (
              <button
                type="button"
                className="game-button"
                disabled={!teamIsFull}
                onClick={confirmTeam}
              >
                Commencer <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function CharacterCard({ character, selected, confirmed, disabled, onToggle }) {
  const portrait = (
    <>
      <img
        className={styles.portrait}
        src={character.portrait}
        alt=""
        width={character.width}
        height={character.height}
      />
      <span className={styles.name}>{character.name}</span>
    </>
  )

  if (confirmed) {
    return <div className={styles.card}>{portrait}</div>
  }

  return (
    <button
      type="button"
      className={styles.card}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
    >
      <span className={styles.indicator} aria-hidden="true">
        {selected ? '✓' : '+'}
      </span>
      {portrait}
    </button>
  )
}
