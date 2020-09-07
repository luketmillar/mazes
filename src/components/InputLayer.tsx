import React from 'react'
import InputHandler from '../utils/InputHandler'
import { Position } from '../models/Position'
import Controller, { ControllerEvent } from '../controller/controller'


const useInputHandler = (controller: Controller, inputRef: React.RefObject<HTMLDivElement>) => {
    const inputHandler = React.useMemo(() => {
        return new InputHandler(controller.maze.rows, controller.maze.columns, controller.renderer.cellSize)
    }, [controller.maze.columns, controller.maze.rows, controller.renderer.cellSize])

    const handleMouseMove = React.useCallback((e: MouseEvent) => {
        inputHandler.onMouseMove({ x: e.clientX, y: e.clientY })
    }, [inputHandler])
    const handleMouseUp = React.useCallback((e: MouseEvent) => {
        inputHandler.onMouseUp()
    }, [inputHandler])
    const handleTouchMove = React.useCallback((e: TouchEvent) => {
        e.preventDefault()
        if (e.touches.length !== 1) {
            return
        }
        e.stopPropagation()
        const touch = e.touches[0]
        inputHandler.onMouseMove({ x: touch.clientX, y: touch.clientY })
    }, [inputHandler])
    const handleTouchEnd = React.useCallback((e: TouchEvent) => {
        e.preventDefault()
        if (e.touches.length !== 0) {
            return
        }
        e.stopPropagation()
        inputHandler.onMouseUp()
    }, [inputHandler])
    React.useEffect(() => {
        inputHandler.setElement(inputRef.current!)
        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('touchmove', handleTouchMove)
        window.addEventListener('mouseup', handleMouseUp)
        window.addEventListener('touchend', handleTouchEnd)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('mouseup', handleMouseUp)
            window.removeEventListener('touchend', handleTouchEnd)
        }
    }, [handleMouseMove, handleMouseUp, handleTouchEnd, handleTouchMove, inputHandler, inputRef])
    React.useEffect(() => {
        return inputHandler.subscribe({
            onStart: (position: Position) => controller.toolStack.currentTool?.onStart(position),
            onMove: (position: Position) => controller.toolStack.currentTool?.onMove(position),
            onEnd: (position: Position) => controller.toolStack.currentTool?.onEnd(position),
        })
    }, [controller.toolStack.currentTool, inputHandler, inputRef])
    return inputHandler
}

const useForceRender = () => {
    const [key, setKey] = React.useState(0)
    const render = React.useCallback(() => {
        setKey(key => key + 1)
    }, [])
    return { render, key }
}

interface IProps {
    controller: Controller
}
const InputLayer = ({ controller }: IProps) => {
    const { render } = useForceRender()
    React.useEffect(() => {
        return controller.subscribe((event: ControllerEvent) => {
            if (event === ControllerEvent.Win) {
                render()
            }
        })
    }, [controller, render])
    const inputRef = React.useRef<HTMLDivElement>(null)
    const inputHandler = useInputHandler(controller, inputRef)
    const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
        inputHandler.onMouseDown({ x: e.clientX, y: e.clientY }, { metaKey: e.metaKey })
    }, [inputHandler])
    const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
        e.preventDefault()
        if (e.touches.length !== 1) {
            return
        }
        e.stopPropagation()
        const touch = e.touches[0]
        inputHandler.onMouseDown({ x: touch.clientX, y: touch.clientY })
    }, [inputHandler])
    return <div ref={inputRef} style={{ width: '100%', height: '100%' }} onMouseDown={handleMouseDown} onTouchStart={handleTouchStart} />
}

export default React.memo(InputLayer)