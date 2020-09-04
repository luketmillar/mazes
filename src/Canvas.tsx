import React from 'react'
import Grid from './models/Grid'
import GridDrawer from './views/GridDrawer'
import Sidewinder from './models/MazeAlgorithms/Sidewinder'
import Solver from './models/Solver'

const grid = new Grid(20, 20)
const algorithm = new Sidewinder()
algorithm.create(grid)
const solver = new Solver()
const solution = solver.solve(grid)
const drawer = new GridDrawer(grid)

const Canvas = () => {
    const [showSolution, setShowSolution] = React.useState(false)
    const gridCanvasRef = React.useRef<HTMLCanvasElement>(null)
    const pathCanvasRef = React.useRef<HTMLCanvasElement>(null)
    React.useEffect(() => {
        const ctx = gridCanvasRef.current!.getContext('2d')!
        drawer.clear(ctx)
        drawer.draw(ctx)
    }, [gridCanvasRef])
    React.useEffect(() => {
        const ctx = pathCanvasRef.current!.getContext('2d')!
        drawer.clear(ctx)
        if (showSolution) {
            drawer.drawSolution(ctx, solution)
        } else {
            drawer.drawStartEnd(ctx, solution)
        }
    }, [pathCanvasRef, showSolution])
    const toggleSolution = React.useCallback(() => {
        setShowSolution(value => !value)
    }, [])
    return <div onClick={toggleSolution} style={{ width: drawer.width, height: drawer.height, position: 'relative' }}>
        <Stacked>
            <canvas ref={gridCanvasRef} width={drawer.width} height={drawer.height} />
        </Stacked>
        <Stacked>
            <canvas ref={pathCanvasRef} width={drawer.width} height={drawer.height} />
        </Stacked>
    </div>
}

const Stacked = ({ children }: { children: React.ReactNode }) => <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{children}</div>

export default Canvas