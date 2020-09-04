import Grid from "../models/Grid"
import Direction from "../models/Direction"

type Position = {
    x: number
    y: number
}
const drawLine = (ctx: CanvasRenderingContext2D, from: Position, to: Position) => {
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
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
}
