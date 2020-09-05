import BaseMazeAlgorithm from './Base'
import Grid from '../Grid'
import * as MathUtils from '../../utils/math'

export default class AldousBroder extends BaseMazeAlgorithm {
    public create(grid: Grid) {
        const cells = grid.cells
        let cell = MathUtils.pickRandom(cells)
        let unvisitedCellCount = cells.length - 1
        while (unvisitedCellCount > 0) {
            const randomCell = MathUtils.pickRandom(cell.neighbors)
            if (randomCell.links.length === 0) {
                grid.link(cell, randomCell)
                unvisitedCellCount--
            }
            cell = randomCell
        }
    }
}