import BaseMazeAlgorithm from './Base'
import Grid from '../Grid'
import Cell from '../Cell'
import * as MathUtils from '../../utils/math'

export default class Sidewinder extends BaseMazeAlgorithm {
    public create(grid: Grid) {
        grid.rows.forEach(row => {
            let run: Cell[] = []
            row.forEach(cell => {
                run.push(cell)

                const atEasternBorder = cell.east === undefined
                const atNorthernBorder = cell.north === undefined

                if (atEasternBorder || (!atNorthernBorder && MathUtils.randomNumber(2) === 0)) {
                    const bridgeToNorth = MathUtils.pickRandom(run)
                    if (bridgeToNorth.north) {
                        grid.link(bridgeToNorth, bridgeToNorth.north)
                    }
                    run = []
                    return
                } else {
                    grid.link(cell, cell.east!)
                    run.push(cell)
                }
            })
        })
    }
}