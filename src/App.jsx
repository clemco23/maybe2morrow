import { lazy, Suspense, useState } from 'react'
import { useMenuAudio } from './audio/useMenuAudio.js'
import AudioSettings from './components/AudioSettings.jsx'
import HomeScreen from './screens/HomeScreen.jsx'

const CharacterSelectionScreen = lazy(
  () => import('./screens/CharacterSelectionScreen.jsx'),
)
const ApartmentScreen = lazy(() => import('./screens/ApartmentScreen.jsx'))

export default function App() {
  const [screen, setScreen] = useState('home')
  const [team, setTeam] = useState([])
  const { settings, updateSettings, handleMenuClick } = useMenuAudio()
  const audioSettings = { settings, onChange: updateSettings }

  function returnHome() {
    setTeam([])
    setScreen('home')
  }

  function enterApartment(selectedTeam) {
    setTeam(selectedTeam)
    setScreen('apartment')
  }

  return (
    <div className="menu" onClickCapture={handleMenuClick}>
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
            initialTeam={team}
            onBack={returnHome}
            onStart={enterApartment}
          />
        ) : (
          <ApartmentScreen
            team={team}
            audioSettings={audioSettings}
            onEditTeam={() => setScreen('selection')}
          />
        )}
      </Suspense>
    </div>
  )
}
