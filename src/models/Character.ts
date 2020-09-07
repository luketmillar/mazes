import { Position, getDistance } from "./Position"

export default class Character {
    public row: number
    public column: number
    public readonly paths: Position[][]
    private get path() {
        return this.paths[this.paths.length - 1]
    }

    private animation: Animation | undefined

    constructor(row: number, column: number) {
        this.row = row
        this.column = column
        this.paths = [[this.position]]
    }

    public moveTo(position: Position, animate = false) {
        if (animate) {
            const currentPositon = this.position
            const distance = getDistance(position, currentPositon)
            this.animation = new Animation(currentPositon, position, distance * 50)
            this.animation.start(performance.now())
        }

        if (this.row === position.row && this.column === position.column) {
            // no change
            return
        }
        this.row = position.row
        this.column = position.column
        this.path.push(position)
    }

    public jumpTo(position: Position) {
        this.row = position.row
        this.column = position.column
        this.paths.push([position])
    }

    public get position() {
        if (this.animation) {
            return this.animation.getPosition()
        }
        return { row: this.row, column: this.column }
    }

    public tickTime(timeStamp: number) {
        if (this.animation === undefined) {
            return
        }
        const animationTime = this.animation.calculateTime(timeStamp)
        this.animation.setTime(animationTime)
        if (this.animation.isComplete) {
            this.animation = undefined
        }
    }

    public get isAnimating() {
        return this.animation !== undefined
    }

    public isInPath(position: Position) {
        return this.paths.some(path => path.some(p => p.row === position.row && p.column === position.column))
    }
}


class Animation {
    private startPosition: Position
    private endPosition: Position
    private duration: number
    private time: number = 0
    private startTimestamp: number = 0

    constructor(start: Position, end: Position, duration: number) {
        this.startPosition = start
        this.endPosition = end
        this.duration = duration
    }

    public setTime(time: number) {
        this.time = time
    }

    public getPosition() {
        return { row: this.getRow(this.time), column: this.getColumn(this.time) }
    }

    public start(timestamp: number) {
        this.startTimestamp = timestamp
    }

    public calculateTime(timestamp: number) {
        return timestamp - this.startTimestamp
    }

    public get isComplete() {
        return this.time >= this.duration
    }

    private getRow(time: number) {
        const startRow = this.startPosition.row
        const endRow = this.endPosition.row
        const percentage = time / this.duration
        const easedPercentage = this.getEaseValue(percentage)
        return (endRow - startRow) * easedPercentage + startRow
    }

    private getColumn(time: number) {
        const startColumn = this.startPosition.column
        const endColumn = this.endPosition.column
        const percentage = time / this.duration
        const easedPercentage = this.getEaseValue(percentage)
        return (endColumn - startColumn) * easedPercentage + startColumn
    }

    private getEaseValue = (x: number) => {
        return x * x * x
    }
}