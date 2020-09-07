import React from 'react'
import { LayoutType } from './useLayout'
import Controller, { ControllerEvent } from '../controller/controller'
import { useKeyboardCommands } from '../commands/hook'
import rafManager from '../utils/RafManager'
import InputLayer from './InputLayer'
import CharacterTool from '../tools/CharacterTool'
import Winner from './Winner'

const getSizeForLayout = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Desktop:
            return { rows: 40, columns: 60, cellSize: 20 }
        case LayoutType.iPad:
            return { rows: 30, columns: 30, cellSize: 30 }
        case LayoutType.iPadSmall:
            return { rows: 30, columns: 30, cellSize: 20 }
        case LayoutType.PhonePortrait:
            return { rows: 25, columns: 15, cellSize: 20 }
        case LayoutType.PhoneLandscape:
            return { rows: 15, columns: 25, cellSize: 20 }
    }
}

interface IProps {
    layoutType: LayoutType
}

const Canvas = ({ layoutType }: IProps) => {
    const [won, setWon] = React.useState(false)
    const size = React.useMemo(() => getSizeForLayout(layoutType), [layoutType])
    const controller = React.useMemo(() => new Controller(size.rows, size.columns, size.cellSize), [size])
    const gridCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const characterCanvasRef = React.useRef<HTMLCanvasElement>(null)

    const { width, height } = controller.canvasSize

    const newLevel = React.useCallback(() => {
        controller.newLevel()
        setWon(false)
    }, [controller])

    React.useEffect(() => {
        controller.mazeSize(size.rows, size.columns, size.cellSize)
    }, [controller, size])

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
                    setWon(true)
                    return
                }
            }
        })
    }, [controller])
    React.useEffect(() => {
        if (controller.toolStack.currentTool !== undefined) {
            return
        }
        // initialize a new toolstack
        controller.toolStack.replace(new CharacterTool())
    }, [controller.toolStack])
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
        <Stacked>
            <InputLayer controller={controller} />
        </Stacked>
        {won && <Stacked>
            <Winner nextLevel={newLevel} controller={controller} />
        </Stacked>}
    </div>
}

const Stacked = ({ children }: { children: React.ReactNode }) => <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{children}</div>

export default Canvas