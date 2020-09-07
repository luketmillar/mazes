import React from 'react'
import { LayoutType, getWindowSize, getLayoutType } from './useLayout'
import Controller, { ControllerEvent } from '../controller/controller'
import { useKeyboardCommands } from '../commands/hook'
import rafManager from '../utils/RafManager'
import InputLayer from './InputLayer'
import CharacterTool from '../tools/CharacterTool'
import Winner from './Winner'
import { Size } from '../utils/Types'

const getSize = (size: Size, layoutType: LayoutType) => {
    let clippedSize = size
    const aspectRatio = size.width / size.height
    if (aspectRatio < 0.5) {
        clippedSize = { width: size.width, height: size.width * 1.5 }
    } else if (aspectRatio > 2) {
        clippedSize = { height: size.height, width: size.height * 1.5 }
    }
    if (clippedSize.width < clippedSize.height) {
        return getPortraitSize(clippedSize, layoutType)
    } else {
        return getLandscapeSize(clippedSize, layoutType)
    }
}

const getPortraitSize = (size: Size, layoutType: LayoutType) => {
    const isPhone = layoutType === LayoutType.PhonePortrait || layoutType === LayoutType.PhoneLandscape
    const padding = isPhone ? 20 : 50
    const possibleCanvasSize = { width: (size.width - padding * 2), height: (size.height - padding * 2) }
    const minColumns = isPhone ? 12 : 15
    let cellSize = 40
    let columns = Math.floor(possibleCanvasSize.width / cellSize)
    if (columns > 40) {
        columns = 40
    }
    if (columns < minColumns) {
        const maxCellSize = Math.floor(possibleCanvasSize.width / minColumns)
        cellSize = maxCellSize
        columns = minColumns
    } else {
        cellSize = Math.floor(possibleCanvasSize.width / columns)
    }
    const rows = Math.floor(possibleCanvasSize.height / cellSize)
    return { rows, columns, cellSize }
}

const getLandscapeSize = (size: Size, layoutType: LayoutType) => {
    const isPhone = layoutType === LayoutType.PhonePortrait || layoutType === LayoutType.PhoneLandscape
    const padding = isPhone ? 20 : 50
    const possibleCanvasSize = { width: (size.width - padding * 2), height: (size.height - padding * 2) }
    const minRows = isPhone ? 12 : 15
    let cellSize = 40
    let rows = Math.floor(possibleCanvasSize.height / cellSize)
    if (rows > 40) {
        rows = 40
    }
    if (rows < minRows) {
        const maxCellSize = Math.floor(possibleCanvasSize.height / minRows)
        cellSize = maxCellSize
        rows = minRows
    } else {
        cellSize = Math.floor(possibleCanvasSize.height / rows)
    }
    const columns = Math.floor(possibleCanvasSize.width / cellSize)
    return { rows, columns, cellSize }
}

const getSizeForLayout = () => {
    const windowSize = getWindowSize()
    const layoutType = getLayoutType(windowSize)
    return getSize(windowSize, layoutType)
}

interface IProps {
    layoutType: LayoutType
}

const Canvas = ({ layoutType }: IProps) => {
    const [won, setWon] = React.useState(false)
    const size = React.useMemo(() => getSizeForLayout(), [])
    const controller = React.useMemo(() => new Controller(size.rows, size.columns, size.cellSize), [size])
    const gridCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const characterCanvasRef = React.useRef<HTMLCanvasElement>(null)

    const canvasSize = controller.canvasSize
    const screenSize = controller.screenSize

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

    return <div style={{ width: screenSize.width, height: screenSize.height, position: 'relative' }}>
        <Stacked>
            <canvas style={{ width: screenSize.width, height: screenSize.height }} ref={gridCanvasRef} width={canvasSize.width} height={canvasSize.height} />
        </Stacked>
        <Stacked>
            <canvas style={{ width: screenSize.width, height: screenSize.height }} ref={characterCanvasRef} width={canvasSize.width} height={canvasSize.height} />
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