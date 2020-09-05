import BaseMazeAlgorithm from './Base'
import Grid from '../Grid'
import * as MathUtils from '../../utils/math'
import Cell from '../Cell'

export default class Wilson extends BaseMazeAlgorithm {
    public create(grid: Grid) {
        let unvisited: string[] = []
        grid.cells.forEach(cell => {
            unvisited.push(cell.id)
        })

        const firstId = MathUtils.pickRandom(unvisited)
        unvisited = unvisited.filter(id => id !== firstId)

        while (unvisited.length > 0) {
            let cellId = MathUtils.pickRandom(unvisited)
            let cell = grid.getCellById(cellId)!
            let path: Cell[] = [cell]

            while (unvisited.includes(cell.id)) {
                cell = MathUtils.pickRandom(cell.neighbors)
                const position = path.indexOf(cell)
                if (position !== -1) {
                    path = path.slice(0, position + 1)
                } else {
                    path.push(cell)
                }
            }

            for (let i = 0; i <= path.length - 2; i++) {
                grid.link(path[i], path[i + 1])
                unvisited = unvisited.filter(id => id !== path[i].id)
            }
        }
    }
}