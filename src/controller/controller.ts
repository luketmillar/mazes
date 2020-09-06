import Character from "../models/Chracter"
import Maze from "../models/Maze"
import MazeRenderer from "../views/MazeRenderer"
import Direction from "../models/Direction"
import Subscribable, { Fn } from "../utils/Subscribable"
import { Position } from "../models/Position"

export enum ControllerEvent {
    Maze,
    Character,
    All,
    Win
}

export default class Controller extends Subscribable<ControllerEvent> {
    private maze: Maze
    private character: Character
    public renderer: MazeRenderer

    constructor() {
        super()
        this.maze = new Maze(20, 40)
        this.renderer = new MazeRenderer(this.maze, 40)
        this.character = new Character(this.maze.start.row, this.maze.start.column)
    }

    public subscribe(fn: Fn<ControllerEvent>) {
        const unsubscribe = super.subscribe(fn)
        this.notify(ControllerEvent.All)
        return unsubscribe
    }

    public newLevel() {
        this.maze = new Maze(30, 40)
        this.renderer = new MazeRenderer(this.maze, 40)
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

    public drawMaze(ctx: CanvasRenderingContext2D) {
        this.renderer.clear(ctx)
        this.renderer.draw(ctx)
        this.renderer.drawStartEnd(ctx, this.maze.start, this.maze.end)
    }

    public drawCharacter(ctx: CanvasRenderingContext2D) {
        this.renderer.clear(ctx)
        this.renderer.drawCharacter(ctx, this.character)
    }

    public get canvasSize() {
        return { width: this.renderer.width, height: this.renderer.height }
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
        this.character.setPosition(position)
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
