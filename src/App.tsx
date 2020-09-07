import React from 'react'
import './App.css'
import Canvas from './components/Canvas'
import { useLayoutType } from './components/useLayout'

function App() {
  const layoutType = useLayoutType()
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
          <Canvas layoutType={layoutType} />
        </div>
      </div>
      <div style={{ zIndex: 100, width: '100%', padding: '0 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', fontWeight: 800, fontSize: 32, height: 100 }}>
        <div>amazed.fun</div>
        <a style={{ color: 'white', fontWeight: 500, fontSize: 24 }} href="https://twitter.com/ltm" target="_window">by @ltm</a>
      </div>
      <div style={{ visibility: 'hidden', fontWeight: 'bold', fontFamily: "Montserrat" }}>amazed.fun</div>
    </>
  )
}

export default App
