import MenuDialog from '../components/MenuDialog.jsx'
import { getCharacterPortrait } from '../game/characters.js'
import { canUseProvision, MAX_NEED } from '../game/survival.js'
import styles from './ApartmentScreen.module.css'

const actions = [
  { resource: 'food', label: 'Nourrir' },
  { resource: 'water', label: 'Hydrater' },
  { resource: 'medicine', label: 'Soigner' },
]

const statusLabels = {
  healthy: 'En bonne santé',
  dead: 'Décès',
}

export default function ApartmentCharacter({
  character,
  game,
  onUseProvision,
}) {
  const portrait = getCharacterPortrait(character)
  const status =
    character.status === 'sick'
      ? 'Maladie · jour ' + character.sickDays
      : statusLabels[character.status]

  return (
    <li className={styles.character}>
      <div className={styles.gauges}>
        <NeedGauge
          icon="🥫"
          label={'Nourriture de ' + character.name}
          value={character.food}
        />
        <NeedGauge
          icon="💧"
          label={'Eau de ' + character.name}
          value={character.water}
        />
      </div>

      <MenuDialog
        title={character.name}
        triggerClassName={styles.characterButton}
        iconOnly
        icon={
          <span
            className={styles.avatar}
            style={{ '--portrait-mask': 'url("' + portrait + '")' }}
          >
            <span className={styles.castShadow} aria-hidden="true" />
            <img
              src={portrait}
              alt=""
              width={character.width}
              height={character.height}
            />
          </span>
        }
      >
        <div className={styles.characterDetails}>
          <p>{status}</p>
          <p>
            Nourriture {character.food} / {MAX_NEED} · Eau {character.water} /{' '}
            {MAX_NEED}
          </p>
          <div className={styles.characterActions}>
            {actions.map(({ resource, label }) => (
              <button
                key={resource}
                type="button"
                data-game-action=""
                className="secondary-button"
                disabled={!canUseProvision(game, character, resource)}
                onClick={() => onUseProvision(character.id, resource)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </MenuDialog>
      <span className={styles.characterName}>{character.name}</span>
    </li>
  )
}

function NeedGauge({ icon, label, value }) {
  return (
    <span className={styles.needGauge}>
      <span aria-hidden="true">{icon}</span>
      <meter
        className={styles.meter}
        aria-label={label}
        min={0}
        max={MAX_NEED}
        low={2}
        optimum={MAX_NEED}
        value={value}
      />
    </span>
  )
}
