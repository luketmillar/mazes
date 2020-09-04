import BaseMazeAlgorithm from './Base'
import Grid from '../Grid'
import Cell from '../Cell'

export default class BinarySearchTree extends BaseMazeAlgorithm {
    public create(grid: Grid) {
        grid.rows.forEach(row => {
            row.forEach(cell => {
                const options = [cell.east, cell.north].filter(Boolean) as Cell[]
                const neighbor = options[Math.floor(Math.random() * options.length)]
                if (neighbor) {
                    grid.link(cell, neighbor)
                }
            })
        })
    }
}