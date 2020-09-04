import Grid from "../models/Grid"
import Direction from "../models/Direction"
import Cell from "../models/Cell"
import { Solution } from "../models/Solver"

type Position = {
    x: number
    y: number
}
const getCellBounds = (cell: Cell) => {
    return {
        left: cell.column * GridDrawer.CellSize,
        right: (cell.column + 1) * GridDrawer.CellSize,
        top: cell.row * GridDrawer.CellSize,
        bottom: (cell.row + 1) * GridDrawer.CellSize,
        width: GridDrawer.CellSize,
        height: GridDrawer.CellSize,
        center: (cell.column + 0.5) * GridDrawer.CellSize,
        middle: (cell.row + 0.5) * GridDrawer.CellSize
    }
}
const drawLine = (ctx: CanvasRenderingContext2D, from: Position, to: Position) => {
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
}
const drawNumber = (ctx: CanvasRenderingContext2D, cell: Cell, value: number) => {
    ctx.font = "16px Arial"
    ctx.fillStyle = "#888"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const cellBounds = getCellBounds(cell)
    ctx.fillText(`${value}`, cellBounds.center, cellBounds.middle)
}
const drawRectangle = (ctx: CanvasRenderingContext2D, cell: Cell, color: string) => {
    ctx.fillStyle = color
    const cellBounds = getCellBounds(cell)
    const padding = 15
    ctx.fillRect(cellBounds.left + padding, cellBounds.top + padding, cellBounds.width - padding * 2, cellBounds.height - padding * 2)
}

export default class GridDrawer {
    public static CellSize = 40
    private readonly grid: Grid
    constructor(grid: Grid) {
        this.grid = grid
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, this.width, this.height)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2
        drawLine(ctx, { x: 0, y: 0 }, { x: this.width, y: 0 })
        this.grid.rows.forEach((row, r) => {
            const yTop = r * GridDrawer.CellSize
            const yBottom = (r + 1) * GridDrawer.CellSize
            drawLine(ctx, { x: 0, y: yTop }, { x: 0, y: yBottom })
            row.forEach((cell, j) => {
                const xLeft = j * GridDrawer.CellSize
                const xRight = (j + 1) * GridDrawer.CellSize
                if (!cell.isLinked(Direction.East)) {
                    drawLine(ctx, { x: xRight, y: yTop }, { x: xRight, y: yBottom })
                }
                if (!cell.isLinked(Direction.South)) {
                    drawLine(ctx, { x: xLeft, y: yBottom }, { x: xRight, y: yBottom })
                }
            })
        })
    }

    public get width() {
        return this.grid.columnCount * GridDrawer.CellSize
    }

    public get height() {
        return this.grid.rowCount * GridDrawer.CellSize
    }

    public drawSolution(ctx: CanvasRenderingContext2D, solution: Solution) {
        solution.path.forEach((cell, i) => {
            const first = i === 0
            const last = i === solution.path.length - 1
            const color = first ? '#15F46A' : last ? `#E1219B` : "#1AF8FF"
            drawRectangle(ctx, cell, color)
            // drawNumber(ctx, cell, i)
        })
    }
}
