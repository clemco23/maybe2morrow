import { useRef } from 'react'
import styles from './AudioSettings.module.css'

export default function AudioSettings({ settings, onChange }) {
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current.showModal()}
      >
        <span className={styles.gear} aria-hidden="true">
          ⚙︎
        </span>
        Paramètres
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="audio-settings-title"
        onClose={() => triggerRef.current.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className={styles.content}>
          <h2 id="audio-settings-title">Paramètres</h2>

          <fieldset className={styles.sound}>
            <legend>Son</legend>

            <label className={styles.mute}>
              Couper le son
              <input
                type="checkbox"
                checked={settings.muted}
                onChange={(event) => onChange({ muted: event.target.checked })}
              />
            </label>

            <VolumeControl
              label="Musique d’ambiance"
              value={settings.musicVolume}
              onChange={(musicVolume) => onChange({ musicVolume })}
            />
            <VolumeControl
              label="Sons des menus"
              value={settings.clickVolume}
              onChange={(clickVolume) => onChange({ clickVolume })}
            />
          </fieldset>

          <div className={styles.actions}>
            <button
              type="button"
              className="game-button"
              onClick={() => dialogRef.current.close()}
            >
              Fermer
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}

function VolumeControl({ label, value, onChange }) {
  return (
    <label className={styles.volume}>
      <span className={styles.volumeLabel}>
        {label}
        <span className={styles.value} aria-hidden="true">
          {value} %
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-valuetext={value + ' %'}
        onChange={(event) => onChange(event.target.valueAsNumber)}
      />
    </label>
  )
}
