import MenuDialog from './MenuDialog.jsx'
import styles from './GameRules.module.css'

export default function GameRules({ triggerClassName }) {
  return (
    <MenuDialog
      title="Règles du jeu"
      triggerClassName={triggerClassName}
      iconOnly
      icon={<span aria-hidden="true">?</span>}
    >
      <dl className={styles.rules} tabIndex={0}>
        <div>
          <dt>Survivre au confinement</dt>
          <dd>
            Garde le plus d’amis possible en vie. Le confinement prend fin à une
            date inconnue entre les jours 15 et 55. Si toute l’équipe est
            perdue, la partie s’arrête.
          </dd>
        </div>
        <div>
          <dt>Gérer les provisions</dt>
          <dd>
            Sélectionne un personnage pour lui donner à boire, à manger ou pour
            le soigner. Toute l’équipe puise dans les mêmes provisions.
          </dd>
        </div>
        <div>
          <dt>Passer au jour suivant</dt>
          <dd>
            Chaque jour peut apporter un incident. Vérifie le journal, puis
            utilise les provisions pour prendre soin de ton équipe.
          </dd>
        </div>
        <div>
          <dt>Surveiller les jauges</dt>
          <dd>
            Une jauge à zéro est fatale. Soigne un personnage malade avant son
            troisième jour de maladie.
          </dd>
        </div>
      </dl>
    </MenuDialog>
  )
}
