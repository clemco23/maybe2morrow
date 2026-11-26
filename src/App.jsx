import { lazy, Suspense, useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'

const CharacterSelectionScreen = lazy(
  () => import('./screens/CharacterSelectionScreen.jsx'),
)

export default function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'home') {
    return <HomeScreen onPlay={() => setScreen('selection')} />
  }

  return (
    <Suspense
      fallback={
        <main className="loading-screen" role="status">
          Chargement de la sélection…
        </main>
      }
    >
      <CharacterSelectionScreen onBack={() => setScreen('home')} />
    </Suspense>
  )
}
