import React from 'react'
import * as Algorithms from '../models/MazeAlgorithms/Directory'
import { LayoutType } from './useLayout'
import Controller, { ControllerEvent } from '../controller/controller'
import { useKeyboardCommands } from '../commands/hook'
import rafManager from '../utils/RafManager'


interface IProps {
    algorithmType: Algorithms.Type
    layoutType: LayoutType
}

const Canvas = ({ algorithmType, layoutType }: IProps) => {
    const controller = React.useMemo(() => new Controller(), [])
    const gridCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const characterCanvasRef = React.useRef<HTMLCanvasElement>(null)

    const { width, height } = controller.canvasSize

    React.useEffect(() => {
        return controller.subscribe((event: ControllerEvent) => {
            const mazeCtx = gridCanvasRef.current?.getContext('2d')
            const characterCtx = characterCanvasRef.current?.getContext('2d')
            if (!mazeCtx || !characterCtx) {
                return
            }
            switch (event) {
                case ControllerEvent.All: {
                    controller.drawMaze(mazeCtx)
                    controller.drawCharacter(characterCtx)
                    return
                }
                case ControllerEvent.Character: {
                    controller.drawCharacter(characterCtx)
                    return
                }
                case ControllerEvent.Maze: {
                    controller.drawMaze(mazeCtx)
                    return
                }
                case ControllerEvent.Win: {
                    controller.newLevel()
                    return
                }
            }
        })
    }, [controller])
    React.useEffect(() => {
        const onRaf = (timestamp: number) => {
            controller.tickTime(timestamp)
        }
        return rafManager.addListener(onRaf)
    }, [controller])
    useKeyboardCommands(controller)

    return <div style={{ width, height, position: 'relative' }}>
        <Stacked>
            <canvas ref={gridCanvasRef} width={width} height={height} />
        </Stacked>
        <Stacked>
            <canvas ref={characterCanvasRef} width={width} height={height} />
        </Stacked>
    </div>
}

const Stacked = ({ children }: { children: React.ReactNode }) => <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{children}</div>

export default Canvas