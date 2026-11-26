import { lazy, Suspense, useState } from 'react'
import { useMenuAudio } from './audio/useMenuAudio.js'
import AudioSettings from './components/AudioSettings.jsx'
import HomeScreen from './screens/HomeScreen.jsx'

const CharacterSelectionScreen = lazy(
  () => import('./screens/CharacterSelectionScreen.jsx'),
)

export default function App() {
  const [screen, setScreen] = useState('home')
  const { settings, updateSettings, handleMenuClick } = useMenuAudio()

  return (
    <div className="menu" onClickCapture={handleMenuClick}>
      <AudioSettings settings={settings} onChange={updateSettings} />

      {screen === 'home' ? (
        <HomeScreen onPlay={() => setScreen('selection')} />
      ) : (
        <Suspense
          fallback={
            <main className="loading-screen" role="status">
              Chargement de la sélection…
            </main>
          }
        >
          <CharacterSelectionScreen onBack={() => setScreen('home')} />
        </Suspense>
      )}
    </div>
  )
}
