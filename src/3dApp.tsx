import React from 'react'
import styled from 'styled-components'
import './App.css'
import { useKeyboardCommands } from './commands/hook'
import InputLayer from './components/InputLayer'
import Controller from './controller/controller'
import Piston from './piston'

const Canvas = styled.canvas`
position: fixed;
top: 0;
left: 0;
outline: none;
`

const useCanvasResizer = (ref: React.RefObject<HTMLCanvasElement>) => {
    React.useEffect(() => {
        const onResize = () => {
            ref.current!.width = window.innerWidth
            ref.current!.height = window.innerHeight
        }
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
        }
    }, [ref])
}

const App = () => {
    const ref = React.useRef<HTMLCanvasElement>(null)
    const controller = React.useMemo(() => new Controller(10, 10, 20), [])
    useCanvasResizer(ref)

    React.useEffect(() => {
        const piston = new Piston(ref.current!, controller)
        piston.testScene()
        piston.start()
    }, [controller])

    useKeyboardCommands(controller)

    return <>
        <Canvas width={window.innerWidth} height={window.innerHeight} ref={ref} />
        <Stacked>
            <InputLayer controller={controller} />
        </Stacked>
    </>
}

const Stacked = ({ children }: { children: React.ReactNode }) => <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{children}</div>

export default App