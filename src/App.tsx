import React from 'react'
import './App.css'
import Canvas from './components/Canvas'
import AlgorithmPicker from './components/AlgorithmPicker'
import * as Algorithms from './models/MazeAlgorithms/Directory'

function App() {
  const [algorithm, setAlgorithm] = React.useState(Algorithms.Type.Sidewinder)
  return (
    <div style={{ margin: 100, display: 'flex' }}>
      <div style={{ marginTop: 40 }}>
        <AlgorithmPicker type={algorithm} onChange={setAlgorithm} />
      </div>
      <div style={{ width: 60 }} />
      <Canvas algorithmType={algorithm} />
    </div>
  )
}

export default App
