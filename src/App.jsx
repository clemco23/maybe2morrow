import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'
import { useGameAudio } from './audio/useGameAudio.js'
import AudioSettings from './components/AudioSettings.jsx'
import { createGame } from './game/survival.js'
import HomeScreen from './screens/HomeScreen.jsx'
import IntroScreen from './screens/IntroScreen.jsx'

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
  const [screen, setScreen] = useState('intro')
  const [initialGame, setInitialGame] = useState(null)
  const menuRef = useRef(null)
  const rotationTitleRef = useRef(null)
  const {
    settings,
    updateSettings,
    handleClick,
    playMenuError,
    playGameSounds,
    stopGameSounds,
  } = useGameAudio()
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
    setInitialGame(createGame(selectedTeam, Math.random()))
    setScreen('apartment')
  }

  function quitApartment() {
    stopGameSounds()
    setInitialGame(null)
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
          onClickCapture={screen === 'intro' ? undefined : handleClick}
        >
          {screen === 'selection' ? <AudioSettings {...audioSettings} /> : null}

          <Suspense
            fallback={
              <main className="loading-screen" role="status">
                Chargement…
              </main>
            }
          >
            {screen === 'intro' ? (
              <IntroScreen
                landscape={landscape}
                onSkip={(event) => {
                  handleClick(event)
                  setScreen('home')
                }}
                onFinish={() => setScreen('home')}
              />
            ) : screen === 'home' ? (
              <HomeScreen
                onPlay={() => setScreen('selection')}
                audioSettings={audioSettings}
              />
            ) : screen === 'selection' ? (
              <CharacterSelectionScreen
                onBack={() => setScreen('home')}
                onStart={enterApartment}
                onSelectionLimit={playMenuError}
              />
            ) : (
              <ApartmentScreen
                initialGame={initialGame}
                audioSettings={audioSettings}
                playGameSounds={playGameSounds}
                onQuit={quitApartment}
              />
            )}
          </Suspense>
        </div>
      ) : null}
    </>
  )
}
