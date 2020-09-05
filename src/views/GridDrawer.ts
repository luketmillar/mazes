import Grid from "../models/Grid"
import Direction from "../models/Direction"
import Cell from "../models/Cell"
import { Solution } from "../models/Solver"

type Position = {
    x: number
    y: number
}

export default class GridDrawer {
    public cellSize = 20
    private readonly grid: Grid
    constructor(grid: Grid, cellSize: number) {
        this.grid = grid
        this.cellSize = cellSize
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        this.drawLine(ctx, { x: 0, y: 0 }, { x: this.width, y: 0 })
        this.grid.rows.forEach((row, r) => {
            const yTop = r * this.cellSize
            const yBottom = (r + 1) * this.cellSize
            this.drawLine(ctx, { x: 0, y: yTop }, { x: 0, y: yBottom })
            row.forEach((cell, j) => {
                const xLeft = j * this.cellSize
                const xRight = (j + 1) * this.cellSize
                if (!cell.isLinked(Direction.East)) {
                    this.drawLine(ctx, { x: xRight, y: yTop }, { x: xRight, y: yBottom })
                }
                if (!cell.isLinked(Direction.South)) {
                    this.drawLine(ctx, { x: xLeft, y: yBottom }, { x: xRight, y: yBottom })
                }
            })
        })
    }

    public get width() {
        return this.grid.columnCount * this.cellSize
    }

    public get height() {
        return this.grid.rowCount * this.cellSize
    }

    public drawSolution(ctx: CanvasRenderingContext2D, solution: Solution) {
        this.drawPath(ctx, solution.path, "#1AF8FF", 2)
        this.drawStartEnd(ctx, solution)
    }

    public drawStartEnd(ctx: CanvasRenderingContext2D, solution: Solution) {
        this.drawRectangle(ctx, solution.start, '#15F46A')
        this.drawRectangle(ctx, solution.end, `#E1219B`)
    }

    public clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.width, this.height)
    }

    private drawPath = (ctx: CanvasRenderingContext2D, path: Cell[], color: string, width: number) => {
        ctx.beginPath()
        ctx.strokeStyle = color
        ctx.lineWidth = width
        path.forEach((cell, i) => {
            const cellBounds = this.getCellBounds(cell)
            if (i === 0) {
                ctx.moveTo(cellBounds.center, cellBounds.middle)
            } else {
                ctx.lineTo(cellBounds.center, cellBounds.middle)
            }
        })
        ctx.stroke()
        ctx.closePath()
    }

    private drawRectangle = (ctx: CanvasRenderingContext2D, cell: Cell, color: string) => {
        ctx.fillStyle = color
        const cellBounds = this.getCellBounds(cell)
        const size = this.cellSize * 0.5
        ctx.fillRect(cellBounds.center - size / 2, cellBounds.middle - size / 2, size, size)
    }
    private getCellBounds = (cell: Cell) => {
        return {
            left: cell.column * this.cellSize,
            right: (cell.column + 1) * this.cellSize,
            top: cell.row * this.cellSize,
            bottom: (cell.row + 1) * this.cellSize,
            width: this.cellSize,
            height: this.cellSize,
            center: (cell.column + 0.5) * this.cellSize,
            middle: (cell.row + 0.5) * this.cellSize
        }
    }
    private drawLine = (ctx: CanvasRenderingContext2D, from: Position, to: Position) => {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
        ctx.closePath()
    }
}
