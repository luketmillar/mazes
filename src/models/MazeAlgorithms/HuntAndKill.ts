import BaseMazeAlgorithm from './Base'
import Grid from '../Grid'
import * as MathUtils from '../../utils/math'
import Cell from '../Cell'

export default class HuntAndKill extends BaseMazeAlgorithm {
    public create(grid: Grid) {
        const cells = grid.cells
        let cell: Cell | undefined = MathUtils.pickRandom(cells)
        while (cell) {
            const unvisitedNeighbors: Cell[] = cell.unlinkedNeighbors
            if (unvisitedNeighbors.length > 0) {
                const neighbor = MathUtils.pickRandom(unvisitedNeighbors)
                grid.link(cell, neighbor)
                cell = neighbor
            } else {
                cell = undefined
                for (let i = 0; i < cells.length; i++) {
                    const c = cells[i]
                    const visitedNeighbors = c.linkedNeighbors
                    if (!c.isVisited && visitedNeighbors.length > 0) {
                        cell = c
                        const neighbor = MathUtils.pickRandom(visitedNeighbors)
                        grid.link(cell, neighbor)
                        break
                    }
                }
            }
        }
    }
}

// export default class HuntAndKill extends BaseMazeAlgorithm {
//     public create(grid: Grid) {
//         let unvisitedCells = [...grid.cells]
//         while (unvisitedCells.length > 0) {
//             let cell = this.getNextStart(grid, unvisitedCells)
//             if (cell !== undefined && cell.linkedNeighbors.length > 0) {
//                 const randomLinkedNeighbor = MathUtils.pickRandom(cell.linkedNeighbors)
//                 grid.link(cell, randomLinkedNeighbor)
//             }
//             while (cell) {
//                 unvisitedCells = unvisitedCells.filter(c => c !== cell)
//                 const nextCell = MathUtils.pickRandom(cell.unlinkedNeighbors)
//                 if (nextCell !== undefined) {
//                     grid.link(cell, nextCell)
//                 }
//                 cell = nextCell
//             }
//         }
//     }

//     private getNextStart(grid: Grid, unvisitedCells: Cell[]) {
//         if (unvisitedCells.length === grid.cells.length) {
//             return MathUtils.pickRandom(grid.cells)
//         }
//         for (let row = 0; row < grid.rowCount; row++) {
//             for (let column = 0; column < grid.columnCount; column++) {
//                 const cell = grid.getCell(row, column)!
//                 if (unvisitedCells.includes(cell) && cell.linkedNeighbors.length > 0) {
//                     return MathUtils.pickRandom(cell.linkedNeighbors)
//                 }
//             }
//         }
//     }
// }