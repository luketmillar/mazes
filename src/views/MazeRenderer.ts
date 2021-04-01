import Direction from "../models/Direction"
import Maze from "../models/Maze"
import Character from "../models/Character"
import { Position } from "../models/Position"
import { Pixel } from "../utils/Types"

export default class MazeRenderer {
    public cellSize = 20
    private readonly maze: Maze
    private timestamp: number = performance.now()

    constructor(maze: Maze, cellSize: number) {
        this.maze = maze
        this.cellSize = cellSize
    }

    public draw = (ctx: CanvasRenderingContext2D, screenshot = false) => {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2 * window.devicePixelRatio
        if (screenshot) {
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
    }

    public get width() {
        return this.grid.columnCount * this.cellSize
    }

    public get height() {
        return this.grid.rowCount * this.cellSize
    }

    // public drawStartEnd(ctx: CanvasRenderingContext2D, start: Position, end: Position, overlay = false, screenshot = false) {
    //     if (screenshot) {
    //         this.drawRectangle(ctx, start, overlay ? '#07C1FF' : `#43B8DF`)
    //     }
    //     this.drawRectangle(ctx, end, `#E1219B`)
    // }

    public drawCharacter(ctx: CanvasRenderingContext2D, character: Character, end: Position, screenshot = false) {
        if (screenshot) {
            character.paths.forEach(path => {
                this.drawPath(ctx, path, '#43B8DF', this.cellSize * 0.3)
            })
            return
        }
        if (isNaN(character.position.column)) {
            return
        }
        ctx.save()
        const cellBounds = this.getCellBounds(character.position)
        ctx.transform(1, 0, 0, 1, -cellBounds.left + ctx.canvas.width / 2, -cellBounds.top + ctx.canvas.height / 2)
        this.drawRectangle(ctx, character.position, '#07C1FF')

        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2 * window.devicePixelRatio
        const queue: Array<{ row: number, column: number, direction?: Direction }> = [{ row: character.row, column: character.column }]
        const drawWalls = (row: number, column: number, direction?: Direction) => {
            const cell = this.grid.rows[row][column]
            const yTop = row * this.cellSize
            const yBottom = (row + 1) * this.cellSize
            const xLeft = column * this.cellSize
            const xRight = (column + 1) * this.cellSize
            if (!cell.isLinked(Direction.East)) {
                this.drawLine(ctx, { x: xRight, y: yTop }, { x: xRight, y: yBottom })
            } else if (direction === undefined || direction === Direction.East) {
                const east = cell.east
                if (east) {
                    queue.push({ row: east.row, column: east.column, direction: Direction.East })
                }
            }
            if (!cell.isLinked(Direction.South)) {
                this.drawLine(ctx, { x: xLeft, y: yBottom }, { x: xRight, y: yBottom })
            } else if (direction === undefined || direction === Direction.South) {
                const south = cell.south
                if (south) {
                    queue.push({ row: south.row, column: south.column, direction: Direction.South })
                }
            }
            if (!cell.isLinked(Direction.North)) {
                this.drawLine(ctx, { x: xLeft, y: yTop }, { x: xRight, y: yTop })
            } else if (direction === undefined || direction === Direction.North) {
                const north = cell.north
                if (north) {
                    queue.push({ row: north.row, column: north.column, direction: Direction.North })
                }
            }
            if (!cell.isLinked(Direction.West)) {
                this.drawLine(ctx, { x: xLeft, y: yTop }, { x: xLeft, y: yBottom })
            } else if (direction === undefined || direction === Direction.West) {
                const west = cell.west
                if (west) {
                    queue.push({ row: west.row, column: west.column, direction: Direction.West })
                }
            }
        }
        while (queue.length > 0) {
            const position = queue.shift()
            if (position === undefined) {
                break
            }
            drawWalls(position.row, position.column, position.direction)
        }
        this.drawRectangle(ctx, end, `#E1219B`)
        ctx.restore()
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
        path.forEach((position, i) => {
            const cellBounds = this.getCellBounds(position)
            if (i === 0) {
                if (path.length > 1) {
                    const currentCenter = this.getCenterPixel(position)
                    const nextCenter = this.getCenterPixel(path[i + 1])
                    const extension = getPathExtension(currentCenter, nextCenter, width)
                    ctx.moveTo(cellBounds.center + extension.x, cellBounds.middle + extension.y)
                } else {
                    ctx.moveTo(cellBounds.center, cellBounds.middle)
                }
            } else if (i === path.length - 1 && i > 0) {
                const currentCenter = this.getCenterPixel(position)
                const nextCenter = this.getCenterPixel(path[i - 1])
                const extension = getPathExtension(currentCenter, nextCenter, width)
                ctx.lineTo(cellBounds.center + extension.x, cellBounds.middle + extension.y)
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
        const size = this.cellSize * 0.7
        console.log(size)
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
    private getCenterPixel = (position: Position) => {
        const { center, middle } = this.getCellBounds(position)
        return { x: center, y: middle }
    }
    private drawLine = (ctx: CanvasRenderingContext2D, from: Pixel, to: Pixel) => {
        ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
        ctx.stroke()
        ctx.closePath()
    }
}

const getPathExtension = (end: Pixel, next: Pixel, width: number) => {
    if (end.x < next.x) {
        return { x: -width / 2, y: 0 }
    } else if (end.x > next.x) {
        return { x: width / 2, y: 0 }
    } else if (end.y > next.y) {
        return { x: 0, y: width / 2 }
    } else if (end.y < next.y) {
        return {
            x: 0, y: -width / 2
        }
    }
    return { x: 0, y: 0 }
}