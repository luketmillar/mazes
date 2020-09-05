export default class Mask {
    public readonly bitmask: boolean[][]
    public rows: number
    public columns: number

    constructor(rows: number, columns: number) {
        this.rows = rows
        this.columns = columns
        this.bitmask = []
        for (let row = 0; row < rows; row++) {
            const rowArray: boolean[] = []
            this.bitmask.push(rowArray)
            for (let column = 0; column < columns; column++) {
                rowArray.push(true)
            }
        }
    }

    public set(row: number, column: number, value: boolean) {
        this.bitmask[row][column] = value
    }

    public get(row: number, column: number) {
        return this.bitmask[row][column]
    }
}