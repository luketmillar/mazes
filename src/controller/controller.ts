import Character from "../models/Chracter"
import Maze from "../models/Maze"
import MazeRenderer from "../views/MazeRenderer"
import Direction from "../models/Direction"
import Subscribable, { Fn } from "../utils/Subscribable"

export enum ControllerEvent {
    Maze,
    Character,
    All
}

export default class Controller extends Subscribable<ControllerEvent> {
    private maze: Maze
    private character: Character
    public readonly renderer: MazeRenderer

    constructor() {
        super()
        this.maze = new Maze(20, 20)
        this.renderer = new MazeRenderer(this.maze, 20)
        this.character = new Character(this.maze.start.row, this.maze.start.column)
    }

    public subscribe(fn: Fn<ControllerEvent>) {
        const unsubscribe = super.subscribe(fn)
        this.notify(ControllerEvent.All)
        return unsubscribe
    }

    public newLevel() {
        this.maze = new Maze(20, 20)
        this.character = new Character(this.maze.start.row, this.maze.start.row)
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
        this.character.setPosition(cell)
        this.notify(ControllerEvent.Character)
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
        this.character.setPosition(cell)
        this.notify(ControllerEvent.Character)
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
        this.character.setPosition(cell)
        this.notify(ControllerEvent.Character)
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
        this.character.setPosition(cell)
        this.notify(ControllerEvent.Character)
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

    private get currentCell() {
        return this.maze.grid.getCell(this.character.row, this.character.column)!
    }
}
