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
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
    ctx.closePath()
}
// const drawNumber = (ctx: CanvasRenderingContext2D, cell: Cell, value: number) => {
//     ctx.font = "16px Arial"
//     ctx.fillStyle = "#888"
//     ctx.textAlign = 'center'
//     ctx.textBaseline = 'middle'
//     const cellBounds = getCellBounds(cell)
//     ctx.fillText(`${value}`, cellBounds.center, cellBounds.middle)
// }
const drawRectangle = (ctx: CanvasRenderingContext2D, cell: Cell, color: string) => {
    ctx.fillStyle = color
    const cellBounds = getCellBounds(cell)
    const size = GridDrawer.CellSize * 0.5
    ctx.fillRect(cellBounds.center - size / 2, cellBounds.middle - size / 2, size, size)
}

const drawPath = (ctx: CanvasRenderingContext2D, path: Cell[], color: string, width: number) => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = width
    path.forEach((cell, i) => {
        const cellBounds = getCellBounds(cell)
        if (i === 0) {
            ctx.moveTo(cellBounds.center, cellBounds.middle)
        } else {
            ctx.lineTo(cellBounds.center, cellBounds.middle)
        }
    })
    ctx.stroke()
    ctx.closePath()
}

export default class GridDrawer {
    public static CellSize = 20
    private readonly grid: Grid
    constructor(grid: Grid) {
        this.grid = grid
    }

    public draw = (ctx: CanvasRenderingContext2D) => {
        ctx.strokeStyle = '#fff'
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
        drawPath(ctx, solution.path, "#1AF8FF", 2)
        this.drawStartEnd(ctx, solution)
    }

    public drawStartEnd(ctx: CanvasRenderingContext2D, solution: Solution) {
        drawRectangle(ctx, solution.start, '#15F46A')
        drawRectangle(ctx, solution.end, `#E1219B`)
    }

    public clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.width, this.height)
    }
}
