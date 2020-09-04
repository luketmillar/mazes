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
    const ref = React.useRef<HTMLCanvasElement>(null)
    React.useEffect(() => {
        const ctx = ref.current!.getContext('2d')!
        drawer.draw(ctx)
        if (showSolution) {
            drawer.drawSolution(ctx, solution)
        } else {
            drawer.drawStartEnd(ctx, solution)
        }
    }, [ref, showSolution])
    return <canvas onClick={() => setShowSolution(value => !value)} ref={ref} width={drawer.width} height={drawer.height} />
}

export default Canvas