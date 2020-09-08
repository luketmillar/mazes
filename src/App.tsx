import React from 'react'
import './App.css'
import Canvas from './components/Canvas'

function App() {
  React.useEffect(() => {
    const preventBehavior = (e: TouchEvent) => {
      e.preventDefault()
    }

    document.addEventListener("touchmove", preventBehavior)
    return () => {
      document.removeEventListener("touchmove", preventBehavior)
    }
  })
  return (
    <>
      <div style={{ zIndex: -10, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <Canvas />
        </div>
      </div>
      <div style={{ zIndex: 100, padding: '0 20px', height: 60, display: 'flex', alignItems: 'center' }}>
        <a style={{ backgroundColor: '#E1219B', padding: '5px 10px', color: 'white', fontWeight: 500, fontSize: 16 }} href="https://twitter.com/ltm" target="_window">@ltm</a>
      </div>
      <div style={{ visibility: 'hidden', fontWeight: 'bold', fontFamily: "Montserrat" }}>amazed.fun</div>
    </>
  )
}

export default App
