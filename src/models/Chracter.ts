import Cell from "./Cell"

interface Position {
    row: number
    column: number
}

export default class Character {
    public row: number
    public column: number
    public readonly history: Position[]

    constructor(row: number, column: number) {
        this.row = row
        this.column = column
        this.history = [this.position]
    }

    public setPosition(cell: Cell) {
        this.row = cell.row
        this.column = cell.column
        this.history.push(this.position)
    }

    public setRow(row: number) {
        this.row = row
        this.history.push(this.position)
    }

    public setColumn(column: number) {
        this.column = column
        this.history.push(this.position)
    }

    public get position() {
        return { row: this.row, column: this.column }
    }
}