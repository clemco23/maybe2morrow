import { useId, useRef } from 'react'
import styles from './MenuDialog.module.css'

export default function MenuDialog({
  title,
  triggerClassName = 'secondary-button',
  icon,
  children,
}) {
  const headingId = useId()
  const dialogRef = useRef(null)
  const headingRef = useRef(null)
  const triggerRef = useRef(null)

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-haspopup="dialog"
        onClick={() => {
          dialogRef.current.showModal()
          headingRef.current.focus()
        }}
      >
        {icon}
        {title}
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby={headingId}
        onClose={() => triggerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
      >
        <div className={styles.content}>
          <h2 ref={headingRef} id={headingId} tabIndex={-1}>
            {title}
          </h2>
          <div className={styles.body}>{children}</div>
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
