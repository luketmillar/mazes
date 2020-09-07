import { Position, positionsAreEqual, Pixel, Callbacks } from './Types'


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
    constructor(rows: number, columns: number, cellSize: number) {
        this.rows = rows
        this.columns = columns
        this.cellSize = cellSize
    }

    public setElement = (element: HTMLDivElement) => {
        this.element = element
    }

    public onMouseDown = (pixel: Pixel, options?: IEventOptions) => {
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
}
