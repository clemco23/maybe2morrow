import MenuDialog from './MenuDialog.jsx'
import styles from './AudioSettings.module.css'

export default function AudioSettings({
  settings,
  onChange,
  triggerClassName = 'secondary-button ' + styles.trigger,
}) {
  return (
    <MenuDialog
      title="Paramètres"
      triggerClassName={triggerClassName}
      icon={
        <span className={styles.gear} aria-hidden="true">
          ⚙︎
        </span>
      }
    >
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
    </MenuDialog>
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
