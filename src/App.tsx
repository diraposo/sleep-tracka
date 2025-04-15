import { useState } from 'react'
import SleepTracker from "./components/SleepTracker"
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <SleepTracker />
      </main>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
