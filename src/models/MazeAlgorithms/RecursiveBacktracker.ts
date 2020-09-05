import BaseMazeAlgorithm from './Base'
import Grid from '../Grid'
import * as MathUtils from '../../utils/math'
import Cell from '../Cell'

export default class RecursiveBacktracker extends BaseMazeAlgorithm {
    public create(grid: Grid) {
        const cells = grid.cells
        const start = MathUtils.pickRandom(cells)
        const stack: Cell[] = [start]

        while (stack.length > 0) {
            let current = stack[stack.length - 1]
            const neighbors = current.unlinkedNeighbors

            if (neighbors.length === 0) {
                stack.pop()
            } else {
                const neighbor = MathUtils.pickRandom(neighbors)
                grid.link(current, neighbor)
                stack.push(neighbor)
            }
        }
    }
}