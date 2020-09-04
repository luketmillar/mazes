import Grid from "./Grid"
import Direction from './Direction'

export default class Cell {
    public static createId = (row: number, column: number) => `${row}-${column}`
    public readonly row: number
    public readonly column: number

    public get id() {
        return Cell.createId(this.row, this.column)
    }

    private readonly grid: Grid
    private readonly links: Record<string, boolean> = {}

    constructor(row: number, column: number, grid: Grid) {
        this.grid = grid
        this.row = row
        this.column = column
    }

    public get north(): Cell | undefined {
        if (this.row === 0) {
            return undefined
        }
        return this.grid.getCell(this.row - 1, this.column)
    }
    public get south(): Cell | undefined {
        if (this.row === this.grid.rowCount - 1) {
            return undefined
        }
        return this.grid.getCell(this.row + 1, this.column)
    }
    public get east(): Cell | undefined {
        if (this.column === this.grid.columnCount - 1) {
            return undefined
        }
        return this.grid.getCell(this.row, this.column + 1)
    }
    public get west(): Cell | undefined {
        if (this.column === 0) {
            return undefined
        }
        return this.grid.getCell(this.row, this.column - 1)
    }

    public link(cell: Cell) {
        this.links[cell.id] = true
    }

    public unlink(cell: Cell) {
        delete this.links[cell.id]
    }

    public isLinked(direction: Direction) {
        const directionalNeighbor = this.getNeighbor(direction)
        if (directionalNeighbor === undefined) {
            return false
        }
        return this.links[directionalNeighbor.id]
    }

    private getNeighbor(direction: Direction) {
        switch (direction) {
            case Direction.North:
                return this.north
            case Direction.South:
                return this.south
            case Direction.East:
                return this.east
            case Direction.West:
                return this.west
        }
    }

    public get neighbors() {
        const neighborIds = Object.keys(this.links)
        return neighborIds.map(id => this.grid.getCellById(id)).filter(cell => cell !== undefined) as Cell[]
    }
}