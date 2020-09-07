import Character from "../models/Character"
import Maze from "../models/Maze"
import MazeRenderer from "../views/MazeRenderer"
import Direction from "../models/Direction"
import Subscribable, { Fn } from "../utils/Subscribable"
import { Position } from "../models/Position"
import ToolStack from "../tools/ToolStack"

export enum ControllerEvent {
    Maze,
    Character,
    All,
    Win
}

export default class Controller extends Subscribable<ControllerEvent> {
    public maze: Maze
    public character: Character
    public renderer: MazeRenderer
    public readonly toolStack: ToolStack
    private rows: number
    private columns: number
    private cellSize: number

    constructor(rows: number, columns: number, cellSize: number) {
        super()
        this.rows = rows
        this.columns = columns
        this.cellSize = cellSize * window.devicePixelRatio
        this.maze = new Maze(this.rows, this.columns)
        this.renderer = new MazeRenderer(this.maze, this.cellSize)
        this.character = new Character(this.maze.start.row, this.maze.start.column)
        this.toolStack = new ToolStack(this)
    }

    public subscribe(fn: Fn<ControllerEvent>) {
        const unsubscribe = super.subscribe(fn)
        this.notify(ControllerEvent.All)
        return unsubscribe
    }

    public mazeSize(rows: number, columns: number, cellSize: number) {
        this.rows = rows
        this.columns = columns
        this.cellSize = cellSize * window.devicePixelRatio
    }

    public newLevel() {
        this.maze = new Maze(this.rows, this.columns)
        this.renderer = new MazeRenderer(this.maze, this.cellSize)
        this.character = new Character(this.maze.start.row, this.maze.start.column)
        this.notify(ControllerEvent.All)
    }

    public up() {
        let cell = this.currentCell
        while (cell.canGo(Direction.North)) {
            const next = cell.north!
            cell = next
            if (cell.atIntersection) {
                break
            }
        }
        this.moveCharacter(cell)
    }
    public down() {
        let cell = this.currentCell
        while (cell.canGo(Direction.South)) {
            const next = cell.south!
            cell = next
            if (cell.atIntersection) {
                break
            }
        }
        this.moveCharacter(cell)
    }
    public left() {
        let cell = this.currentCell
        while (cell.canGo(Direction.West)) {
            const next = cell.west!
            cell = next
            if (cell.atIntersection) {
                break
            }
        }
        this.moveCharacter(cell)

    }
    public right() {
        let cell = this.currentCell
        while (cell.canGo(Direction.East)) {
            const next = cell.east!
            cell = next
            if (cell.atIntersection) {
                break
            }
        }
        this.moveCharacter(cell)
    }

    public canMoveTo(position: Position) {
        const cell = this.currentCell
        const nextCell = this.maze.grid.getCell(position.row, position.column)!
        return cell.links.some(link => link.row === nextCell.row && link.column === nextCell.column)
    }

    public drawMaze(ctx: CanvasRenderingContext2D, clear = true) {
        if (clear) {
            this.renderer.clear(ctx)
        }
        this.renderer.draw(ctx)
        this.renderer.drawStartEnd(ctx, this.maze.start, this.maze.end)
    }

    public drawCharacter(ctx: CanvasRenderingContext2D, clear = true) {
        if (clear) {
            this.renderer.clear(ctx)
        }
        this.renderer.drawCharacter(ctx, this.character)
    }

    public drawEnd(ctx: CanvasRenderingContext2D, clear = true) {
        if (clear) {
            this.renderer.clear(ctx)
        }
        this.renderer.drawStartEnd(ctx, this.maze.start, this.maze.end, true)
    }

    public get canvasSize() {
        return { width: this.renderer.width, height: this.renderer.height }
    }

    public get screenSize() {
        return { width: this.canvasSize.width / window.devicePixelRatio, height: this.canvasSize.height / window.devicePixelRatio }
    }

    public tickTime(timestamp: number) {
        this.character.tickTime(timestamp)
        this.notify(ControllerEvent.Character)
        this.checkWin()
    }

    private moveCharacter(position: Position) {
        if (this.character.isAnimating) {
            // cant move character while animating
            return
        }
        this.character.moveTo(position, true)
        this.notify(ControllerEvent.Character)
        this.checkWin()
    }

    private get currentCell() {
        return this.maze.grid.getCell(this.character.row, this.character.column)!
    }

    private checkWin() {
        if (this.character.position.row === this.maze.end.row && this.character.position.column === this.maze.end.column) {
            // win!!
            this.notify(ControllerEvent.Win)
        }
    }
}
