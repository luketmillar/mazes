import { Position, positionsAreEqual, Pixel, Callbacks, getPixelDistance, getPixelDiff } from './Types'
import Direction from '../models/Direction'

interface DownOptions {
    position: Position
    pixel: Pixel
    snap: boolean
}

enum InputEvent {
    Start,
    Move,
    End
}

interface IEventOptions {
    metaKey?: boolean
}

const calcAngleDegrees = (x: number, y: number) => {
    return Math.atan2(y, x) * 180 / Math.PI
}

class SwipeGestureRecognizer {
    private readonly start: Pixel
    private lastPixel: Pixel
    private lastDistance: number = 0
    private swipeDirection?: Direction
    constructor(pixel: Pixel) {
        this.start = pixel
        this.lastPixel = pixel
    }

    public onMove(pixel: Pixel) {
        const distance = getPixelDistance(this.start, pixel)
        const direction = this.getDirection(pixel)

        if (this.swipeDirection === undefined) {
            if (distance < 20) {
                // dont start yet
                return true
            }
            if (direction === undefined) {
                return false
            }
            this.swipeDirection = direction
        } else {
            // make sure continuing in the right direction
            if (direction !== this.swipeDirection) {
                return false
            }
            // and getting farther away
            if (distance < this.lastDistance) {
                return false
            }
        }
        this.lastDistance = distance
        this.lastPixel = pixel
        return true
    }

    public onEnd() {
        return this.swipeDirection
    }

    private getDirection(pixel: Pixel) {
        const diff = getPixelDiff(pixel, this.start)
        const angle = calcAngleDegrees(Math.abs(diff.x), Math.abs(diff.y))
        if (angle > 20 && angle < 70) {
            // ignore general diaganols
            return
        }
        if (Math.abs(diff.x) > Math.abs(diff.y)) {
            // horizontal
            if (diff.x < 0) {
                return Direction.West
            } else {
                return Direction.East
            }
        } else {
            // vertical
            if (diff.y < 0) {
                return Direction.North
            } else {
                return Direction.South
            }
        }
    }
}

export default class InputHandler {
    private get canvasRect(): DOMRect | undefined {
        return this.element?.getBoundingClientRect()
    }

    private downOptions: DownOptions | undefined
    private get isDrawing() {
        return this.downOptions !== undefined
    }
    private _lastPosition: Position | undefined
    private get lastPosition() {
        return this._lastPosition
    }
    private set lastPosition(value: Position | undefined) {
        if (!positionsAreEqual(this._lastPosition, value)) {
            this._lastPosition = value
            if (value !== undefined) {
                this.notify(InputEvent.Move, value)
            }
        }
    }

    private subscriptions: Array<Callbacks> = []
    private readonly rows: number = 0
    private readonly columns: number = 0
    private readonly cellSize: number = 0
    private element: HTMLDivElement | undefined
    private swipeGestureRecognizer?: SwipeGestureRecognizer
    private isSwiping = false
    constructor(rows: number, columns: number, cellSize: number) {
        this.rows = rows
        this.columns = columns
        this.cellSize = cellSize
    }

    public setElement = (element: HTMLDivElement) => {
        this.element = element
    }

    public onMouseDown = (pixel: Pixel, options?: IEventOptions) => {
        this.swipeGestureRecognizer = new SwipeGestureRecognizer(pixel)
        if (this.isSwiping) {
            return
        }
        const position = this.positionFromPixel(pixel)
        if (position === undefined) {
            return
        }
        this.downOptions = {
            position,
            snap: !!options?.metaKey,
            pixel
        }
        this.notify(InputEvent.Start, position)
        this.lastPosition = position
    }

    public onMouseMove = (pixel: Pixel) => {
        if (this.swipeGestureRecognizer !== undefined) {
            if (!this.swipeGestureRecognizer!.onMove(pixel)) {
                this.swipeGestureRecognizer = undefined
            }
        }
        if (!this.isDrawing) {
            return
        }

        let position = this.positionFromPixel(pixel)
        if (position === undefined) {
            return
        }

        if (!positionsAreEqual(this.lastPosition, position)) {
            this.lastPosition = position
        }
    }

    public onMouseUp = () => {
        const swipeDirection = this.swipeGestureRecognizer?.onEnd()
        this.swipeGestureRecognizer = undefined
        if (swipeDirection !== undefined) {
            this.isSwiping = true
            this.notifySwipe(swipeDirection)
        }
        if (this.lastPosition !== undefined) {
            this.notify(InputEvent.End, this.lastPosition)
        }
        this.downOptions = undefined
        this.lastPosition = undefined
    }

    public subscribe(callbacks: Callbacks) {
        this.subscriptions.push(callbacks)
        return () => {
            this.subscriptions = this.subscriptions.filter(c => c !== callbacks)
        }
    }

    private positionFromPixel = (sceenPixel: Pixel): Position | undefined => {
        const canvasPosition = { x: sceenPixel.x - this.canvasRect!.x, y: sceenPixel.y - this.canvasRect!.y }
        const screenCellSize = this.cellSize / window.devicePixelRatio
        let column = Math.floor(canvasPosition.x / screenCellSize)
        let row = Math.floor(canvasPosition.y / screenCellSize)
        if (row < 0) {
            row = 0
        }
        if (row > this.rows - 1) {
            row = this.rows - 1
        }
        if (column < 0) {
            column = 0
        }
        if (column > this.columns - 1) {
            column = this.columns - 1
        }
        return { row, column }
    }

    private notify = (event: InputEvent, position: Position) => {
        this.subscriptions.forEach(s => {
            switch (event) {
                case InputEvent.Start:
                    s.onStart(position)
                    return
                case InputEvent.Move:
                    s.onMove(position)
                    return
                case InputEvent.End:
                    s.onEnd(position)
                    return
            }
        })
    }

    private notifySwipe = (direction: Direction) => {
        this.subscriptions.forEach(s => {
            s.onSwipe(direction)
        })
    }
}
