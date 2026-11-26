import { useEffect, useRef } from 'react'
import AudioSettings from '../components/AudioSettings.jsx'
import MenuDialog from '../components/MenuDialog.jsx'
import styles from './ApartmentScreen.module.css'

const backdropPath = import.meta.env.BASE_URL + 'assets/set/background-web'

export default function ApartmentScreen({ team, audioSettings, onEditTeam }) {
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current.focus()
  }, [])

  return (
    <main className={styles.screen}>
      <picture className={styles.backdrop} aria-hidden="true">
        <source
          media="(max-width: 44rem)"
          srcSet={backdropPath + '-960.webp 1x, ' + backdropPath + '.webp 2x'}
        />
        <img
          src={backdropPath + '.webp'}
          alt=""
          width={1920}
          height={1081}
          fetchPriority="high"
        />
      </picture>

      <header className={styles.toolbar}>
        <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
          L’appartement
        </h1>
        <AudioSettings
          {...audioSettings}
          triggerClassName={
            'game-button ' + styles.plaque + ' ' + styles.settingsControl
          }
        />
        <button
          type="button"
          className={'game-button ' + styles.plaque + ' ' + styles.editControl}
          onClick={onEditTeam}
        >
          Modifier l’équipe
        </button>
      </header>

      <ul className={styles.team} aria-label="Ton équipe" role="list">
        {team.map((character) => (
          <li key={character.id} className={styles.character}>
            <img
              src={character.portrait}
              alt=""
              width={character.width}
              height={character.height}
            />
            <span>{character.name}</span>
          </li>
        ))}
      </ul>

      <div className={styles.help}>
        <MenuDialog
          title="Règles du jeu"
          triggerClassName={'game-button ' + styles.plaque}
        >
          <p className={styles.rulesIntro}>
            Voici les règles prévues pour la partie.
          </p>
          <dl className={styles.rules} tabIndex={0}>
            <div>
              <dt>Survivre au confinement</dt>
              <dd>
                Garde le plus d’amis possible en vie. Le confinement prend fin à
                une date inconnue entre les jours 15 et 55. Si toute l’équipe
                est perdue, la partie s’arrête.
              </dd>
            </div>
            <div>
              <dt>Gérer les provisions</dt>
              <dd>
                Répartis l’eau et la nourriture et garde des soins pour les
                personnages malades. Les stocks sont communs à l’équipe.
              </dd>
            </div>
            <div>
              <dt>Passer au jour suivant</dt>
              <dd>
                Chaque jour peut apporter un incident. Choisis comment réagir et
                surveille aussi le moral du groupe.
              </dd>
            </div>
            <div>
              <dt>Partir en expédition</dt>
              <dd>
                Envoyer quelqu’un dehors peut rapporter des provisions ou des
                objets. Le personnage peut aussi revenir malade ou disparaître.
              </dd>
            </div>
          </dl>
        </MenuDialog>
      </div>
    </main>
  )
}
