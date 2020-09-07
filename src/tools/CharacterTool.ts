import Tool from "./BaseTool"
import { Position } from "../models/Position"
import Direction from "../models/Direction"

export default class CharacterTool extends Tool {
    public static type = 'character'

    private isMoving = false

    private get character() {
        return this.controller.character
    }

    public onStart = (position: Position) => {
        if (!this.character.isInPath(position)) {
            return
        }
        this.isMoving = true
        this.character.jumpTo(position)
    }

    public onMove = (position: Position) => {
        if (!this.isMoving) {
            return
        }

        if (this.controller.canMoveTo(position)) {
            this.character.moveTo(position)
        }
    }

    public onEnd = (position: Position) => {
        this.isMoving = false
    }

    public onSwipe = (direction: Direction) => {
        switch (direction) {
            case Direction.North:
                return this.controller.up()
            case Direction.East:
                return this.controller.right()
            case Direction.South:
                return this.controller.down()
            case Direction.West:
                return this.controller.left()
        }
    }
}
