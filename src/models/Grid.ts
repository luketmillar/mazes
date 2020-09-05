import Cell from "./Cell"

export default class Grid {
    private readonly cellsById: Record<string, Cell | undefined> = {}
    public readonly rowCount: number
    public readonly columnCount: number

    constructor(rows: number, columns: number) {
        this.rowCount = rows
        this.columnCount = columns
        this.generateCells()
    }

    public get cells() {
        return Object.values(this.cellsById) as Cell[]
    }

    public get rows() {
        const rows: Cell[][] = []
        for (let row = 0; row < this.rowCount; row++) {
            rows.push(this.getRow(row))
        }
        return rows
    }

    public getRow = (row: number) => {
        const cells: Cell[] = []
        for (let column = 0; column < this.columnCount; column++) {
            cells.push(this.getCell(row, column)!)
        }
        return cells
    }

    public get columns() {
        const columns: Cell[][] = []
        for (let column = 0; column < this.columnCount; column++) {
            columns.push(this.getColumn(column))
        }
        return columns
    }

    public getColumn = (column: number) => {
        const cells: Cell[] = []
        for (let row = 0; row < this.rowCount; row++) {
            cells.push(this.getCell(row, column)!)
        }
        return cells
    }

    public createCell = (row: number, column: number) => {
        const cell = new Cell(row, column, this)
        this.cellsById[cell.id] = cell
        return cell
    }

    public getCell = (row: number, column: number) => {
        const id = Cell.createId(row, column)
        return this.getCellById(id)
    }

    public getCellById = (id: string) => {
        return this.cellsById[id]
    }

    public link = (a: Cell, b: Cell) => {
        a.link(b)
        b.link(a)
    }

    public unlink = (a: Cell, b: Cell) => {
        a.unlink(b)
        b.unlink(a)
    }

    public get deadends() {
        return this.cells.filter(cell => cell.links.length === 1)
    }

    private generateCells = () => {
        for (let row = 0; row < this.rowCount; row++) {
            for (let column = 0; column < this.columnCount; column++) {
                this.createCell(row, column)
            }
        }
    }
}