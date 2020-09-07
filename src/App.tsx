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
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <Canvas layoutType={layoutType} />
        </div>
      </div>
      <div style={{ visibility: 'hidden', fontWeight: 'bold', fontFamily: "Montserrat" }}>amazed.fun</div>
    </>
  )
}

export default App
