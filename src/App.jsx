import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { useMenuAudio } from './audio/useMenuAudio.js'
import AudioSettings from './components/AudioSettings.jsx'
import HomeScreen from './screens/HomeScreen.jsx'

const CharacterSelectionScreen = lazy(
  () => import('./screens/CharacterSelectionScreen.jsx'),
)
const ApartmentScreen = lazy(() => import('./screens/ApartmentScreen.jsx'))

const landscapeQuery = '(orientation: landscape)'

function subscribeToOrientation(onChange) {
  const orientation = window.matchMedia(landscapeQuery)
  orientation.addEventListener('change', onChange)
  return () => orientation.removeEventListener('change', onChange)
}

function isLandscape() {
  return window.matchMedia(landscapeQuery).matches
}

export default function App() {
  const landscape = useSyncExternalStore(subscribeToOrientation, isLandscape)
  const [hasEnteredLandscape, setHasEnteredLandscape] = useState(landscape)
  const [screen, setScreen] = useState('home')
  const [team, setTeam] = useState([])
  const menuRef = useRef(null)
  const rotationTitleRef = useRef(null)
  const { settings, updateSettings, handleMenuClick } = useMenuAudio()
  const audioSettings = { settings, onChange: updateSettings }

  if (landscape && !hasEnteredLandscape) {
    setHasEnteredLandscape(true)
  }

  useEffect(() => {
    if (!landscape) {
      menuRef.current?.querySelector('dialog[open]')?.close()
      rotationTitleRef.current?.focus()
    }
  }, [landscape])

  function enterApartment(selectedTeam) {
    setTeam(selectedTeam)
    setScreen('apartment')
  }

  function quitApartment() {
    setTeam([])
    setScreen('home')
  }

  return (
    <>
      {landscape ? null : (
        <main className="rotation-screen">
          <div className="rotation-copy">
            <span className="rotation-icon" aria-hidden="true">
              ↻
            </span>
            <h1 ref={rotationTitleRef} tabIndex={-1}>
              Passe en mode paysage
            </h1>
            <p>Tourne ton téléphone ou élargis la fenêtre pour jouer.</p>
          </div>
        </main>
      )}

      {hasEnteredLandscape ? (
        <div
          ref={menuRef}
          className="menu"
          hidden={!landscape}
          inert={!landscape}
          onClickCapture={handleMenuClick}
        >
          {screen === 'apartment' ? null : <AudioSettings {...audioSettings} />}

          <Suspense
            fallback={
              <main className="loading-screen" role="status">
                Chargement…
              </main>
            }
          >
            {screen === 'home' ? (
              <HomeScreen onPlay={() => setScreen('selection')} />
            ) : screen === 'selection' ? (
              <CharacterSelectionScreen
                onBack={() => setScreen('home')}
                onStart={enterApartment}
              />
            ) : (
              <ApartmentScreen
                team={team}
                audioSettings={audioSettings}
                onQuit={quitApartment}
              />
            )}
          </Suspense>
        </div>
      ) : null}
    </>
  )
}
