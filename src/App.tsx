import React from 'react'
import './App.css'
import Canvas from './components/Canvas'
import AlgorithmPicker from './components/AlgorithmPicker'
import * as Algorithms from './models/MazeAlgorithms/Directory'

function App() {
  const [algorithm, setAlgorithm] = React.useState(Algorithms.Type.Wilson)
  const [key, setKey] = React.useState(0)
  return (
    <div style={{ margin: 100, display: 'flex' }}>
      <div style={{ marginTop: 40 }}>
        <AlgorithmPicker type={algorithm} onChange={setAlgorithm} />
      </div>
      <div style={{ width: 60 }} />
      <div style={{}}>
        <div style={{ cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 3, fontWeight: 600 }} onClick={() => setKey(v => v + 1)}>New</div>
        <div style={{ height: 10 }} />
        <Canvas key={key} algorithmType={algorithm} />
      </div>
    </div>
  )
}

export default App
