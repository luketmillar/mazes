import React from 'react'
import './App.css'
import Canvas from './components/Canvas'
import AlgorithmPicker from './components/AlgorithmPicker'
import * as Algorithms from './models/MazeAlgorithms/Directory'
import { useLayoutType } from './components/useLayout'

function App() {
  const [algorithm, setAlgorithm] = React.useState(Algorithms.types[1])
  const layoutType = useLayoutType()
  return (
    <>
      <div style={{ height: 40 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="menu">
          <div style={{ marginTop: 40 }}>
            <AlgorithmPicker type={algorithm} onChange={setAlgorithm} />
          </div>
          <div style={{ width: 60 }} />
        </div>
        <div>
          <Canvas algorithmType={algorithm} layoutType={layoutType} />
        </div>
      </div>
    </>
  )
}

export default App
