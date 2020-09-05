import Grid from "./Grid"
import Cell from "./Cell"

type Distances = Record<string, number>

export type Solution = {
    start: Cell
    end: Cell
    path: Cell[]
}

class Solver {
    public solve(grid: Grid): Solution {
        const start = this.findFarthestCell(grid)
        const distances = this.findDistances(grid, start)
        const end = this.getFarthestCell(grid, distances)
        const path = this.findPath(distances, start, end)
        return { start, end, path }
    }

    private findFarthestCell = (grid: Grid) => {
        const firstCell = grid.getCell(0, 0)!
        const distances = this.findDistances(grid, firstCell)
        const farthestCell = this.getFarthestCell(grid, distances)
        return farthestCell
    }

    private findDistances = (grid: Grid, startingCell: Cell): Distances => {
        const cellsToVisit: Array<Cell> = [startingCell]
        const distances: Record<string, number> = { [startingCell.id]: 0 }
        while (cellsToVisit.length > 0) {
            const cell = cellsToVisit.shift()!
            const distance = distances[cell.id]!
            cell.links.forEach(neighbor => {
                if (distances[neighbor.id] !== undefined) {
                    return
                }
                cellsToVisit.push(neighbor)
                distances[neighbor.id] = distance + 1
            })
        }
        return distances
    }

    private getFarthestCell = (grid: Grid, distances: Distances) => {
        const farthestId = Object.keys(distances).reduce((farthest: undefined | string, id) => {
            const distance = distances[id]!
            const farthestDistance = farthest ? distances[farthest]! : 0
            if (distance < farthestDistance) {
                return farthest
            } else {
                return id
            }
        }, undefined)!
        return grid.getCellById(farthestId)!
    }

    private findPath = (distances: Distances, start: Cell, end: Cell) => {
        const path: Cell[] = [end]
        let distance = distances[end.id]
        while (distance > 0) {
            const currentCell = path[path.length - 1]
            const nextDistance = distance - 1
            const next = currentCell.links.find(link => distances[link.id] === nextDistance)!
            distance = distance - 1
            path.push(next)
        }
        return path.reverse()
    }
}

export default new Solver()