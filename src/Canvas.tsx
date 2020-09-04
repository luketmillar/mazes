import React from 'react'
import Grid from './models/Grid'
import GridDrawer from './views/GridDrawer'
import BinarySearchTree from './models/MazeAlgorithms/BinarySearchTree'
import Sidewinder from './models/MazeAlgorithms/Sidewinder'

const grid = new Grid(20, 20)
const algorithm = new Sidewinder()
algorithm.create(grid)
const drawer = new GridDrawer(grid)

const Canvas = () => {
    const ref = React.useRef<HTMLCanvasElement>(null)
    React.useEffect(() => {
        drawer.draw(ref.current!.getContext('2d')!)
    }, [ref])
    return <canvas ref={ref} width={drawer.width} height={drawer.height} />
}

export default Canvas