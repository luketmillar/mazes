import Direction from "../models/Direction"
import Maze from "../models/Maze"
import Character from "../models/Chracter"
import { Position } from "../models/Position"

type Pixel = {
    x: number
    y: number
}

export default class MazeRenderer {
    public cellSize = 20
    private readonly maze: Maze
    private timestamp: number = performance.now()

    constructor(maze: Maze, cellSize: number) {
        this.maze = maze
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

    public drawStartEnd(ctx: CanvasRenderingContext2D, start: Position, end: Position) {
        // this.drawRectangle(ctx, start, '#15F46A')
        this.drawRectangle(ctx, end, `#E1219B`)
    }

    public drawCharacter(ctx: CanvasRenderingContext2D, character: Character) {
        this.drawRectangle(ctx, character.position, '#15F46A')
        // this.drawPath(ctx, character.history, '#15F46A', 1)
    }

    public setTime(timestamp: number) {
        this.timestamp = timestamp
    }

    public clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, this.width, this.height)
    }

    private get grid() {
        return this.maze.grid
    }

    private drawPath = (ctx: CanvasRenderingContext2D, path: Position[], color: string, width: number) => {
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

    private drawRectangle = (ctx: CanvasRenderingContext2D, position: Position, color: string) => {
        ctx.fillStyle = color
        const cellBounds = this.getCellBounds(position)
        const size = this.cellSize * 0.5
        ctx.fillRect(cellBounds.center - size / 2, cellBounds.middle - size / 2, size, size)
    }
    private getCellBounds = (position: Position) => {
        return {
            left: position.column * this.cellSize,
            right: (position.column + 1) * this.cellSize,
            top: position.row * this.cellSize,
            bottom: (position.row + 1) * this.cellSize,
            width: this.cellSize,
            height: this.cellSize,
            center: (position.column + 0.5) * this.cellSize,
            middle: (position.row + 0.5) * this.cellSize
        }
    }
    private drawLine = (ctx: CanvasRenderingContext2D, from: Pixel, to: Pixel) => {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
        ctx.closePath()
    }
}
